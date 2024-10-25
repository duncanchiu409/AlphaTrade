import { Table, Layout, Button, Typography } from 'antd'
import { Div } from '../ui/animated'
import { AiFillApple } from "react-icons/ai";
import { useState, useEffect } from 'react'
import { TradesInterface } from '../../store/useTradeRecordsStore'

interface EquitiesTableProps {
  trades: TradesInterface[]
  setEquity: (name: string) => void
}

export function EquitiesTable(props: EquitiesTableProps) {
  const { trades, setEquity } = props
  const [ equities, setEquities ] = useState<TradesInterface[]>([])

  useEffect(() => {
    let stack: string[] = []
    const equities = trades.filter((trade, index) => {
      if(stack.includes(trade['Equity Name'])){
        return false
      }
      else{
        stack.push(trade['Equity Name'])
        return true
      }
    })
    setEquities(equities)
    setEquity(stack[0])
  }, [trades])

  function onClick(name: string){
    setEquity(name)
  }

  return (
    <Div>
      <Table size='small' pagination={{pageSize: 100}} dataSource={equities} scroll={{ y: 70 * 7.5 }}>
        <Table.Column key="equityName" title="Symbol" dataIndex="Equity Name" />
        <Table.Column key='action' title='Action' render={(_: any, record: TradesInterface) => <Button onClick={() => onClick(record['Equity Name'])}>Open</ Button>} />
      </Table>
    </Div>
  )
}