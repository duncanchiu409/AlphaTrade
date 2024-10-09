import numpy as np
import pandas as pd
import yfinance as yf
from yfinance import shared
import os
from tabulate import tabulate
import shortuuid

class BackTest:
    def __init__(self, model, location='models'):
        self.model = model()
        self.location = location
        self.model.model_base_path = os.path.join(location, self.model.model_name)
        self.portfolio_columns = ['Date', 'Cash', 'Allocated PNL', 'Allocated % PNL', 'Allocated', 'Total PNL', 'Total % PNL', 'Total']
        self.records_columns = ['Order no', 'Equity Name', 'Trade', 'Entry Time', 'Entry Price', 'Exit Time', 'Exit Price', 'Exit Type', 'Quantity', 'Position Size', 'PNL', '% PNL', 'Holding Period']
        self.trading_records = pd.DataFrame(columns=self.records_columns)
        self.portfolio_records = pd.DataFrame(columns=self.portfolio_columns)
        self.tradelog = pd.DataFrame(columns=self.records_columns)
        self.hedgelog = pd.DataFrame(columns=self.records_columns)

    def prepare_run(self):
        os.makedirs(f'{self.location}/', exist_ok=True)
        if os.path.exists(self.model.model_base_path):
            for folder in ['data', 'analysis', 'summary']:
                folder_path = os.path.join(self.model.model_base_path, folder)
                for file in os.listdir(folder_path):
                    os.remove(os.path.join(folder_path, file))
        else:
            for folder in ['data', 'analysis', 'summary']:
                folder_path = os.path.join(self.model.model_base_path, folder)
                os.makedirs(folder_path, exist_ok=True)

    def load_dates(self):
        self.dates = {}
        for interval in self.model.universe_management.intervals:
            try:
                df = pd.read_csv(f"{self.model.api_model_management.get_model_data_path()}/{self.model.date_system}-{interval}.csv", parse_dates=['Date'])
                if self.model.date_system not in shared._ERRORS:
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
                self.hedgelog.loc[:, '% PNL'] = self.hedgelog.loc[i, '% PNL'].astype(float).round(2)

        # Add triggered tradelog into trading_records
        self.trading_records = pd.concat([self.trading_records, sl], ignore_index=True)
        release = sl['Position Size'].sum() + sl['PNL'].sum()
        return release

    def prepare_portfolio_log(self, date):
        self.portfolio_log = {col: 0.0 for col in self.portfolio_columns}
        self.portfolio_log['Date'] = date
        multi = self.tradelog['Trade'].map(lambda x: -1 if x == 'Short' else 1)
        self.portfolio_log['Allocated PNL'] = round(((self.tradelog['Exit Price'] - self.tradelog['Entry Price']) * multi * self.tradelog['Quantity']).sum(), 3)
        self.portfolio_log['Cash'] = round(self.model.portfolio_management.free_capital, 3)
        self.portfolio_log['Allocated'] = round(self.tradelog['Position Size'].sum(), 3)
        self.portfolio_log['Allocated % PNL'] = round(self.portfolio_log['Allocated PNL'] / self.portfolio_log['Allocated'] * 100, 3) if self.portfolio_log['Allocated'] != 0.0 else 0.0
        self.portfolio_log['Total'] = round(self.portfolio_log['Cash'] + self.portfolio_log['Allocated'] + self.portfolio_log['Allocated PNL'], 3)
        self.portfolio_log['Total PNL'] = round(self.portfolio_log['Total'] - self.model.portfolio_management.starting_capital, 3)
        self.portfolio_log['Total % PNL'] = round(self.portfolio_log['Total PNL'] / self.model.portfolio_management.starting_capital * 100.0, 3)

    def stats(self):
        df = self.trading_records
        total_trade_scripts = len(df['Equity Name'].unique())
        total_trade = len(df)
        pnl = round(df['PNL'].sum(), 2)
        winners = (df['PNL'] > 0).sum()
        losers = (df['PNL'] <= 0).sum()
        win_ratio = round(winners/total_trade * 100, 2) if total_trade else 0
        total_profit = round(df[df['PNL'] > 0]['PNL'].sum(), 2)
        total_loss = round(df[df['PNL'] <= 0]['PNL'].sum(), 2)
        avg_profit_per_trade = round(total_profit/winners, 2) if winners else 0
        avg_loss_per_trade = round(total_loss/losers, 2) if losers else 0
        avg_pnl_per_trade = round(pnl/total_trade, 2) if total_trade else 0
        risk_reward = f"1:{round(abs(avg_profit_per_trade/avg_loss_per_trade), 2)}" if avg_loss_per_trade else "N/A"

        data = [
            ('Total Trade Scripts', total_trade_scripts),
            ('Total Trade', total_trade),
            ('PNL', pnl),
            ('Winners', winners),
            ('Losers', losers),
            ('% Win Ratio', win_ratio),
            ('Total Profit', total_profit),
            ('Total Loss', total_loss),
            ('Average Profit per Trade', avg_profit_per_trade),
            ('Average Loss per Trade', avg_loss_per_trade),
            ('Average PNL per Trade', avg_pnl_per_trade),
            ('Risk Reward', risk_reward)
        ]
        return tabulate(data, headers=['Parameters', 'Values'], tablefmt='psql')

    def give_analysis(self):
        for interval in self.model.universe_management.intervals:
            for equity in self.model.equities:
                df = self.trading_records[self.trading_records['Equity Name'] == equity]
                if not df.empty:
                    df = df.sort_values(by='Entry Time')
                    path = os.path.join(self.model.model_base_path, f"analysis/{equity}-{interval}.csv")
                    df.to_csv(path, index=None)

        self.trading_records.sort_values(by='Entry Time').to_csv(f"{self.model.model_base_path}/summary/trading-records.csv")

        self.portfolio_records.sort_values(by='Date', inplace=True)
        self.portfolio_records.to_csv(f"{self.model.model_base_path}/summary/portfolio.csv", index=None)

        self.hedgelog.to_csv(f"{self.model.model_base_path}/summary/hedge-records.csv", index=None)

        with open(f"{self.model.model_base_path}/summary/table.txt", 'w') as f:
            f.write(self.stats())

    def run(self):
        self.prepare_run()
        df = self.model.run()
        df.to_csv(f"{self.model.model_base_path}/summary/execution.csv", index=None)

        self.load_dates()
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