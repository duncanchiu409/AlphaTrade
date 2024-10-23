import yfinance as yf
import os
from yfinance import shared

class BaseAPIModel:
    def __init__(self):
        self.data_columns = ['Date', 'Adj Close', 'Close', 'High', 'Low', 'Open', 'Volume']

    def set_model_data_path(self, model_path):
        self.model_data_path = os.path.join(model_path, "data")

    def get_model_data_path(self):
        return self.model_data_path

    def set_data_columns(self, columns):
        self.data_columns = columns

    def get_data_columns(self):
        return self.data_columns

    def get_equities_data(self, equities, intervals, start_date, end_date):
        if len(equities) == 0:
            return []
        failed_equities = set()
        for interval in intervals:
            df = yf.download(" ".join(equities), start=start_date, end=end_date, interval=interval).swaplevel(0, 1, axis=1)
            for name in equities:
                if name in shared._ERRORS:
                    failed_equities.add(name)
                else:
                    path = os.path.join(self.model_data_path, f"{name}-{interval}.csv")
                    df[name].to_csv(path)
        return list(failed_equities)