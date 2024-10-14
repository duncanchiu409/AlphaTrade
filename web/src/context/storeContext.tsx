import { createContext } from 'react'
import { PortfolioFormat } from '../api/getFakePortfolioLog'
import { usePortfolioStore, PortfolioStore } from '../store/usePortfolioStore'

export const StoreContext = createContext<PortfolioStore>({
  portfolioLog: [],
  loading: true,
  resetPortfolio: () => {},
  addPortfolio: (add: PortfolioFormat[]) => {},
  getPortfolio: () => []
})

interface StoreProviderProps {
  children?: React.ReactElement
}

export function StoreProvider({ children }: StoreProviderProps) {
  const store = usePortfolioStore()

  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  )
}