import pandas as pd
from ..lib.strategies import BaseSignalGenerator

class SpacSignals(BaseSignalGenerator):
	def generate_signals(self, equities, intervals):
		tickers = pd.read_csv("assets/tickers.csv", parse_dates=['FirstTrade', 'Compl. Date'], index_col='Ticker')
		df = pd.DataFrame([])
		for equity_name in equities:
			stock_data = super().generate_signals(equity_name, '1d')
			first_date = tickers.loc[equity_name, 'FirstTrade'].date()
			stock_data = stock_data[(stock_data['Date'].dt.date >= first_date)]
			stock_data.reset_index(drop=True, inplace=True)
			stock_data['Equity Name'] = equity_name
			stock_data['Position'] = 'Hold'
			stock_data.loc[0, 'Position'] = 'Entry'
			stock_data.loc[stock_data.shape[0]-1, 'Position'] = 'Exit'
			stock_data['Trade'] = 'Short'
			df = pd.concat([df, stock_data], ignore_index=True)
		return df