import yfinance as yf
from yfinance import shared

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

class BaseAPIModel:
    def get_equities_data(self, model_name, equities, intervals, start_date, end_date):
        succeed_equities = set()

        if not equities:
            return []
        else:
            equities.append('QQQ')

        for interval in intervals:
            df = yf.download(" ".join(equities), start=start_date, end=end_date, interval=interval).swaplevel(0, 1, axis=1)
            for name in equities:
                if name not in shared._ERRORS:
                    df[name].to_csv(f"models/{model_name}/data/{name}-{interval}.csv")
                    succeed_equities.add(name)
        succeed_equities.remove('QQQ')
        succeed_equities = list(succeed_equities)
        return list(succeed_equities)