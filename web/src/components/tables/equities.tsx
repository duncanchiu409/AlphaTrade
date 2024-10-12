import React, { useState } from 'react'
import { Table, Layout, Button, Typography } from 'antd'
import { Div } from '../../ui/animated'
import { AiFillApple } from "react-icons/ai";

interface Equity {
  key: string,
  'Equity Name': string
}

export function EquitiesTable() {
  const data: Equity[] = [{ key: "HOVR", "Equity Name": "HOVR" }]

  return (
    <Div>
      <Table<Equity> dataSource={data}>
        <Table.Column key='icon' title='' render={(_: any) => <AiFillApple />} />
        <Table.Column<Equity> key="equityName" title="Symbol" dataIndex="Equity Name" />
        <Table.Column key='action' title='Action' render={(_: any) => <Button>Open</ Button>} />
      </Table>
    </Div>
  )
}