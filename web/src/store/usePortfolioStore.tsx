import { useState } from 'react'
import { PortfolioFormat, loadPortfolioData } from '../api/getFakePortfolioLog'

export interface PortfolioStore {
  portfolioLog: PortfolioFormat[];
  loading: boolean;
  resetPortfolio: () => void
  addPortfolio: (add: PortfolioFormat[]) => void
  getPortfolio: () => PortfolioFormat[]
}

export function usePortfolioStore(): PortfolioStore {
  const [portfolioLog, setPortfolioLog] = useState<PortfolioFormat[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  function resetPortfolio() {
    setLoading((cur) => true)
    const data: PortfolioFormat[] = loadPortfolioData()

    if(data.length !== 0){
      setPortfolioLog((cur) => data)
      setLoading((cur) => false)
    }
  }

  function addPortfolio(add: PortfolioFormat[]){
    setPortfolioLog((cur) => [...cur, ...add])
  }

  function getPortfolio() {
    // Filter Operations
    return portfolioLog
  }

  return {
    portfolioLog: portfolioLog,
    loading: loading,
    resetPortfolio: resetPortfolio,
    addPortfolio: addPortfolio,
    getPortfolio: getPortfolio,
  }
}