import React, { useState } from 'react'
import { Table, Layout } from 'antd'
import { Div } from '../ui/animated'
import { TradesFormat } from '../../api/getFakeTradingRecords'

interface TradesTableProps {
  trades: TradesFormat[]
}

export function TradesTable(props: TradesTableProps) {
  const { trades } = props

  const columns = [
    {
      title: 'Trade',
      dataIndex: 'Trade',
      key: 'tradeType',
    },
    {
      title: 'Entry',
      dataIndex: 'Entry Price',
      key: 'entryPrice',
    },
    {
      title: 'Exit',
      dataIndex: 'Exit Price',
      key: 'exitPrice',
    },
    {
      title: 'Exit Type',
      dataIndex: 'Exit Type',
      key: 'exitType',
    },
    {
      title: '% PNL',
      dataIndex: '% PNL',
      key: 'percentPNL',
    },
  ]

  return(
    <Div>
      <Table columns={columns} dataSource={trades}/>
    </Div>
  )
}