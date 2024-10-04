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

        for interval in intervals:
            if len(equities) == 1:
                df = yf.download(equities[0], start=start_date, end=end_date, interval=interval)
                if equities[0] not in shared._ERRORS:
                    df.to_csv(f"{model_name}/data/{equities[0]}-{interval}.csv")
                    succeed_equities.add(equities[0])
                continue

            df = yf.download(" ".join(equities), start=start_date, end=end_date, interval=interval).swaplevel(0, 1, axis=1)
            for name in equities:
                if name not in shared._ERRORS:
                    df[name].to_csv(f"{model_name}/data/{name}-{interval}.csv")
                    succeed_equities.add(name)

        return list(succeed_equities)