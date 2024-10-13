import React from 'react'
import { Table, Layout } from 'antd'
import { Header } from '../components/ui/header'
import { Div } from '../components/ui/animated'
import '../App.css'

function Trades(): React.ReactElement {


  return(
    <Layout.Content className='layout-content' style={{flexDirection: 'column'}}>
      <Header title='Trading Records' subtitle='Executed trading records in this Model' />
      <Div>
        <Table size='large'>
          <Table.ColumnGroup title='Trade'>
            <Table.Column key='orderNo' title='Order no' dataIndex='Order no' />
            <Table.Column key='equityName' title='Equity Name' dataIndex='Equity Name' />
            <Table.Column key='entryTime' title='Entry Time' dataIndex='Entry Time' />
            <Table.Column key='entryPrice' title='Entry Price' dataIndex='Entry Price' />
            <Table.Column key='exitTime' title='Exit Time' dataIndex='Exit Time' />
            <Table.Column key='exitPrice' title='Exit Price' dataIndex='Exit Price' />
          </Table.ColumnGroup>
          <Table.ColumnGroup title='Information'>
            <Table.Column key='exitType' title='Exit Type' dataIndex='Exit Type' />
            <Table.Column key='quantity' title='Quantity' dataIndex='Quantity' />
            <Table.Column key='positionSize' title='Position Size' dataIndex='Position Size' />
            <Table.Column key='pnl' title='PNL' dataIndex='PNL' />
            <Table.Column key='percentpnl' title='% PNL' dataIndex='% PNL' />
            <Table.Column key='holdingPeriod' title='Holding Period' dataIndex='Holding Period' />
          </Table.ColumnGroup>
        </Table>
      </Div>
    </Layout.Content>
  )
}

export default Trades