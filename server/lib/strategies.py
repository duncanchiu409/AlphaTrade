import pandas as pd
import os

class BaseSignalGenerator:
    def set_model_data_path(self, model_data_path):
        self.model_data_path = model_data_path

    def generate_signals(self, equity_name, interval):
        path = f"{equity_name}-{interval}.csv"
        path = os.path.join(self.model_data_path, path)
        stock_data = pd.read_csv(path, parse_dates=['Date'])
        return stock_data

class BaseHold(BaseSignalGenerator):
    def generate_signals(self, equities, intervals):
        df = pd.DataFrame([])
        for equity_name in equities:
            stock_data = super().generate_signals(equity_name, '1d')
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
        for equity_name in equities:
            stock_data = super().generate_signals(equity_name, '1d')
            stock_data['Equity Name'] = equity_name
            stock_data['Position'] = 'Hold'
            stock_data.loc[0, 'Position'] = 'Entry'
            stock_data.loc[stock_data.shape[0]-1, 'Position'] = 'Exit'
            stock_data['Trade'] = 'Short'
            df = pd.concat([df, stock_data], ignore_index=True)
        return df