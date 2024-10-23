class BaseRiskManagement():
	def __init__(self):
		pass

	def check(self, row, data):
		return False

	def trigger(self, row, data):
		return row