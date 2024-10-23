class BasePortfolioAllocation():
	def __init__(self, capital):
		self.starting_capital = capital
		self.free_capital = capital

	def allocate(self, portfolio):
		allocation = self.free_capital
		self.free_capital = 0.0
		return allocation

	def release(self, capital):
		self.free_capital += capital