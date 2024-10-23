GLOBAL_UNIVERSE_DICT = {
	'1m': 'Datetime',
  '2m': 'Datetime',
	'5m': 'Datetime',
	'15m': 'Datetime',
	'30m': 'Datetime',
	'60m': 'Datetime',
	'90m': 'Datetime',
	'1h': 'Datetime',
	'1d': 'Date',
	'5d': 'Date',
	'1wk': 'Date',
	'1mo': 'Date',
	'3mo': 'Date'
}

def findDatetime(interval):
  return GLOBAL_UNIVERSE_DICT[interval]