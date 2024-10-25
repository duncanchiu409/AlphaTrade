import pandas as pd
import os
from utils.dates import findDatetime

class BaseSignalGenerator:
    def set_model_data_path(self, model_data_path):
        self.model_data_path = model_data_path

    def generate_signals(self, equity_name, interval):
        path = f"{equity_name}-{interval}.csv"
        path = os.path.join(self.model_data_path, path)
        dateColumn = findDatetime(interval)
        stock_data = pd.read_csv(path, parse_dates=[dateColumn])
        stock_data['Date'] = stock_data[dateColumn]
        return stock_data

class BaseHold(BaseSignalGenerator):
    def generate_signals(self, equities, intervals):
        df = pd.DataFrame([])
        for interval in intervals:
            for equity_name in equities:
                stock_data = super().generate_signals(equity_name, interval)
                stock_data['Equity Name'] = equity_name
                stock_data['Position'] = 'Hold'
                stock_data.loc[0, 'Position'] = 'Entry'
                stock_data.loc[stock_data.shape[0]-1, 'Position'] = 'Exit'
                stock_data['Trade'] = 'Long'
                df = pd.concat([df, stock_data], ignore_index=True)
        return df

class BaseShort(BaseSignalGenerator):
    def generate_signals(self, equities, intervals):
        df = pd.DataFrame([])
        for interval in intervals:
            for equity_name in equities:
                stock_data = super().generate_signals(equity_name, interval)
                stock_data['Equity Name'] = equity_name
                stock_data['Position'] = 'Hold'
                stock_data.loc[0, 'Position'] = 'Entry'
                stock_data.loc[stock_data.shape[0]-1, 'Position'] = 'Exit'
                stock_data['Trade'] = 'Short'
                df = pd.concat([df, stock_data], ignore_index=True)
        return df