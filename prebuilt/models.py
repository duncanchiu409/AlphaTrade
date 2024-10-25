from lib.portfolioAllocations import PercentagePortfolioAllocation
from lib.strategies import EMAGoldenCrossSignal, EMAReverseGoldenCrossSignal
from lib.riskManagement import StopLoss, TakeProfitStopLoss
from chargeModel import SimpleChargeModel
from lib.strategies import BaseModel

class EMAGoldenCrossModel(BaseModel):
    def __init__(self):
        super().__init__()
        self.model_name = 'EMAs Golden Crossover Model'
        self.alpha_model = EMAGoldenCrossSignal(20, 50)

class EMAReverseGoldenCrossModel(BaseModel):
    def __init__(self):
        super().__init__()
        self.model_name = 'Reverse EMAs Golden Crossover Model'
        self.alpha_model = EMAReverseGoldenCrossSignal(20, 50)

class TestStopLossModel(BaseModel):
    def __init__(self):
        super().__init__()
        self.start_date = '2022-01-01'
        self.end_date = '2023-01-01'
        self.equities = ['COIN']
        self.model_name = 'Test Charge Model'
        self.charge_system = StopLoss(20)

class TestChargeModel(BaseModel):
    def __init__(self):
        super().__init__()
        self.start_date = '2022-01-01'
        self.end_date = '2023-01-01'
        self.equities = ['COIN']
        self.model_name = 'Test Charge Model'
        self.charge_system = SimpleChargeModel(20)

class BenchmarkModel(BaseModel):
    def __init__(self):
        super().__init__()
        self.start_date = '2022-01-01'
        self.end_date = '2023-01-01'
        self.equities = ['COIN']
        self.model_name = 'Benchmark Charge Model'

class TestMultipleEquitiesModel(BaseModel):
    def __init__(self):
        super().__init__()
        self.equities = ['NVDA', 'COIN', 'PLTR']
        self.model_name = 'Mulitple Equities Model'
        self.portfolio_management = PercentagePortfolioAllocation(50000, 50)
        self.risk_control = TakeProfitStopLoss(0.3, 0.2)