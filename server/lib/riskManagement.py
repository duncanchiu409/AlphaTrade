import pandas as pd

class BaseRiskManagement():
	def __init__(self):
		pass

	def check(self, row, data):
		return False

	def trigger(self, row, data):
		return row

class StopLoss(BaseRiskManagement):
	def __init__(self, loss_percent):
		self.loss_percent = round(float(loss_percent), 2) / 100.0
		self.stop_loss = {}

	def check(self, row, data):
		if self.stop_loss.get(row['Equity Name']) == None:
			if row['Trade'] == 'Long':
				self.stop_loss[row['Equity Name']] = round((1 - self.loss_percent) * row['Entry Price'], 2)
			elif row['Trade'] == 'Short':
				self.stop_loss[row['Equity Name']] = round((1 + self.loss_percent) * row['Entry Price'], 2)
			return False
		else:
			if row['Trade'] == 'Long' and data['Low'] < self.stop_loss.get(row['Equity Name']):
				return True
			elif row['Trade'] == 'Short' and data['Low'] > self.stop_loss.get(row['Equity Name']):
				return True
			else:
				return False

	def trigger(self, row, data):
		exit_price = self.stop_loss.get(row['Equity Name'])
		row.update({
				'Exit Time': data['Date'],
				'Exit Price': exit_price,
				'Exit Type': 'Stop Loss'
		})
		multi = -1 if row['Trade'] == 'Short' else 1
		pnl = multi * (exit_price - row['Entry Price']) * row['Quantity']
		row.update({
				'PNL': round(pnl, 3),
				'% PNL': round(pnl / row['Position Size'] * 100, 3),
				'Holding Period': data['Date'] - row['Entry Time']
		})
		return row

class TakeProfitStopLoss(BaseRiskManagement):
	def __init__(self, profit_percent, loss_percent):
		self.profit_percent = profit_percent
		self.loss_percent = loss_percent

	def check(self, row, data):
		if row['Trade'] == 'Long Open':
			self.stop_loss = round((1 - self.loss_percent) * row['Entry Price'], 2)
			self.take_profit = round((1 + self.profit_percent) * row['Entry Price'], 2)
		elif row['Trade'] == 'Short Open':
			self.stop_loss = round((1 - self.loss_percent) * row['Entry Price'], 2)
			self.take_profit = round((1 + self.profit_percent) * row['Entry Price'], 2)
		else:
			return row

		if (self.stop_loss >= row['Low'] and self.stop_loss <= row['High']):
			row['Exit Type'] = 'Stop Loss'
			row['Exit Price'] = self.stop_loss
			return row
		elif (self.take_profit >= row['Low'] and self.take_profit <= row['High']):
			row['Exit Type'] = 'Take Profit'
			row['Exit Price'] = self.stop_loss
			return row
		else:
			return row