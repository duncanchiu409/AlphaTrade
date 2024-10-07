import numpy as np
import pandas as pd
import yfinance as yf
from yfinance import shared
import os
from tabulate import tabulate
import shortuuid

class BackTest:
    def __init__(self, model):
        self.model = model()
        self.portfolio_columns = ['Date', 'Cash', 'Allocated PNL', 'Allocated % PNL', 'Allocated', 'Total PNL', 'Total % PNL', 'Total']
        self.records_columns = ['Order no', 'Equity Name', 'Trade', 'Entry Time', 'Entry Price', 'Exit Time', 'Exit Price', 'Exit Type', 'Quantity', 'Position Size', 'PNL', '% PNL', 'Holding Period']
        self.trading_records = pd.DataFrame(columns=self.records_columns)
        self.portfolio_records = pd.DataFrame(columns=self.portfolio_columns)
        self.tradelog = pd.DataFrame(columns=self.records_columns)

    def load_dates(self):
        self.dates = {}
        for interval in self.model.universe_management.intervals:
            try:
                df = pd.read_csv('models/' + self.model.model_name + '/data/QQQ-' + interval + '.csv', parse_dates=['Date'])
                if 'QQQ' not in shared._ERRORS:
                    self.dates[interval] = df['Date']
                    pass
                else:
                    raise Exception('Error: loading dates')
            except Exception as e:
                print(f"Error loading dates for interval {interval}: {e}")

    def prepare_run(self):
        os.makedirs('models/', exist_ok=True)
        if os.path.exists(self.model.model_name):
            for folder in ['data', 'analysis', 'summary']:
                folder_path = f"models/{self.model.model_name}/{folder}"
                for file in os.listdir(folder_path):
                    os.remove(os.path.join(folder_path, file))
        else:
            for folder in ['data', 'analysis', 'summary']:
                os.makedirs(f"models/{self.model.model_name}/{folder}", exist_ok=True)

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
        self.tradelog = pd.concat([self.tradelog, pd.DataFrame([row])], ignore_index=True)

    def exit_equity(self, row):
        # Selling Mechanism
        i = self.load_rows(row)
        log = self.tradelog[i].head(1)

        self.tradelog = self.tradelog[self.tradelog.ne(log)]
        self.tradelog.dropna(subset=['Equity Name'], inplace=True)

        multi = -1 if row['Trade'] == 'Short' else 1
        log['Exit Time'] = row['Date']
        log['Exit Price'] = round(row['Close'], 2)
        log['Exit Type'] = 'Complete'
        log['Holding Period'] = row['Date'] - log['Entry Time']
        charge = self.model.charge_system.calculate_charge(log)
        log['PNL'] = round(multi * (log['Exit Price'] - log['Entry Price']) * log['Quantity'] - charge, 3)
        log['% PNL'] = round(log['PNL'] / log['Position Size'] * 100, 2)
        self.trading_records = pd.concat([self.trading_records, log], ignore_index=True)
        release = log['Position Size'].sum() + log['PNL'].sum()
        return release

    def check(self, row):
        i = self.load_rows(row)
        return self.model.risk_control.check(self.tradelog[i], row)

    def trigger(self, row):
        i = self.load_rows(row)
        sl = self.model.risk_control.trigger(self.tradelog[i], row)
        self.tradelog[i] = sl
        sl = self.tradelog[self.tradelog['Exit Type'].notna()]
        self.tradelog = self.tradelog[self.tradelog['Exit Type'].isna()].copy()
        sl['PNL'] = sl['PNL'] - self.model.charge_system.calculate_charge(sl)
        sl['PNL'] = sl['PNL'].astype(float).round(3)
        sl['% PNL'] = sl['PNL'] / sl['Position Size'] * 100
        sl['% PNL'] = sl['% PNL'].astype(float).round(2)
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
                    df.to_csv(f"models/{self.model.model_name}/analysis/{equity}-{interval}.csv", index=None)

        self.trading_records.sort_values(by='Entry Time').to_csv(f"models/{self.model.model_name}/summary/records.csv")

        self.portfolio_records.sort_values(by='Date', inplace=True)
        self.portfolio_records.to_csv(f"models/{self.model.model_name}/summary/portfolio.csv", index=None)

        with open(f"models/{self.model.model_name}/summary/table.txt", 'w') as f:
            f.write(self.stats())

    def run(self):
        self.prepare_run()
        df = self.model.run()
        df.to_csv(f"models/{self.model.model_name}/summary/execution.csv", index=None)
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