import tradingRecords from '../data/trading-records.json'

interface csvFormat {
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

export interface TradesFormat {
  key: string;
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

export function loadTradingRecords(): TradesFormat[] {
  const records = tradingRecords as csvFormat[]

  function days_between(date1: Date, date2: Date) {
    // The number of milliseconds in one day
    const ONE_DAY = 1000 * 60 * 60 * 24;
    // Calculate the difference in milliseconds
    const differenceMs: number = Math.abs(date1.getTime() - date2.getTime());
    // Convert back to days and return
    return Math.round(differenceMs / ONE_DAY);
  }

  const fakeData: TradesFormat[] = records.map((record: csvFormat) => {
    const holdingPeriod: number = days_between(new Date(record['Exit Time']), new Date(record['Entry Time']))

    return {
      key: record['Order no'],
      'Order no': record['Order no'],
      'Equity Name': record['Equity Name'],
      'Trade': record['Trade'],
      'Entry Time': record['Entry Time'],
      'Entry Price': record['Entry Price'],
      'Exit Time': record['Exit Time'],
      'Exit Price': record['Exit Price'],
      'Exit Type': record['Exit Type'],
      'Quantity': record['Quantity'],
      'Position Size': record['Position Size'],
      'PNL': record['PNL'],
      '% PNL': record['% PNL'],
      'Holding Period': holdingPeriod.toString() + ' Days'
    }
  })

  return fakeData
}