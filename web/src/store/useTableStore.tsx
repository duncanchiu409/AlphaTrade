import { useState } from 'react'
import { loadTables } from '../api/getFakeTable'

export interface TableInterface {
  key: string
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
  // "Starting Equity": number,
  // "Ending Equity": number,
  "% MaxDrawDown": number,
  "Sharpe Ratio": number,
  "Sortino Ratio": number
}

export interface TableStore {
  tables: Map<string, TableInterface>;
  loading: boolean;
  resetTables: () => void
  addTable: (add: TableInterface[]) => void
  getTable: (name: string) => TableInterface | undefined
}

export function useTableStore(): TableStore {
  const [tables, setTables] = useState<Map<string, TableInterface>>(new Map<string, TableInterface>())
  const [loading, setLoading] = useState<boolean>(true)

  function resetTables() {
    setLoading(true)
    const data = loadTables()
    let tablesMap = new Map<string, TableInterface>()
    data.value.map(table => {
      const tmp: TableInterface = {key: table.name, ...table.value[0]}
      tablesMap.set(table.name, tmp)
    })
    setTables(tablesMap)
    setLoading(false)
  }

  function addTable(add: TableInterface[]){

  }

  function getTable(name: string): TableInterface | undefined{
    const table = tables.get(name)
    return table
  }

  return {
    tables: tables,
    loading: loading,
    resetTables: resetTables,
    addTable: addTable,
    getTable: getTable
  }
}