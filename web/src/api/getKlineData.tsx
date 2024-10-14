import { KLineData } from 'klinecharts'
import file from './kline.json'

interface csvFormat {
  Date: string,
  "Adj Close": number,
  Open: number,
  High: number,
  Low: number,
  Close: number,
  Volume: number
}

export function getFakeData() {
  const equities = file as csvFormat[]
  const klinedata: KLineData[] = equities.map(i => {
    const timestamp = new Date(i.Date).getTime()
    return {
      timestamp: timestamp,
      open: parseFloat(i.Open.toFixed(2)),
      high: parseFloat(i.High.toFixed(2)),
      low: parseFloat(i.Low.toFixed(2)),
      close: parseFloat(i.Close.toFixed(2)),
      volume: i.Volume
    }
  })
  return klinedata
}