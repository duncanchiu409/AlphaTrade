import portfolio from '../data/portfolio.json'

interface csvPortfolioFormat {
  'Date': string;
  'Cash': number;
  "Allocated PNL": number;
  "Allocated % PNL": number;
  "Allocated": number;
  "Total PNL": number;
  "Total % PNL": number;
  "Total": number;
}

export interface PortfolioFormat {
  key: number;
  "Date": string;
  "Cash": number;
  "Allocated PNL": number;
  "Allocated % PNL": number;
  "Allocated": number;
  "Total PNL": number;
  "Total % PNL": number;
  "Total": number;
}

export function loadPortfolioData(): PortfolioFormat[] {
  const data = portfolio as csvPortfolioFormat[]
  const portfolios = data.map((value, index) => {
    return {
      key: index,
      Date: new Date(value['Date']).toDateString(),
      Cash: value['Cash'],
      "Allocated PNL": value['Allocated PNL'],
      "Allocated % PNL": value['Allocated % PNL'],
      "Allocated": value['Allocated'],
      "Total PNL": value['Total PNL'],
      "Total % PNL": value['Total % PNL'],
      "Total": value['Total']
    }
  })

  return portfolios
}