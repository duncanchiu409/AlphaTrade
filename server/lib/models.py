import pandas as pd
from .universe import BaseUniverseSetting
from .equitiesSelection import BaseEquitySelectionModel
from .equitiesFilters import BaseEquityFilter
from .APIs import BaseAPIModel
from .portfolioAllocations import BasePortfolioAllocation
from .strategies import BaseHold, BaseShort, EMAGoldenCrossSignal, EMAReverseGoldenCrossSignal
from .riskManagement import BaseRiskManagement, StopLoss

class BaseModel:
    def __init__(self):
        self.start_date = '2023-01-01'
        self.end_date = '2024-01-01'
        self.model_name = 'Basic Buy and Hold Model'
        self.universe_management = BaseUniverseSetting()
        self.equity_selection_management = BaseEquitySelectionModel()
        self.equity_filter = BaseEquityFilter()
        self.api_model_management = BaseAPIModel()
        self.portfolio_management = BasePortfolioAllocation(50000)
        self.alpha_model = BaseHold()
        self.risk_control = BaseRiskManagement()

    def prepare_equities(self):
        self.equities = self.equity_selection_management.prepare_equities()

    def filter_equities(self):
        self.filtered_equities = []
        after = self.equity_filter.filter_equities(self.equities)
        self.filtered_equities = [equity for equity in self.equities if equity not in after]

    def prepare_equities_data(self):
        self.failed_equities = []
        after = self.api_model_management.get_equities_data(self.model_name, self.equities, self.universe_management.intervals, self.start_date, self.end_date)
        self.failed_equities = [equity for equity in self.equities if equity not in after]

    def prepare_signals(self):
        self.signals_columns = ['Date', 'Equity Name', 'Open', 'High', 'Low', 'Close', 'Position', 'Trade']
        self.signals = pd.DataFrame(columns=self.signals_columns)
        for interval in self.universe_management.intervals:
            for equity in self.equities:
                df = self.alpha_model.generate_signals(self.model_name, equity, interval)
                self.signals = pd.concat([self.signals, df[self.signals_columns]], axis=0, ignore_index=True)
        self.signals = self.signals.sort_values(by='Date')

    def run(self):
        self.prepare_equities()
        self.filter_equities()
        self.prepare_equities_data()
        self.prepare_signals()
        return self.signals

class BaseShortModel(BaseModel):
    def __init__(self):
        super().__init__()
        self.model_name = 'Base Short Model'
        self.alpha_model = BaseShort()

class EMAGoldenCrossoverModel(BaseModel):
    def __init__(self):
        super().__init__()
        self.model_name = 'EMAs Golden Crossover Model'
        self.alpha_model = EMAGoldenCrossSignal(20, 50)

class EMAReverseGoldenCrossoverModel(BaseModel):
    def __init__(self):
        super().__init__()
        self.model_name = 'Reverse EMAs Golden Crossover Model'
        self.alpha_model = EMAReverseGoldenCrossSignal(20, 50)

class TestStopLossModel(BaseModel):
    def __init__(self):
        super().__init__()
        self.start_date = '2022-01-01'
        self.end_date = '2023-01-01'
        self.model_name = 'Test Stop Loss Model'
        self.risk_control = StopLoss(20)

class BenchMarkModel(BaseModel):
    def __init__(self):
        super().__init__()
        self.start_date = '2022-01-01'
        self.end_date = '2023-01-01'
        self.model_name = 'Bench Stop Loss Model'