import { Table, Layout, Button, Typography } from 'antd'
import { Div } from '../ui/animated'
import { AiFillApple } from "react-icons/ai";
import { useState, useEffect } from 'react'
import { TradesFormat } from '../../api/getFakeTradingRecords'

interface EquitiesTableProps {
  trades: TradesFormat[]
}

export function EquitiesTable(props: EquitiesTableProps) {
  const { trades } = props
  const [ equities, setEquities ] = useState<TradesFormat[]>([])

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
  }, [trades])

  return (
    <Div>
      <Table size='small' pagination={{pageSize: trades.length}} dataSource={equities} scroll={{ y: 70 * 7.5 }}>
        <Table.Column key="equityName" title="Symbol" dataIndex="Equity Name" />
        <Table.Column key='action' title='Action' render={(_: any) => <Button>Open</ Button>} />
      </Table>
    </Div>
  )
}