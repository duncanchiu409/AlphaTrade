export enum Paths {
  HOME = '/',
  TRADES = '/trades',
  PORTFOLIO = '/portfolio',
  CONFIG = '/config',
  PORTFOLIOLOG = '/portfoliolog'
}

export enum MenuItem {
  CHART = 'chart',
  TRADES = 'trades',
  PORTFOLIO = 'portfolio',
  CONFIG = 'config',
  PORTFOLIOLOG = 'portfoliolog'
}

export const DefaultKey: Record<Paths, MenuItem> = {
  [Paths.HOME]: MenuItem.CHART,
  [Paths.TRADES]: MenuItem.TRADES,
  [Paths.PORTFOLIO]: MenuItem.PORTFOLIO,
  [Paths.CONFIG]: MenuItem.CONFIG,
  [Paths.PORTFOLIOLOG]: MenuItem.PORTFOLIOLOG
};