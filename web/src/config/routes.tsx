export enum Paths {
  HOME = '/',
  TRADES = '/trades',
  PORTFOLIO = '/portfolio',
  CONFIG = '/config',
}

export enum MenuItem {
  CHART = 'chart',
  TRADES = 'trades',
  PORTFOLIO = 'portfolio',
  CONFIG = 'config',
}

export const DefaultKey: Record<Paths, MenuItem> = {
  [Paths.HOME]: MenuItem.CHART,
  [Paths.TRADES]: MenuItem.TRADES,
  [Paths.PORTFOLIO]: MenuItem.PORTFOLIO,
  [Paths.CONFIG]: MenuItem.CONFIG,
};