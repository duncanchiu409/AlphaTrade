import numpy as np
import pandas as pd

class BaseSignalGenerator:
    def generate_signals(self, model_name, equity_name, interval):
        path = f"models/{model_name}/data/{equity_name}-{interval}.csv"
        stock_data = pd.read_csv(path, parse_dates=['Date'])
        return stock_data

class BaseHold(BaseSignalGenerator):
    def generate_signals(self, model_name, equities, intervals):
        df = pd.DataFrame([])
        for equity_name in equities:
            stock_data = super().generate_signals(model_name, equity_name, '1d')
            stock_data['Equity Name'] = equity_name
            stock_data['Position'] = 'Hold'
            stock_data.loc[0, 'Position'] = 'Entry'
            stock_data.loc[stock_data.shape[0]-1, 'Position'] = 'Exit'
            stock_data['Trade'] = 'Long'
            df = pd.concat([df, stock_data], ignore_index=True)
        return df

class BaseShort(BaseSignalGenerator):
    def generate_signals(self, model_name, equities, intervals):
        df = pd.DataFrame([])
        for equity_name in equities:
            stock_data = super().generate_signals(model_name, equity_name, '1d')
            stock_data['Equity Name'] = equity_name
            stock_data['Position'] = 'Hold'
            stock_data.loc[0, 'Position'] = 'Entry'
            stock_data.loc[stock_data.shape[0]-1, 'Position'] = 'Exit'
            stock_data['Trade'] = 'Short'
            df = pd.concat([df, stock_data], ignore_index=True)
        return df