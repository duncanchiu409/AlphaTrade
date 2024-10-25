import tradingRecords from '../data/trading-records.json'

export interface jsonTradingRecordsFormat {
  key: string;
  value: {
    name: string;
    value: TradesFormat[];
  }[]
}

export interface TradesFormat {
  'Order no': string;
  'Equity Name': string;
  'Trade': 'Long' | 'Short';
  'Entry Time': string;
  'Entry Price': number;
  'Exit Time': string;
  'Exit Price': number;
  'Exit Type': 'Take Profit' | 'Stop Loss' | 'Complete';
  'Quantity': number;
  'Position Size': number;
  'PNL': number;
  '% PNL': number;
  'Holding Period': string;
}

export function loadTradingRecords(): jsonTradingRecordsFormat {
  const recordsJSON = tradingRecords as jsonTradingRecordsFormat
  return recordsJSON
}