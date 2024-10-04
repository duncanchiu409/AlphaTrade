class BasePortfolioAllocation():
	def __init__(self, capital):
		self.starting_capital = capital
		self.free_capital = capital

	def allocate(self):
		allocation = self.free_capital
		self.free_capital = 0.0
		return allocation

	def release(self, capital):
		self.free_capital += capital

class TwentyPercentPortfolioAllocation(BasePortfolioAllocation):
	def __init__(self, capital):
		super().__init__(capital)

	def allocate(self):
		allocation = round(self.free_capital * 0.2, 2)
		self.free_capital = round(self.free_capital - allocation, 2)
		return allocation