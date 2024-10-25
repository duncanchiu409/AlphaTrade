import { useState } from 'react'
import { jsonPortfolioFormat, loadPortfolioData } from '../api/getFakePortfolioLog'

export interface PortfolioLogInterface {
  key: number;
  "Date": number;
  "Cash": number;
  "Allocated PNL": number;
  "Allocated % PNL": number;
  "Allocated": number;
  "Total PNL": number;
  "Total % PNL": number;
  "Total": number;
}

export interface PortfolioStore {
  portfolioLog: Map<string, PortfolioLogInterface[]>;
  loading: boolean;
  resetPortfolio: () => void
  addPortfolio: (add: PortfolioLogInterface[]) => void
  getPortfolio: (name: string) => PortfolioLogInterface[]
}

export function usePortfolioStore(): PortfolioStore {
  const [portfolioLog, setPortfolioLog] = useState<Map<string, PortfolioLogInterface[]>>(new Map<string, PortfolioLogInterface[]>())
  const [loading, setLoading] = useState<boolean>(true)

  function resetPortfolio() {
    setLoading((cur) => true)
    const dataJSON: jsonPortfolioFormat = loadPortfolioData()
    var portfolioLog = new Map<string, PortfolioLogInterface[]>()

    dataJSON.value.map(val => {
      const logs = val.value.map(value => {
        const timestamp = new Date(value.Date).getTime()
        return {
          key: timestamp,
          "Date": timestamp,
          "Cash": value['Cash'],
          "Allocated PNL": value['Allocated PNL'],
          "Allocated % PNL": value['Allocated % PNL'],
          "Allocated": value['Allocated'],
          "Total PNL": value['Total PNL'],
          "Total % PNL": value['Total % PNL'],
          "Total": value['Total']
        }
      })
      portfolioLog.set(val.name, logs)
    })

    setPortfolioLog((cur) => portfolioLog)
    setLoading((cur) => false)
  }

  function addPortfolio(add: PortfolioLogInterface[]) {

  }

  function getPortfolio(name: string): PortfolioLogInterface[] {
    // Filter Operations
    const logs = portfolioLog.get(name)
    if(logs === undefined){
      return []
    }
    else {
      return logs
    }
  }

  return {
    portfolioLog: portfolioLog,
    loading: loading,
    resetPortfolio: resetPortfolio,
    addPortfolio: addPortfolio,
    getPortfolio: getPortfolio,
  }
}