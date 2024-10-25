import { KLineData } from 'klinecharts'
import file from '../data/kline.json'

export interface jsonBarFormat {
  key: string;
  value: {
    name: string;
    value: {
      name: string;
      value: BarFormat[];
    }[];
  }[];
}

export interface BarFormat {
  "Date": string | undefined;
  "Datetime": string | undefined;
  "Adj Close": number,
  "Open": number,
  "High": number,
  "Low": number,
  "Close": number,
  "Volume": number
}

export function getFakeData(): jsonBarFormat {
  const dataJSON = file as jsonBarFormat
  return dataJSON
}