import { useState } from 'react'
import { loadTradingRecords, TradesFormat, jsonTradingRecordsFormat } from '../api/getFakeTradingRecords'
import { days_between } from '../utils/dates'

export interface TradesInterface {
  key: string;
  'Order no': string;
  'Equity Name': string;
  'Trade': 'Long' | 'Short';
  'Entry Time': number;
  'Entry Price': number;
  'Exit Time': number;
  'Exit Price': number;
  'Exit Type': 'Take Profit' | 'Stop Loss' | 'Complete';
  'Quantity': number;
  'Position Size': number;
  'PNL': number;
  '% PNL': number;
  'Holding Period': string;
}

interface TradeRecordsStore {
  trades: Map<string, TradesInterface[]>;
  loading: boolean;
  resetTradeRecords: () => void;
  getTradeRecords: (name: string) => TradesInterface[]
}

export function useTradeRecordsStore(): TradeRecordsStore {
  const [loading, setLoading] = useState<boolean>(true)
  const [trades, setTrades] = useState<Map<string, TradesInterface[]>>(new Map<string, TradesInterface[]>())

  function resetTradeRecords() {
    setLoading(true)
    const dataJSON = loadTradingRecords()
    var trades = new Map<string, TradesInterface[]>()

    dataJSON.value.map(val => {
      const logs = val.value.map(record => {
        const timestamp1 = new Date(record['Entry Time']).getTime()
        const timestamp2 = new Date(record['Entry Time']).getTime()
        const holdingPeriod: number = days_between(new Date(record['Exit Time']), new Date(record['Entry Time']))

        return {
          key: record['Order no'],
          'Order no': record['Order no'],
          'Equity Name': record['Equity Name'],
          'Trade': record['Trade'],
          'Entry Time': timestamp1,
          'Entry Price': record['Entry Price'],
          'Exit Time': timestamp2,
          'Exit Price': record['Exit Price'],
          'Exit Type': record['Exit Type'],
          'Quantity': record['Quantity'],
          'Position Size': record['Position Size'],
          'PNL': record['PNL'],
          '% PNL': record['% PNL'],
          'Holding Period': holdingPeriod.toString() + ' Days'
        }
      })
      trades.set(val.name, logs)
    })

    setTrades((cur) => trades)
    setLoading(false)
  }

  function getTradeRecords(name: string): TradesInterface[]{
    const logs = trades.get(name)
    if(logs === undefined){
      return []
    }
    else{
      return logs
    }
  }

  return {
    trades: trades,
    loading: loading,
    resetTradeRecords: resetTradeRecords,
    getTradeRecords: getTradeRecords
  }
}