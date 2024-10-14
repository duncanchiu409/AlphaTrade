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
  CCI: { name: 'CCI', description: 'Commodity Channel Index'},
  DMI: { name: 'DMI', description: 'Directional Movement Index'},
  CR: { name: 'CR', description: 'I don\'t konw yet'},
  PSY: { name: 'PSY', description: 'Psychological Line'},
  DMA: { name: 'DMA', description: 'Displaced Movement Average'},
  TRX: { name: 'TRX', description: 'I don\'t konw yet'},
  OBV: { name: 'OBV', description: 'On Balance Volume' },
  WR: { name: 'WR', description: 'I don\'t konw yet'},
  MTM: { name: 'MTM', description: 'I don\'t konw yet'},
  EMV: { name: 'EMV', description: 'Ease of Movement'},
  SAR: { name: 'SAR', description: 'Stop and Reverse' },
  AO: { name: 'AO', description: 'Awesome Oscillator'},
  ROC: { name: 'ROC', description: 'I don\'t konw yet'},
  PVT: { name: 'PVT', description: 'I don\'t konw yet'},
  AVP: { name: 'AVP', description: 'I don\'t konw yet'},
  EES: { name: 'EES', description: 'Enter and Exit Signal'},
}

export const MainIndicators: TechnicalIndicator[] = [
  Indicators.MA,
  Indicators.EMA,
  Indicators.SMA,
  Indicators.BOLL,
  Indicators.SAR,
  Indicators.BBI,
  Indicators.DMA,
  Indicators.EES
]

export const SubIndicators: TechnicalIndicator[] = [
  Indicators.VOL,
  Indicators.MACD,
  Indicators.KDJ,
  Indicators.RSI,
  Indicators.CCI,
  Indicators.DMI,
  Indicators.PSY,
  // Indicators.OBV,
  // Indicators.EMV,
  // Indicators.AO
]