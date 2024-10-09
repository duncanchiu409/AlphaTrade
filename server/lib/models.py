import pandas as pd
import os
from .universe import BaseUniverseSetting
from .equitiesSelection import BaseEquitySelectionModel
from .equitiesFilters import BaseEquityFilter
from .APIs import BaseAPIModel
from .portfolioAllocations import BasePortfolioAllocation
from .strategies import BaseHold, BaseShort
from .riskManagement import BaseRiskManagement
from .chargeModel import BaseChargeModel

class BaseModel:
    def __init__(self):
        self.start_date = '2023-01-01'
        self.end_date = '2024-01-01'
        self.model_name = 'Basic Hold Model'
        self.universe_management = BaseUniverseSetting()
        self.equity_selection_management = BaseEquitySelectionModel()
        self.equity_filter = BaseEquityFilter()
        self.api_model_management = BaseAPIModel()
        self.portfolio_management = BasePortfolioAllocation(50000)
        self.hedging_system = None
        self.alpha_model = BaseHold()
        self.risk_control = BaseRiskManagement()
        self.charge_system = BaseChargeModel()

        # System
        self.signals_columns = ['Date', 'Equity Name', 'Open', 'High', 'Low', 'Close', 'Position', 'Trade']
        self.date_system = 'QQQ'

    def prepare_run(self):
        # Check Model Parameters
        pass

    def prepare_equities(self):
        if not hasattr(self, 'equities'):
            self.equities = self.equity_selection_management.prepare_equities()

    def filter_equities(self):
        self.filtered_equities = []
        after = self.equity_filter.filter_equities(self.equities)
        self.filtered_equities = [equity for equity in self.equities if equity not in after]
        self.equities = after

    def prepare_equities_data(self):
        equities = self.equities
        if self.hedging_system != None:
            equities = equities + self.hedging_system.get_hedge_names()
        if self.date_system not in equities:
            equities = equities + [self.date_system]

        self.api_model_management.set_model_data_path(self.model_base_path)
        self.failed_equities = self.api_model_management.get_equities_data(equities, self.universe_management.intervals, self.start_date, self.end_date)
        self.equities = [equity for equity in self.equities if equity not in self.failed_equities]

    def prepare_signals(self):
        data_path = self.api_model_management.get_model_data_path()
        if self.hedging_system != None:
            self.hedging_system.set_model_data_path(data_path)
        self.alpha_model.set_model_data_path(data_path)
        df = self.alpha_model.generate_signals(self.equities, self.universe_management.intervals)
        self.signals = df[self.signals_columns]
        self.signals = self.signals.sort_values(by='Date')

    def run(self):
        self.prepare_run()
        self.prepare_equities()
        self.filter_equities()
        self.prepare_equities_data()
        self.prepare_signals()
        return self.signals

class BaseHoldModel(BaseModel):
    def __init__(self):
        super().__init__()
        self.start_date = '2023-01-01'
        self.end_date = '2024-01-01'
        self.model_name = 'Base Hold Model'
        self.equities = ['COIN', 'NVDA']
        self.alpha_model = BaseShort()

class BaseShortModel(BaseModel):
    def __init__(self):
        super().__init__()
        self.start_date = '2023-01-01'
        self.end_date = '2024-01-01'
        self.model_name = 'Base Short Model'
        self.equities = ['COIN', 'NVDA']
        self.alpha_model = BaseShort()