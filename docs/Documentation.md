# 📖 Documentation

<p align="center">
<b>USE THIS SOFTWARE AT YOUR OWN RISK. THE AUTHOR ASSUMES NO LIABILITY FOR YOUR TRADING OUTCOMES.</b></p>

_It is important to note that this project is under active development and was developed as an experiment. Currently, only [yahooFinance API](https://pypi.org/project/yfinance/) is supported but contributions are welcome!_

## 📖 Contents

- [Prebuilt Tools](#tools)
  - [Universe Setting](#universe)
  - [Equity Selection](#equities)
  - [Filter](#filter)
  - [API Management](#API)
  - [Portfolio Optimisation](#portfolio)
  - [Alpha Model](#alpha)
- [Usage](#usage)
- [Examples](#examples)
  - [Double 7 Model](#Double7SignalModel)

## 📄 Prebuilt Tools <a id='tools' />

### 🌌 Universe Setting
On default, backtest run on a `1d` candles. The other possible intervals are limited to the data API you are using. Noted that, this Application on default runs on `yahoo finance`.

```python
in yfinance
'1m','2m','5m','15m','30m','60m','90m', '1h','1d','5d','1wk','1mo','3mo'
```

#### Example on Single Interval

```python
class ExampleModel(BaseModel):
    def __init__(self):
        super().__init__()
        # ...
        self.universe_management.setIntervals(['5m'])
        # ...
```

#### Example on Multiple Intervals

```python
class ExampleModel(BaseModel):
    def __init__(self):
        super().__init__()
        # ...
        self.universe_management.setIntervals(['5m', '1d'])
        # ...
```

### 💸 Equities Selection <a id='equities' />

#### Prompt List of Tickers
If you have already a list of equities you would be backtesting, you can simply put the list of Tickers inside the model as below.

```python
class ExampleModel(BaseModel):
  def __init__(self):
    super.__init__()
      # ...
      self.equities = ['NVDA', 'SPY', 'TSLA']
      # ...
```

#### Specific Condition for Selection
If your model select the tickers from requirements or from a other resources, you implement your custom equity selection model as below. I showed a model reading `csv` file in below.

```python
class ReadCSVEquitySelectionModel():
  def __init__(): # can used for pre-prompting info
    # ... do something

  def prepare_equities(self): # must be this method name
    df = pd.read_csv('xxx.csv')
    return df['Ticker']

class ExampleModel (BaseModel):
  def __init__(self):
    super.__init__()
      # ...
      self.equity_selection_management = ReadCSVEquitySelectionModel()
      # ...
```

### 🍠 Filter <a id='filter' />
What you can do, mostly you can it in Equity Selection Model.

### 🪬 API Management <a id='API' />
The software uses `yfinance` in default setting. If you want it to link to other services, you have to customise it. The API store the fetched data in csv format.

```python
# API Logic Implemenation (located in lib/APIs.py)
# Very ugly but don't judge :')
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
```

### 🔥 Portfolio Management <a id='portfolio' />
There are two pre-built portfolio managment in this system. The first one is a full allocation portfolio. The system would put 100% cash on the first equity allocation. The second is a percentage allocation portfolio. The system would put x% remaining cash on the next equity allocation.

```python
# 1. ./lib/portfolioAllocations/BasePortfolioAllocation
# 2. ./prebuilt/portfolioAllocations/PercentagePortfolioAllocation
```

You can customise your own Portfolio Model in such a way.

```python
class YourCustomPortfolioAllocation(BasePortfolioAllocation):
	def __init__(self, capital, percent):
		super().__init__(capital)
		self.percent = round(float(percent) / 100.0, 4)

	def allocate(self, portfolio):
		allocation = round(self.free_capital * self.percent, 2)
		self.free_capital = round(self.free_capital - allocation, 2)
		return allocation
```

### 🍎 Alpha Model <a id='alpha' />
The model includes several pre-built Alpha. I would implement more in the future.

```
# 1. BaseHold
# 2. BaseShort
# 3. EMAGoldenCrossSignal
```

## 🏕️ Examples <a id='examples' />

### 💸 Double 7 Model <a id='Double7SignalModel' />
Buy when candle is 7 days low and above SMA 200.
Sell when candle is at 7 days high.

```python
class Double7SignalModel(BaseModel):
    def __init__(self):
        super().__init__()
        self.start_date = "2024-09-21"
        self.end_date = "2024-10-21"
        self.universe_management.setIntervals(['5m'])
        self.model_name = 'ETH-USD Double 7 Signal Model'
        self.equities = ['ETH-USD']
        self.alpha_model = Double7Signal()

BackTest(Double7SignalModel).run()
```