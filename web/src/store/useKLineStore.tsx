import { KLineData } from 'klinecharts'
import { useState } from 'react'
import { getFakeData, BarFormat } from '../api/getKlineData'

export interface KLineStore {
  klineData: Map<string, Map<string, KLineData[]>>;
  loading: boolean;
  addKlineData: (add: KLineData[]) => void;
  resetKlineData: () => void;
  getKlineData: (modelName: string, equityName: string) => KLineData[];
}

function convertBarFormattoKLineData(data: BarFormat[]): KLineData[]{
  return data.map(i => {
    let timestamp: number;
    if(i.Date === undefined){
      timestamp = new Date(i.Datetime!).getTime()
    }
    else{
      timestamp = new Date(i.Date).getTime()
    }
    return {
      timestamp: timestamp,
      open: i.Open ? parseFloat(i.Open.toFixed(2)) : 0 ,
      high: i.High ? parseFloat(i.High.toFixed(2)) : 0,
      low: i.Low ? parseFloat(i.Low.toFixed(2)) : 0,
      close: i.Close ? parseFloat(i.Close.toFixed(2)) : 0,
      volume: i.Volume ? i.Volume : 0
    }
  })
}

export function useKLineStore(): KLineStore {
  const [klineData, setklineData] = useState<Map<string, Map<string, KLineData[]>>>(new Map<string, Map<string, KLineData[]>>)
  const [loading, setLoading] = useState<boolean>(true)

  function addKlineData(add: KLineData[]) {

  }

  function resetKlineData() {
    setLoading((cur) => true)
    const dataJSON = getFakeData()
    var klineData = new Map<string, Map<string, KLineData[]>>()
    dataJSON.value.map(modelData => {
      var equities = new Map<string, KLineData[]>()
      modelData.value.map(equityData => {
        equities.set(equityData.name, convertBarFormattoKLineData(equityData.value))
      })
      klineData.set(modelData.name, equities)
    })
    setklineData((cur) => klineData)
    setLoading(false)
  }

  function getKlineData(modelName: string, name: string): KLineData[] {
    // filter operations
    const model = klineData.get(modelName)
    if(model === undefined){
      return []
    }
    else{
      const kline = model.get(name)
      if(kline === undefined){
        return []
      }
      else{
        return kline
      }
    }
  }

  return {
    klineData: klineData,
    loading: loading,
    addKlineData: addKlineData,
    resetKlineData: resetKlineData,
    getKlineData: getKlineData
  }
}