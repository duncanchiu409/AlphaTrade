import { Table, Layout, Button, Typography } from 'antd'
import { Div } from '../ui/animated'
import { AiFillApple } from "react-icons/ai";
import { TradesFormat } from '../../api/getFakeTradingRecords'

interface EquitiesTableProps {
  trades: TradesFormat[]
}

export function EquitiesTable(props: EquitiesTableProps) {
  const { trades } = props

  return (
    <Div>
      <Table size='small' pagination={{pageSize: trades.length}} dataSource={trades} scroll={{ y: 70 * 7.5 }}>
        <Table.Column key="equityName" title="Symbol" dataIndex="Equity Name" />
        <Table.Column key='action' title='Action' render={(_: any) => <Button>Open</ Button>} />
      </Table>
    </Div>
  )
}