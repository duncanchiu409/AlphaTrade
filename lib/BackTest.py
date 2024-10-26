import numpy as np
import pandas as pd
import yfinance as yf
from yfinance import shared
import os
import json
from tabulate import tabulate, SEPARATING_LINE
import shortuuid
from utils.dates import findDatetime

class BackTest:
    def __init__(self, model, location='models'):
        self.model = model()
        self.location = location
        self.model.model_base_path = os.path.join(location, self.model.model_name)
        self.records_columns = ['Order no', 'Equity Name', 'Trade', 'Entry Time', 'Entry Price', 'Exit Time', 'Exit Price', 'Exit Type', 'Quantity', 'Position Size', 'PNL', '% PNL', 'Holding Period']
        self.tradelog = pd.DataFrame(columns=self.records_columns)
        self.hedgelog = pd.DataFrame(columns=self.records_columns)
        self.trading_records = pd.DataFrame(columns=self.records_columns)

    def prepare_run(self):
        os.makedirs(f'{self.location}/', exist_ok=True)
        if os.path.exists(self.model.model_base_path):
            for folder in ['data', 'summary']:
                folder_path = os.path.join(self.model.model_base_path, folder)
                for file in os.listdir(folder_path):
                    os.remove(os.path.join(folder_path, file))
        else:
            os.makedirs(self.model.model_base_path)
            for folder in ['data', 'summary']:
                folder_path = os.path.join(self.model.model_base_path, folder)
                os.makedirs(folder_path, exist_ok=True)

    def load_dates(self):
        self.dates = {}
        for interval in self.model.universe_management.intervals:
            try:
                dateColumn = findDatetime(interval)
                df = pd.read_csv(f"{self.model.api_model_management.get_model_data_path()}/{self.model.date_system}-{interval}.csv", parse_dates=[dateColumn])
                if self.model.date_system not in shared._ERRORS:
                    df['Date'] = df[dateColumn]
                    self.dates[interval] = df['Date']
                else:
                    raise Exception('Error: loading dates')
            except Exception as e:
                print(f"{interval}: {e}")

    def load_rows(self, row):
        return np.logical_and(self.tradelog['Equity Name'] == row['Equity Name'], self.tradelog['Trade'] == row['Trade'])

    def enter_equity(self, row, allocation):
        row = {
            'Order no': shortuuid.uuid(),
            'Equity Name': row['Equity Name'],
            'Trade': row['Trade'],
            'Entry Time': row['Date'],
            'Entry Price': round(row['Open'], 2),
            'Quantity': round(allocation / row['Open'], 3),
            'Position Size': allocation
        }
        row = pd.DataFrame([row], columns=self.records_columns)

        # Hedging Mechanism
        if self.model.hedging_system != None:
            hedges = self.model.hedging_system.get_hedge_entry(row)
            self.hedgelog = pd.concat([self.hedgelog, hedges], ignore_index=True)

        self.tradelog = pd.concat([self.tradelog, row], ignore_index=True)

    def exit_equity(self, row):
        # Selling Mechanism
        i = self.load_rows(row)
        if i.sum() == 0:
            return 0.0
        else:
            log = self.tradelog[i].head(1)

        # find exiting tradelog
        self.tradelog = self.tradelog[self.tradelog.ne(log)]
        self.tradelog.dropna(subset=['Equity Name'], inplace=True)

        # Calculate reminding information
        # Can only handle 1 Selling now
        multi = -1 if row['Trade'] == 'Short' else 1
        log['Exit Time'] = row['Date']
        log['Exit Price'] = round(row['Close'], 2)
        log['Exit Type'] = 'Complete'
        log['Holding Period'] = row['Date'] - log['Entry Time']
        charge = self.model.charge_system.calculate_charge(log)
        log['PNL'] = round(multi * (log['Exit Price'] - log['Entry Price']) * log['Quantity'] - charge, 3)
        log['% PNL'] = round(log['PNL'] / log['Position Size'] * 100, 2)

        # Hedging Mechanism
        if self.model.hedging_system != None:
            self.model.hedging_system.get_hedge_exit(log, self.hedgelog)
            i = self.hedgelog['Order no'].map(lambda x: True if x in log['Order no'].values else False)
            if i.shape[0] != 0:
                charge = self.model.charge_system.calculate_charge(self.hedgelog[i])
                if self.hedgelog.loc[i, 'Trade'].values[0] == 'Short':
                    self.hedgelog.loc[i, 'PNL'] = -1 * (self.hedgelog[i]['Exit Price'] - self.hedgelog[i]['Entry Price']) * self.hedgelog[i]['Quantity'] - charge
                    self.hedgelog.loc[i, 'PNL'] = self.hedgelog.loc[i, 'PNL'].astype(float).round(3)
                else:
                    self.hedgelog.loc[i, 'PNL'] = 1 * (self.hedgelog[i]['Exit Price'] - self.hedgelog[i]['Entry Price']) * self.hedgelog[i]['Quantity'] - charge
                    self.hedgelog.loc[i, 'PNL'] = self.hedgelog.loc[i, 'PNL'].astype(float).round(3)
                self.hedgelog.loc[i, '% PNL'] = self.hedgelog['PNL'] / self.hedgelog['Position Size'] * 100
                self.hedgelog.loc[:, '% PNL'] = self.hedgelog.loc[i, '% PNL'].astype(float).round(2)

        self.trading_records = pd.concat([self.trading_records, log], ignore_index=True)
        release = log['Position Size'].sum() + log['PNL'].sum()
        return release

    def check(self, row):
        # Return a boolean array of tradelog matching both the equity name and trade type
        i = self.load_rows(row)
        return self.model.risk_control.check(self.tradelog[i], row)

    def trigger(self, row):
        # Risk Control
        i = self.load_rows(row)
        sl = self.model.risk_control.trigger(self.tradelog[i], row)

        # find triggered tradelog
        self.tradelog[i] = sl
        sl = self.tradelog[self.tradelog['Exit Type'].notna()]
        self.tradelog = self.tradelog[self.tradelog['Exit Type'].isna()].copy()

        # Calculate PNL and % PNL
        sl['PNL'] = sl['PNL'] - self.model.charge_system.calculate_charge(sl)
        sl['PNL'] = sl['PNL'].astype(float).round(3)
        sl['% PNL'] = sl['PNL'] / sl['Position Size'] * 100
        sl['% PNL'] = sl['% PNL'].astype(float).round(2)

        # Hedging Mechanism
        if self.model.hedging_system != None:
            self.model.hedging_system.get_hedge_exit(sl, self.hedgelog)
            i = self.hedgelog['Order no'].map(lambda x: True if x in sl['Order no'].values else False)
            if i.shape[0] != 0:
                charge = self.model.charge_system.calculate_charge(self.hedgelog[i])
                if self.hedgelog.loc[i, 'Trade'].values[0] == 'Short':
                    self.hedgelog.loc[i, 'PNL'] = -1 * (self.hedgelog[i]['Exit Price'] - self.hedgelog[i]['Entry Price']) * self.hedgelog[i]['Quantity'] - charge
                    self.hedgelog.loc[i, 'PNL'] = self.hedgelog.loc[i, 'PNL'].astype(float).round(3)
                else:
                    self.hedgelog.loc[i, 'PNL'] = 1 * (self.hedgelog[i]['Exit Price'] - self.hedgelog[i]['Entry Price']) * self.hedgelog[i]['Quantity'] - charge
                    self.hedgelog.loc[i, 'PNL'] = self.hedgelog.loc[i, 'PNL'].astype(float).round(3)
                self.hedgelog.loc[i, '% PNL'] = self.hedgelog['PNL'] / self.hedgelog['Position Size'] * 100
                self.hedgelog.loc[i, '% PNL'] = self.hedgelog.loc[i, '% PNL'].astype(float).round(2)

        # Add triggered tradelog into trading_records
        self.trading_records = pd.concat([self.trading_records, sl], ignore_index=True)
        release = sl['Position Size'].sum() + sl['PNL'].sum()
        return release

    def prepare_portfolio_log(self, date):
        self.portfolio_log = {col: 0.0 for col in self.portfolio_columns}
        self.portfolio_log['Date'] = date
        multi = self.tradelog['Trade'].map(lambda x: -1 if x == 'Short' else 1)
        self.portfolio_log['Allocated PNL'] = round(((self.tradelog['Exit Price'] - self.tradelog['Entry Price']) * multi * self.tradelog['Quantity']).sum(), 3)
        self.portfolio_log['Allocated'] = round(self.tradelog['Position Size'].sum(), 3)
        self.portfolio_log['Allocated % PNL'] = round(self.portfolio_log['Allocated PNL'] / self.portfolio_log['Allocated'] * 100, 3) if self.portfolio_log['Allocated'] != 0.0 else 0.0
        self.portfolio_log['Cash'] = round(self.model.portfolio_management.free_capital, 3)
        self.portfolio_log['Total'] = round(self.portfolio_log['Cash'] + self.portfolio_log['Allocated'] + self.portfolio_log['Allocated PNL'], 3)
        self.portfolio_log['Total PNL'] = round(self.portfolio_log['Total'] - self.model.portfolio_management.starting_capital, 3)
        self.portfolio_log['Total % PNL'] = round(self.portfolio_log['Total PNL'] / self.model.portfolio_management.starting_capital * 100.0, 3)

        if self.model.hedging_system != None:
            opening_hedges = self.hedgelog['Exit Type'] == 0.0
            closed_hedges = self.hedgelog['Exit Type'] != 0.0
            remain_cash_for_hedges = self.model.portfolio_management.starting_capital - self.hedgelog[opening_hedges]['Position Size'].sum()
            self.portfolio_log['Cash'] = round(self.model.portfolio_management.free_capital + self.hedgelog[closed_hedges]['PNL'].sum() + remain_cash_for_hedges, 3)
            self.portfolio_log['Hedges'] = round(self.hedgelog[opening_hedges]['Position Size'].sum(), 3)
            close_price = self.model.hedging_system.get_hedges_data(date)['Close'].astype(float).values[0]
            mult = self.hedgelog[opening_hedges]['Trade'].map(lambda x: 1 if x == 'Long' else -1)
            self.portfolio_log['Hedges PNL'] = round(((close_price - self.hedgelog[opening_hedges]['Entry Price']) * self.hedgelog[opening_hedges]['Quantity'] * mult).sum(), 3)
            self.portfolio_log['Hedges % PNL'] = round(self.portfolio_log['Hedges PNL'] / self.portfolio_log['Hedges'] * 100, 2) if self.portfolio_log['Hedges'] != 0.0 else 0.0
            self.portfolio_log['Total'] = round(self.portfolio_log['Cash'] + self.portfolio_log['Allocated'] + self.portfolio_log['Allocated PNL'] + self.portfolio_log['Hedges'] + self.portfolio_log['Hedges PNL'], 3)
            self.portfolio_log['Total PNL'] = round(self.portfolio_log['Total'] - self.model.portfolio_management.starting_capital * 2, 3)
            self.portfolio_log['Total % PNL'] = round(self.portfolio_log['Total PNL'] / self.model.portfolio_management.starting_capital / 2 * 100.0, 3)

    def stats(self):
        df = self.trading_records
        total_trade_scripts = len(df['Equity Name'].unique())
        total_trade = len(df)
        pnl = round(df['PNL'].sum() / self.model.portfolio_management.starting_capital * 100, 2)
        winners = (df['PNL'] > 0).sum()
        losers = (df['PNL'] <= 0).sum()
        win_ratio = round(winners/total_trade * 100, 2) if total_trade else 0
        total_profit = round(df[df['PNL'] > 0]['PNL'].sum() / self.model.portfolio_management.starting_capital * 100, 2)
        total_loss = round(df[df['PNL'] <= 0]['PNL'].sum() / self.model.portfolio_management.starting_capital * 100, 2)
        avg_profit_per_trade = round(total_profit/winners, 2) if winners else 0
        avg_loss_per_trade = round(total_loss/losers, 2) if losers else 0
        avg_pnl_per_trade = round(pnl/total_trade, 2) if total_trade else 0
        risk_reward = f"1:{round(abs(avg_profit_per_trade/avg_loss_per_trade), 2)}" if avg_loss_per_trade else "N/A"

        data = [
            ('Total Trade Scripts', total_trade_scripts),
            ('Total Trade', total_trade),
            ('% PNL', pnl),
            ('Winners', winners),
            ('Losers', losers),
            ('% Win Ratio', win_ratio),
            ('% Total Profit', total_profit),
            ('% Total Loss', total_loss),
            ('% Average Profit per Trade', avg_profit_per_trade),
            ('% Average Loss per Trade', avg_loss_per_trade),
            ('% Average PNL per Trade', avg_pnl_per_trade),
            ('Risk Reward', risk_reward)
        ]

        if self.model.hedging_system != None:
            df_hedges = self.hedgelog
            hedges_pnl = round(df_hedges['PNL'].sum() / self.model.portfolio_management.starting_capital * 100, 2)
            hedges_winners = (df_hedges['PNL'] > 0).sum()
            hedges_losers = (df_hedges['PNL'] <= 0).sum()
            hedges_win_ratio = round(hedges_winners/total_trade * 100, 2) if total_trade else 0
            hedges_total_profit = round(df_hedges[df_hedges['PNL'] > 0]['PNL'].sum() / self.model.portfolio_management.starting_capital * 100, 2)
            hedges_total_loss = round(df_hedges[df_hedges['PNL'] <= 0]['PNL'].sum() / self.model.portfolio_management.starting_capital * 100, 2)
            avg_hedges_profit_per_trade = round(hedges_total_profit/hedges_winners, 2) if hedges_winners else 0
            avg_hedges_loss_per_trade = round(hedges_total_loss/hedges_losers, 2) if hedges_losers else 0
            avg_hedges_pnl_per_trade = round(hedges_pnl/total_trade, 2) if total_trade else 0
            hedges_risk_reward = f"1:{round(abs(avg_hedges_profit_per_trade/avg_hedges_loss_per_trade), 2)}" if avg_hedges_loss_per_trade else "N/A"

            data += [
                ('% Hedges PNL', hedges_pnl),
                ('Hedges Winners', hedges_winners),
                ('Hedges Losers', hedges_losers),
                ('% Hedges Win Ratio', hedges_win_ratio),
                ('% Hedges Total Profit', hedges_total_profit),
                ('% Hedges Total Loss', hedges_total_loss),
                ('% Average Hedges Profit per Trade', avg_hedges_profit_per_trade),
                ('% Average Hedges Loss per Trade', avg_hedges_loss_per_trade),
                ('% Average Hedges PNL per Trade', avg_hedges_pnl_per_trade),
                ('Hedges Risk Reward', hedges_risk_reward)
            ]

            df_combined = self.combined_records
            combined_pnl = round(df_combined['PNL'].sum() / self.model.portfolio_management.starting_capital / 2 * 100, 2)
            combined_winners = (df_combined['PNL'] > 0).sum()
            combined_losers = (df_combined['PNL'] <= 0).sum()
            combined_win_ratio = round(combined_winners/total_trade * 100, 2) if total_trade else 0
            combined_total_profit = round(df_combined[df_combined['PNL'] > 0]['PNL'].sum() / self.model.portfolio_management.starting_capital / 2 * 100, 2)
            combined_total_loss = round(df_combined[df_combined['PNL'] <= 0]['PNL'].sum() / self.model.portfolio_management.starting_capital / 2 * 100, 2)
            avg_combined_profit_per_trade = round(combined_total_profit/combined_winners, 2) if combined_winners else 0
            avg_combined_loss_per_trade = round(combined_total_loss/combined_losers, 2) if combined_losers else 0
            avg_combined_pnl_per_trade = round(combined_pnl/total_trade, 2) if total_trade else 0
            combined_risk_reward = f"1:{round(abs(avg_combined_profit_per_trade/avg_combined_loss_per_trade), 2)}" if avg_combined_loss_per_trade else "N/A"

            data += [
                ('% Combined PNL', combined_pnl),
                ('Combined Winners', combined_winners),
                ('Combined Losers', combined_losers),
                ('% Combined Win Ratio', combined_win_ratio),
                ('% Combined Total Profit', combined_total_profit),
                ('% Combined Total Loss', combined_total_loss),
                ('% Average Combined Profit per Trade', avg_combined_profit_per_trade),
                ('% Average Combined Loss per Trade', avg_combined_loss_per_trade),
                ('% Average Combined PNL per Trade', avg_combined_pnl_per_trade),
                ('Combined Risk Reward', combined_risk_reward)
            ]

        N = 255 # trading days in a year
        rf = 0.0253 # risk_free rate == 2.53 %
        stonk = self.portfolio_records['Total'].pct_change()
        mean = stonk.mean()
        sigma = stonk.std()
        downside_sigma = stonk[stonk <= 0].std()
        print(sigma)
        print(downside_sigma)
        max_draw_down = (self.portfolio_records['Total'].min() - self.portfolio_records['Total'].max()) / self.portfolio_records['Total'].max()

        data += [
            ("Starting Equity", self.portfolio_records['Total'].values[0]),
            ("Ending Equity", self.portfolio_records['Total'].values[-1]),
            ("% MaxDrawDown", round(max_draw_down * 100, 3)),
            ("Sharpe Ratio", round((mean * N - rf) / sigma / np.sqrt(N), 3)),
            ("Sortino Ratio", round((mean * N - rf) / downside_sigma / np.sqrt(N), 3))
        ]

        self.data = data
        pd.DataFrame(dict(self.data), index=[0]).to_csv(f"{self.model.model_base_path}/summary/table.csv")
        return tabulate(data, headers=['Parameters', 'Values'], tablefmt='psql')

    def give_analysis(self):
        # for interval in self.model.universe_management.intervals:
        #     for equity in self.model.equities:
        #         df = self.trading_records[self.trading_records['Equity Name'] == equity]
        #         if not df.empty:
        #             df = df.sort_values(by='Entry Time')
        #             path = os.path.join(self.model.model_base_path, f"analysis/{equity}-{interval}.csv")
        #             df.to_csv(path, index=None)

        self.trading_records.sort_values(by='Entry Time').to_csv(f"{self.model.model_base_path}/summary/trading-records.csv", index=None)
        self.portfolio_records.sort_values(by='Date', inplace=True)
        self.portfolio_records.to_csv(f"{self.model.model_base_path}/summary/portfolio.csv", index=None)

        if self.model.hedging_system != None:
            df_combined = self.trading_records.set_index('Order no')
            self.hedgelog.to_csv(f"{self.model.model_base_path}/summary/hedge-records.csv", index=None)
            combined_records = pd.DataFrame(columns=['Entry Time', 'Exit Time', 'Exit Type', 'Position Size', 'PNL', '% PNL', 'Holding Period'], index=self.trading_records['Order no'])
            combined_records['Exit Type'] = df_combined['Exit Type']
            combined_records['Entry Time'] = df_combined['Entry Time']
            combined_records['Exit Time'] = df_combined['Exit Time']
            combined_records['Holding Period'] = df_combined['Holding Period']
            combined_records['Position Size'] = df_combined['Position Size'] * 2
            combined_records['PNL'] = pd.concat([self.trading_records, self.hedgelog]).groupby('Order no')[['PNL']].sum()
            combined_records['% PNL'] = combined_records['PNL'] / combined_records['Position Size']
            self.combined_records = combined_records
            combined_records.to_csv(f"{self.model.model_base_path}/summary/combined-records.csv")

    def run(self):
        self.prepare_run()
        df = self.model.run()
        self.load_dates()

        if self.model.hedging_system != None:
            self.model.hedging_system.load_hedges_data()
            self.portfolio_columns = ['Date', 'Cash', 'Allocated PNL', 'Allocated % PNL', 'Allocated', 'Hedges PNL', 'Hedges % PNL', 'Hedges', 'Total PNL', 'Total % PNL', 'Total']
        else:
            self.portfolio_columns = ['Date', 'Cash', 'Allocated PNL', 'Allocated % PNL', 'Allocated', 'Total PNL', 'Total % PNL', 'Total']
        self.portfolio_records = pd.DataFrame(columns=self.portfolio_columns)

        for interval, dates in self.dates.items():
            for date in dates:
                df_in_date = df[df['Date'] == date]
                for _, row in df_in_date.iterrows():
                    if row['Position'] == 'Entry':
                        allocation = self.model.portfolio_management.allocate(self.tradelog)
                        self.enter_equity(row, allocation)

                    # Process Risk Management System
                    if self.check(row):
                        release = self.trigger(row)
                        self.model.portfolio_management.release(release)

                    if row['Position'] == 'Exit':
                        release = self.exit_equity(row)
                        self.model.portfolio_management.release(release)

                    i = self.load_rows(row)
                    self.tradelog.loc[i, 'Exit Price'] = row['Open']

                self.prepare_portfolio_log(date)
                self.portfolio_records = pd.concat([self.portfolio_records, pd.DataFrame([self.portfolio_log])], ignore_index=True)

        self.give_analysis()
        with open(f"{self.model.model_base_path}/summary/table.txt", 'w') as f:
            print(self.stats(), file=f)
