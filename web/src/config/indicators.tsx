export interface TechnicalIndicator {
  name: string;
  description: string;
}

export const Indicators: Record<string, TechnicalIndicator> = {
  MA: { name: 'MA', description: 'Moving Average' },
  SMA: { name: 'SMA', description: 'Simple Moving Average' },
  EMA: { name: 'EMA', description: 'Exponential Moving Average' },
  BBI: { name: 'BBI', description: 'Bull and Bear Index' },
  VOL: { name: 'VOL', description: 'Volume' },
  MACD: { name: 'MACD', description: 'Moving Average Convergence Divergence' },
  BOLL: { name: 'BOLL', description: 'Bollinger Bands' },
  KDJ: { name: 'KDJ', description: 'KDJ Index' },
  RSI: { name: 'RSI', description: 'Relative Strength Index'},
  CCI: { name: 'CCI', description: 'I don\'t konw yet'},
  DMI: { name: 'DMI', description: 'I don\'t konw yet'},
  CR: { name: 'CR', description: 'I don\'t konw yet'},
  PSY: { name: 'PSY', description: 'I don\'t konw yet'},
  DMA: { name: 'DMA', description: 'I don\'t konw yet'},
  TRX: { name: 'TRX', description: 'I don\'t konw yet'},
  OBV: { name: 'OBV', description: 'On Balance Volume' },
  WR: { name: 'WR', description: 'I don\'t konw yet'},
  MTM: { name: 'MTM', description: 'I don\'t konw yet'},
  EMV: { name: 'EMV', description: 'I don\'t konw yet'},
  SAR: { name: 'SAR', description: 'Stop and Reverse' },
  AO: { name: 'AO', description: 'I don\'t konw yet'},
  ROC: { name: 'ROC', description: 'I don\'t konw yet'},
  PVT: { name: 'PVT', description: 'I don\'t konw yet'},
  AVP: { name: 'AVP', description: 'I don\'t konw yet'},
}

export const MainIndicators: TechnicalIndicator[] = [
  Indicators.MA,
  Indicators.EMA,
  Indicators.SMA,
  Indicators.BOLL,
  Indicators.SAR,
  Indicators.BBI,
]

export const SubIndicators: TechnicalIndicator[] = [

]