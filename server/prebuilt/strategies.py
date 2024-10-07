import pandas as pd
import numpy as np
from ..lib.strategies import BaseHold

class EMAGoldenCrossSignal(BaseHold):
    def __init__(self, lower, upper):
        self.lower = lower
        self.upper = upper

    def generate_signals(self, model_name, equity_name, interval):
        path = f"{model_name}/data/{equity_name}-{interval}.csv"
        stock_data = pd.read_csv(path, parse_dates=['Date'])

        stock_data['Prev Close'] = stock_data['Close'].shift(1)
        stock_data['EMA 20'] = stock_data['Prev Close'].ewm(span=self.lower, adjust=False, min_periods=self.lower).mean()
        stock_data['EMA 50'] = stock_data['Prev Close'].ewm(span=self.upper, adjust=False, min_periods=self.upper).mean()
        stock_data['Signal'] = np.where(stock_data['EMA 20'] > stock_data['EMA 50'], 1, 0)
        stock_data['Position'] = stock_data['Signal'].diff()

        df_pos = stock_data[np.logical_or(stock_data['EMA 20'] > stock_data['EMA 50'],
                                          np.logical_or(stock_data['Position'] == 1,
                                                        stock_data['Position'] == -1))].copy()

        df_pos['Position'] = df_pos['Position'].map({1: 'Entry', -1: 'Exit', 0: 'Hold'})

        if df_pos.shape[0] <= 1:
            return pd.DataFrame([], columns=df_pos.columns)

        first_entry = df_pos[df_pos['Position'] == 'Entry']['Date'].iloc[0]
        last_exit = df_pos[df_pos['Position'] == 'Exit']['Date'].iloc[-1]
        df_pos = df_pos[(df_pos['Date'] >= first_entry) & (df_pos['Date'] <= last_exit)]
        df_pos['Equity Name'] = equity_name
        df_pos['Trade'] = 'Long'
        return df_pos

class EMAReverseGoldenCrossSignal(BaseHold):
    def __init__(self, lower, upper):
        self.lower = lower
        self.upper = upper

    def generate_signals(self, model_name, equity_name, interval):
        path = f"{model_name}/data/{equity_name}-{interval}.csv"
        stock_data = pd.read_csv(path, parse_dates=['Date'])

        stock_data['Prev Close'] = stock_data['Close'].shift(1)
        stock_data['EMA 20'] = stock_data['Prev Close'].ewm(span=self.lower, adjust=False, min_periods=self.lower).mean()
        stock_data['EMA 50'] = stock_data['Prev Close'].ewm(span=self.upper, adjust=False, min_periods=self.upper).mean()
        stock_data['Signal'] = np.where(stock_data['EMA 20'] < stock_data['EMA 50'], 1, 0)
        stock_data['Position'] = stock_data['Signal'].diff()

        df_pos = stock_data[np.logical_or(stock_data['EMA 20'] < stock_data['EMA 50'],
                                          np.logical_or(stock_data['Position'] == 1,
                                                        stock_data['Position'] == -1))].copy()

        df_pos['Position'] = df_pos['Position'].map({1: 'Entry', -1: 'Exit', 0: 'Hold'})

        if df_pos.shape[0] <= 1:
            return pd.DataFrame([], columns=df_pos.columns)

        first_entry = df_pos[df_pos['Position'] == 'Entry']['Date'].iloc[0]
        last_exit = df_pos[df_pos['Position'] == 'Exit']['Date'].iloc[-1]
        df_pos = df_pos[(df_pos['Date'] >= first_entry) & (df_pos['Date'] <= last_exit)]
        df_pos['Equity Name'] = equity_name
        df_pos['Trade'] = 'Short'
        return df_pos