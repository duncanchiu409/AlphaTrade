import { KLineData } from 'klinecharts'
import { useState } from 'react'
import { getFakeData } from '../api/getKlineData'

export interface KLineStore {
  klineData: KLineData[];
  loading: boolean;
  addKlineData: (add: KLineData[]) => void;
  resetKlineData: () => void;
  getKlineData: (equityName: string) => KLineData[];
}

export function useKLineStore(): KLineStore {
  const [klineData, setklineData] = useState<KLineData[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  function addKlineData(add: KLineData[]) {
    setklineData((cur) => [...cur, ...add])
  }

  function resetKlineData() {
    setLoading((cur) => true)
    const data: KLineData[] = getFakeData()

    if (data.length != 0) {
      setklineData((cur) => data)
      setLoading(false)
    }
  }

  function getKlineData(): KLineData[] {
    // filter operations
    return klineData
  }

  return {
    klineData: klineData,
    loading: loading,
    addKlineData: addKlineData,
    resetKlineData: resetKlineData,
    getKlineData: getKlineData
  }
}