import React, { useEffect } from 'react'
import { Table, Layout, Tag, Typography, Spin } from 'antd'
import { useTradeRecordsStore } from '../store/useTradeRecordsStore'
import { Header } from '../components/ui/header'
import { Div } from '../components/ui/animated'
import '../App.css'

function Trades(): React.ReactElement {
  const { trades, loading, resetTradeRecords } = useTradeRecordsStore()

  useEffect(() => {
    resetTradeRecords()
  }, [])

  function renderExitType(exitType: string): React.ReactNode {
    let color = 'blue'
    if (exitType === 'Stop Loss') {
      color = 'red'
    }
    else if (exitType === 'Take Profit') {
      color = 'green'
    }
    else if (exitType === 'Complete') {
      color = 'orange'
    }
    return (<Tag color={color}>{exitType}</Tag>)
  }

  function renderPNL(pnl: number): React.ReactNode {
    let color = 'blue'
    if (pnl > 0) {
      color = 'green'
    }
    else if(pnl == 0){
      color = 'orange'
    }
    else if (pnl < 0) {
      color = 'red'
    }
    return (<Typography.Text style={{ color: color }}>{pnl}</Typography.Text>)
  }

  function renderPercentagePNL(percent: number): React.ReactNode {
    let color = 'blue'
    if (percent > 0) {
      color = 'green'
    }
    else if(percent == 0){
      color = 'orange'
    }
    else if (percent < 0) {
      color = 'red'
    }
    return (<Tag color={color}>{percent} %</Tag>)
  }

  const filters = [
    { text: 'Stop Loss', value: 'Stop Loss' },
    { text: 'Take Profit', value: 'Take Profit' },
    { text: 'Complete', value: 'Complete' }
  ]

  let content: React.ReactNode = (
    <Spin tip='Loading' spinning={loading} size='large'>
      <Table size='middle' dataSource={trades} pagination={{ pageSize: trades.length }} scroll={{ y: 55 * 7.5 }}>
        <Table.ColumnGroup title='Trade'>
          <Table.Column key='orderNo' title='Order no' dataIndex='Order no' />
          <Table.Column key='equityName' title='Equity Name' dataIndex='Equity Name' />
          <Table.Column key='entryTime' title='Entry Time' dataIndex='Entry Time' />
          <Table.Column key='entryPrice' title='Entry Price' dataIndex='Entry Price' sorter={(a, b) => a['Entry Price'] - b['Entry Price']} />
          <Table.Column key='exitTime' title='Exit Time' dataIndex='Exit Time' />
          <Table.Column key='exitPrice' title='Exit Price' dataIndex='Exit Price' sorter={(a, b) => a['Exit Price'] - b['Exit Price']} />
        </Table.ColumnGroup>
        <Table.ColumnGroup title='Information'>
          <Table.Column key='exitType' title='Exit Type' dataIndex='Exit Type' render={renderExitType} filters={filters} onFilter={(value, record) => value === record['Exit Type']} />
          <Table.Column key='quantity' title='Quantity' dataIndex='Quantity' sorter={(a, b) => a['Quantity'] - b['Quantity']} />
          <Table.Column key='positionSize' title='Position Size' dataIndex='Position Size' sorter={(a, b) => a['Position Size'] - b['Position Size']} />
          <Table.Column key='pnl' title='PNL' dataIndex='PNL' render={renderPNL} sorter={(a, b) => a['PNL'] - b['PNL']} />
          <Table.Column key='percentpnl' title='% PNL' dataIndex='% PNL' render={renderPercentagePNL} sorter={(a, b) => a['% PNL'] - b['% PNL']} />
          <Table.Column key='holdingPeriod' title='Holding Period' dataIndex='Holding Period' />
        </Table.ColumnGroup>
      </Table>
    </Spin>)

  return (
    <Layout.Content className='layout-content' style={{ flexDirection: 'column' }}>
      <Header title='Trading Records' subtitle='Executed trading records in this Model' />
      <Div>
        {content}
      </Div>
    </Layout.Content>
  )
}

export default Trades