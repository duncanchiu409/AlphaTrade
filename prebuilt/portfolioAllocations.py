from ..lib.portfolioAllocations import BasePortfolioAllocation

class PercentagePortfolioAllocation(BasePortfolioAllocation):
	def __init__(self, capital, percent):
		super().__init__(capital)
		self.percent = round(float(percent) / 100.0, 4)

	def allocate(self, portfolio):
		allocation = round(self.free_capital * self.percent, 2)
		self.free_capital = round(self.free_capital - allocation, 2)
		return allocation