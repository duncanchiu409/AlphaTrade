from ..lib.riskManagement import BaseRiskManagement
import pandas as pd

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
		self.profit_percent = round(profit_percent / 100.0, 4)
		self.loss_percent = round(loss_percent / 100.0, 4)
		self.take_profit = {}
		self.stop_loss = {}

	def check(self, rows, data):
		for _, row in rows.iterrows():
			if self.take_profit.get(row['Order no']) == None:
				if row['Trade'] == 'Long':
					self.take_profit[row['Order no']] = round((1 + self.profit_percent) * row['Entry Price'], 2)
					self.stop_loss[row['Order no']] = round((1 - self.loss_percent) * row['Entry Price'], 2)
				elif row['Trade'] == 'Short':
					self.take_profit[row['Order no']] = round((1 - self.profit_percent) * row['Entry Price'], 2)
					self.stop_loss[row['Order no']] = round((1 + self.loss_percent) * row['Entry Price'], 2)

			if row['Trade'] == 'Long' and data['Low'] < self.stop_loss.get(row['Order no']):
				return True
			elif row['Trade'] == 'Short' and data['High'] > self.stop_loss.get(row['Order no']):
				return True
			elif row['Trade'] == 'Long' and data['High'] > self.take_profit.get(row['Order no']):
				return True
			elif row['Trade'] == 'Short' and data['Low'] < self.take_profit.get(row['Order no']):
				return True
		return False

	def trigger(self, rows, data):
		for i, row in rows.iterrows():
			if row['Trade'] == 'Long' and data['Low'] < self.stop_loss.get(row['Order no']):
				exit_type = 'Stop Loss'
				exit_price = self.stop_loss.get(row['Order no'])
			elif row['Trade'] == 'Short' and data['High'] > self.stop_loss.get(row['Order no']):
				exit_type = 'Stop Loss'
				exit_price = self.stop_loss.get(row['Order no'])
			elif row['Trade'] == 'Long' and data['High'] > self.take_profit.get(row['Order no']):
				exit_type = 'Take Profit'
				exit_price = self.take_profit.get(row['Order no'])
			elif row['Trade'] == 'Short' and data['Low'] < self.take_profit.get(row['Order no']):
				exit_type = 'Take Profit'
				exit_price = self.take_profit.get(row['Order no'])
			else:
				continue

			rows.loc[i, 'Exit Time'] = data['Date']
			rows.loc[i, 'Exit Price'] = exit_price
			rows.loc[i, 'Exit Type'] = exit_type
			multi = -1 if row['Trade'] == 'Short' else 1
			pnl = multi * (exit_price - row['Entry Price']) * row['Quantity']
			rows.loc[i, 'PNL'] = round(pnl, 3)
			rows.loc[i, '% PNL'] = round(pnl / row['Position Size'] * 100, 3)
			rows.loc[i, 'Holding Period'] = data['Date'] - row['Entry Time']
			self.take_profit.pop(row['Order no'])
			self.stop_loss.pop(row['Order no'])
		return rows

class TraillingStopLoss(BaseRiskManagement):
	def __init__(self, stop_loss_percent):
		self.stop_loss_percentage = round(stop_loss_percent / 100.0, 4)
		self.stop_loss = {}

	def check(self, rows, data):
		check = False
		for _, row in rows.iterrows():
			if self.stop_loss.get(row['Order no']) == None:
				if row['Trade'] == 'Long':
					self.stop_loss[row['Order no']] = round((1 - self.stop_loss_percentage) * row['Entry Price'], 2)
				else:
					self.stop_loss[row['Order no']] = round((1 + self.stop_loss_percentage) * row['Entry Price'], 2)

			change = True
			if row['Trade'] == 'Long' and data['Low'] < self.stop_loss.get(row['Order no']):
				check = True
				change = False
			elif row['Trade'] == 'Short' and data['High'] > self.stop_loss.get(row['Order no']):
				check = True
				change = False

			if change:
				if row['Trade'] == 'Long':
					self.stop_loss[row['Order no']] = max(self.stop_loss[row['Order no']], round((1 - self.stop_loss_percentage) * data['Close'], 2))
				elif row['Trade'] == 'Short':
					self.stop_loss[row['Order no']] = min(self.stop_loss[row['Order no']], round((1 + self.stop_loss_percentage) * data['Close'], 2))
		return check

	def trigger(self, rows, data):
		for i, row in rows.iterrows():
			if row['Trade'] == 'Long' and data['Low'] < self.stop_loss.get(row['Order no']):
				exit_type = 'Stop Loss'
				exit_price = self.stop_loss.get(row['Order no'])
			elif row['Trade'] == 'Short' and data['High'] > self.stop_loss.get(row['Order no']):
				exit_type = 'Stop Loss'
				exit_price = self.stop_loss.get(row['Order no'])
			else:
				continue

			rows.loc[i, 'Exit Time'] = data['Date']
			rows.loc[i, 'Exit Price'] = exit_price
			rows.loc[i, 'Exit Type'] = exit_type
			multi = -1 if row['Trade'] == 'Short' else 1
			pnl = multi * (exit_price - row['Entry Price']) * row['Quantity']
			rows.loc[i, 'PNL'] = round(pnl, 3)
			rows.loc[i, '% PNL'] = round(pnl / row['Position Size'] * 100, 3)
			rows.loc[i, 'Holding Period'] = data['Date'] - row['Entry Time']
			self.stop_loss.pop(row['Order no'])
		return rows