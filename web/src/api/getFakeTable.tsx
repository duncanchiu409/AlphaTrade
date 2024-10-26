import tables from '../data/tables.json'

export interface jsonTableFormat {
  key: string;
  value: {
    name: string;
    value: TableFormat[];
  }[]
}

export interface TableFormat {
  "Unnamed: 0": number,
  "Total Trade Scripts": number,
  "Total Trade": number,
  "% PNL": number,
  "Winners": number,
  "Losers": number,
  "% Win Ratio": number,
  "% Total Profit": number,
  "% Total Loss": number,
  "% Average Profit per Trade": number,
  "% Average Loss per Trade": number,
  "% Average PNL per Trade": number,
  "Risk Reward": string,
  "Starting Equity": number,
  "Ending Equity": number,
  "% MaxDrawDown": number,
  "Sharpe Ratio": number,
  "Sortino Ratio": number
}

export function loadTables(): jsonTableFormat {
  return tables as jsonTableFormat
}