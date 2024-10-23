import pandas as pd
import numpy as np
from ..lib.strategies import BaseHold
from ..lib.strategies import BaseSignalGenerator

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

class Double7Signal(BaseSignalGenerator):
	def computeDouble7(self, df):
		df['Prev Close'] = df['Close'].shift(1)
		df['EMA 200'] = df['Prev Close'].ewm(span=200, adjust=False, min_periods=200).mean()
		for i in range(0,5):
			column = f'{i} Days Before'
			df[column] = df['Prev Close'].shift(i)
		df['Minimum'] = df.apply(lambda x: pd.Series(x[f"{i} Days Before"] for i in range(0,5)).min(), axis=1)
		df['Maximum'] = df.apply(lambda x: pd.Series(x[f"{i} Days Before"] for i in range(0,5)).max(), axis=1)
		df['Position'] = df.apply(lambda x: 'Entry' if x['Minimum'] == x['Prev Close'] and (x['EMA 200'] < x['Prev Close']) else 'Hold', axis=1)
		df['Position'] = df.apply(lambda x: 'Exit' if x['Maximum'] == x['Prev Close'] else x['Position'], axis=1)
		found_entry = False;
		for i, row in df.iterrows():
			if found_entry == False and row['Position'] == 'Entry' :
				found_entry = True
			elif found_entry == True and row['Position'] == 'Exit':
				df.loc[i, 'Position'] = 'Exit'
				found_entry = False
			else:
				df.loc[i, 'Position'] = 'Hold'

	def generate_signals(self, equities, intervals):
		# tickers = pd.read_csv("assets/tickers.csv", parse_dates=['FirstTrade', 'Compl. Date'], index_col='Ticker')
		df = pd.DataFrame([])
		for interval in intervals:
			for equity_name in equities:
				stock_data = super().generate_signals(equity_name, interval)
				self.computeDouble7(stock_data)
				# first_date = tickers.loc[equity_name, 'FirstTrade'].date()
				# stock_data = stock_data[(stock_data['Date'].dt.date >= first_date)]
				# if stock_data[stock_data['Position'] == 'Entry'].shape[0] != 0 and stock_data[stock_data['Position'] == 'Exit'].shape[0] != 0:
				# 	first_entry = stock_data[stock_data['Position'] == 'Entry']['Date'].iloc[0]
				# 	last_exit = stock_data[stock_data['Position'] == 'Exit']['Date'].iloc[-1]
				# 	stock_data = stock_data[(stock_data['Date'] >= first_entry) & (stock_data['Date'] <= last_exit)]
				stock_data['Equity Name'] = equity_name
				stock_data['Trade'] = 'Long'
				df = pd.concat([df, stock_data], ignore_index=True)
		return df