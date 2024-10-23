GLOBAL_UNIVERSE_INTERVALS = [
	'1m','2m','5m','15m','30m','60m','90m',
	'1h','1d','5d','1wk','1mo','3mo'
]

class BaseUniverseSetting():
	def __init__(self):
		self.intervals = ['1d']

	def setIntervals(self, intervals):
		self.intervals = intervals