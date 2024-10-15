import pandas as pd

class BaseHedgeFeature:
	def __init__(self, equities):
		if equities == None:
			self.equity_names = []
		elif type(equities) is str:
			self.equity_names = [equities]
		else:
			self.equity_names = equities
		self.df = None

	def set_model_data_path(self, model_data_path):
		self.model_data_path = model_data_path

	def get_hedge_names(self):
		return self.equity_names

	def load_hedges_data(self):
		if self.df == None:
			self.df = pd.read_csv(f"{self.model_data_path}/{self.equity_names[0]}-1d.csv", parse_dates=['Date'])

	def get_hedges_data(self, date):
		return self.df[self.df['Date'] == date]

	def get_hedge_entry(self, tradelog):
		if len(self.equity_names) == 0:
			return pd.DataFrame([])

		hedges = []
		for _, log in tradelog.iterrows():
			row = {col: 0.0 for col in tradelog.columns}
			row['Order no'] = log['Order no']
			row['Equity Name'] = self.equity_names[0]
			row['Trade'] = 'Short' if log['Trade'] == 'Long' else 'Long'
			row['Entry Time'] = log['Entry Time']
			row['Entry Price'] = self.df[self.df['Date'] == log['Entry Time']]['Open'].values[0]
			row['Position Size'] = log['Position Size']
			row['Quantity'] = round(row['Position Size'] / row['Entry Price'], 3)
			hedges.append(row)

		return pd.DataFrame(hedges ,columns=tradelog.columns)

	def get_hedge_exit(self, tradelog, hedgelog):
		if len(self.equity_names) == 0:
			return hedgelog

		for _, log in tradelog.iterrows():
			hedgelog.loc[hedgelog['Order no'] == log['Order no'], 'Exit Time'] = log['Exit Time']
			hedgelog.loc[hedgelog['Order no'] == log['Order no'], 'Exit Price'] = self.df[self.df['Date'] == log['Exit Time']]['Open'].values[0]
			hedgelog.loc[hedgelog['Order no'] == log['Order no'], 'Exit Type'] = log['Exit Type']
			hedgelog.loc[hedgelog['Order no'] == log['Order no'], 'Holding Period'] = log['Exit Time'] - log['Entry Time']

		return hedgelog