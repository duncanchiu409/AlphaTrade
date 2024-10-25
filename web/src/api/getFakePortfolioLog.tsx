import portfolio from '../data/portfolio.json'

export interface jsonPortfolioFormat {
  key: string;
  value: {
    name: string;
    value: PortfolioFormat[];
  }[]
}

export interface PortfolioFormat {
  "Date": string;
  "Cash": number;
  "Allocated PNL": number;
  "Allocated % PNL": number;
  "Allocated": number;
  "Total PNL": number;
  "Total % PNL": number;
  "Total": number;
}

export function loadPortfolioData(): jsonPortfolioFormat {
  const dataJSON = portfolio as jsonPortfolioFormat
  return dataJSON
}