import { useState } from 'react'
import { loadTradingRecords, TradesFormat } from '../api/getFakeTradingRecords'

interface TradeRecordsStore {
  trades: TradesFormat[];
  loading: boolean;
  resetTradeRecords: () => void;
}

export function useTradeRecordsStore(): TradeRecordsStore {
  const [loading, setLoading] = useState<boolean>(true)
  const [trades, setTrades] = useState<TradesFormat[]>([])

  function resetTradeRecords() {
    setLoading(true)
    const data = loadTradingRecords()

    if(data.length != 0){
      setLoading(false)
      setTrades(data)
    }
  }

  return {
    trades: trades,
    loading: loading,
    resetTradeRecords: resetTradeRecords
  }
}