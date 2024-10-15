import pandas as pd
from ..lib.equitiesSelection import BaseEquitySelectionModel

class SpacsSelectionModel(BaseEquitySelectionModel):
	def __init__(self, flip_threshold_upper, flip_threshold_lower, direction, start_date, end_date):
		self.flip_threshold_upper = flip_threshold_upper
		self.flip_threshold_lower = flip_threshold_lower
		self.direction = direction
		self.start = start_date
		self.end = end_date

	def prepare_equities(self):
		tickers = pd.read_csv("assets/tickers.csv")
		flips = pd.read_csv("assets/flips.csv")

		## Filter out by Flip Gap:
		flips['Abs %Diff'] = abs(flips['%Diff'])
		flip_gap = flips[['Ticker','Abs %Diff']]
		flip_gap_criteria = (self.flip_threshold_lower <= flip_gap['Abs %Diff']) & (flip_gap['Abs %Diff'] <= self.flip_threshold_upper)
		tickers = tickers[flip_gap_criteria]

		## Filter by Direction
		if self.direction != None:
			tickers = tickers[tickers['Prediction'] == self.direction]
			tickers = tickers[tickers.apply(lambda x: x['Ticker'] in flips['Ticker'].values, axis=1)]

		## Filter by Backtest Dates
		tickers = tickers[(tickers['FirstTrade'] >= self.start) & (tickers['FirstTrade'] <= self.end)]
		return tickers['Ticker'].to_list()