import numpy as np
import pandas as pd
import yfinance as yf
from yfinance import shared
import os
from tabulate import tabulate

class BackTest:
    def __init__(self, model):
        self.model = model()
        self.portfolio_columns = ['Date', 'Cash', 'Allocated PNL', 'Allocated % PNL', 'Allocated', 'Total PNL', 'Total % PNL', 'Total']
        self.records_columns = ['Equity Name', 'Trade', 'Entry Time', 'Entry Price', 'Exit Time', 'Exit Price', 'Exit Type', 'Quantity', 'Position Size', 'PNL', '% PNL', 'Holding Period']
        self.trading_records = pd.DataFrame(columns=self.records_columns)
        self.portfolio_records = pd.DataFrame(columns=self.portfolio_columns)
        self.tradelog = {col: None for col in self.records_columns}

    def load_dates(self):
        self.dates = {}
        for interval in self.model.universe_management.intervals:
            try:
                df = yf.download('QQQ', start=self.model.start_date, end=self.model.end_date, interval=interval)
                if 'QQQ' not in shared._ERRORS:
                    self.dates[interval] = df.index
                else:
                    raise Exception('Error: loading dates')
            except Exception as e:
                print(f"Error loading dates for interval {interval}: {e}")

    def prepare_run(self):
        if os.path.exists(self.model.model_name):
            for folder in ['data', 'analysis', 'summary']:
                folder_path = f"{self.model.model_name}/{folder}"
                for file in os.listdir(folder_path):
                    os.remove(os.path.join(folder_path, file))
        else:
            for folder in ['data', 'analysis', 'summary']:
                os.makedirs(f"{self.model.model_name}/{folder}", exist_ok=True)

    def enter_equity(self, equity_name, trade, entry_time, entry_price, position):
        self.tradelog = {col: None for col in self.records_columns}
        self.tradelog.update({
            'Equity Name': equity_name,
            'Trade': trade,
            'Entry Time': entry_time,
            'Entry Price': round(entry_price, 2),
            'Quantity': round(position / entry_price, 3),
            'Position Size': position
        })

    def exit_equity(self, exit_time, exit_price, exit_type):
        self.tradelog.update({
            'Exit Time': exit_time,
            'Exit Price': round(exit_price, 2),
            'Exit Type': exit_type,
            'Holding Period': exit_time - self.tradelog['Entry Time']
        })
        multi = -1 if self.tradelog['Trade'] == 'Short' else 1
        charge = self.model.charge_system.calculate_charge(self.tradelog)
        pnl = multi * (exit_price - self.tradelog['Entry Price']) * self.tradelog['Quantity'] - charge
        self.tradelog.update({
            'PNL': round(pnl, 3),
            '% PNL': round(pnl / self.tradelog['Position Size'] * 100, 3),
        })
        self.trading_records = pd.concat([self.trading_records, pd.DataFrame([self.tradelog])], ignore_index=True)
        release = round(self.tradelog['Position Size'] + pnl, 3)
        self.tradelog = {col: None for col in self.records_columns}
        return release

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
                    df.to_csv(f"{self.model.model_name}/analysis/{equity}-{interval}.csv", index=None)

        self.portfolio_records.sort_values(by='Date', inplace=True)
        self.portfolio_records.to_csv(f"{self.model.model_name}/summary/portfolio.csv", index=None)

        with open(f"{self.model.model_name}/summary/table.txt", 'w') as f:
            f.write(self.stats())

    def run(self):
        self.prepare_run()
        df = self.model.run()
        self.load_dates()
        for interval, dates in self.dates.items():
            for date in dates:
                self.portfolio_log = {col: 0.0 for col in self.portfolio_columns}
                self.portfolio_log['Date'] = date

                df_in_date = df[df['Date'] == date]
                for _, row in df_in_date.iterrows():
                    if row['Position'] == 'Entry':
                        allocation = self.model.portfolio_management.allocate()
                        self.enter_equity(row['Equity Name'], row['Trade'], date, row['Open'], allocation)

                    # Process Risk Management System
                    if self.model.risk_control.check(self.tradelog, row):
                        sl = self.model.risk_control.trigger(self.tradelog, row)
                        sl['PNL'] = round(sl['PNL'] - self.model.charge_system.calculate_charge(row), 3)
                        sl['% PNl'] = round(sl['PNL'] / sl['Position Size'] * 100, 3)
                        self.tradelog.update(sl)
                        self.trading_records = pd.concat([self.trading_records, pd.DataFrame([self.tradelog])], ignore_index=True)
                        release = round(self.tradelog['Position Size'] + self.tradelog['PNL'], 3)
                        self.tradelog = {col: None for col in self.records_columns}
                        self.model.portfolio_management.release(release)

                    if row['Position'] == 'Exit' and self.tradelog['Equity Name'] is not None:
                        release = self.exit_equity(date, row['Open'], 'Complete')
                        self.model.portfolio_management.release(release)

                    multi = -1 if row['Trade'] == 'Short' else 1
                    self.portfolio_log['Allocated PNL'] += 0.0 if self.tradelog['Entry Price'] == None else round(multi * (row['Close'] - self.tradelog['Entry Price']) * self.tradelog['Quantity'], 3)

                self.portfolio_log['Cash'] = self.model.portfolio_management.free_capital
                self.portfolio_log['Allocated'] = self.tradelog['Position Size'] if self.tradelog.get('Position Size') != None else 0.0
                self.portfolio_log['Allocated % PNL'] = round(self.portfolio_log['Allocated PNL'] / self.portfolio_log['Allocated'] * 100, 3) if self.portfolio_log['Allocated'] != 0.0 else 0.0
                self.portfolio_log['Total'] = round(self.portfolio_log['Cash'] + self.portfolio_log['Allocated'] + self.portfolio_log['Allocated PNL'], 3)
                self.portfolio_log['Total PNL'] = round(self.portfolio_log['Total'] - self.model.portfolio_management.starting_capital, 3)
                self.portfolio_log['Total % PNL'] = round(self.portfolio_log['Total PNL'] / self.model.portfolio_management.starting_capital, 3)

                self.portfolio_records = pd.concat([self.portfolio_records, pd.DataFrame([self.portfolio_log])], ignore_index=True)
                df = df[df['Date'] > date]

        self.give_analysis()