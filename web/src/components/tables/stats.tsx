import { Descriptions, DescriptionsProps } from 'antd'
import { TableInterface } from '../../store/useTableStore'
import React from 'react'

interface StatsTableProps {
  table: TableInterface;
}

function convertPercent(i: number): string{
  return i.toFixed() + ' %'
}

export function StatsTable(props: StatsTableProps): React.ReactElement {
  const { table } = props

  const items: DescriptionsProps['items'] = [
    {
      label: 'Total Trade Scripts',
      span: { xl: 3, xxl: 3 },
      children: table['Total Trade Scripts'],
    },
    {
      label: 'Total Trade',
      span: { xl: 3, xxl: 3 },
      children: table['Total Trade'],
    },
    {
      label: '% PNL',
      span: { xl: 3, xxl: 3 },
      children: convertPercent(table['% PNL']),
    },
    {
      label: 'Winners',
      span: { xl: 3, xxl: 3 },
      children: table['Winners'],
    },
    {
      label: 'Losers',
      span: { xl: 3, xxl: 3 },
      children: table['Losers'],
    },
    {
      label: '% Win Ratio',
      span: { xl: 3, xxl: 3 },
      children: convertPercent(table['% Win Ratio']),
    },
    {
      label: '% Total Profit',
      span: { xl: 3, xxl: 3 },
      children: convertPercent(table['% Total Profit']),
    },
    {
      label: '% Average Profit per Trade',
      span: { xl: 3, xxl: 3 },
      children: convertPercent(table['% Average Profit per Trade']),
    },
    {
      label: '% Average Loss per Trade',
      span: { xl: 3, xxl: 3 },
      children: convertPercent(table['% Average Loss per Trade']),
    },
    {
      label: '% Average PNL per Trade',
      span: { xl: 3, xxl: 3 },
      children: convertPercent(table['% Average PNL per Trade']),
    },
    {
      label: 'Risk Reward',
      span: { xl: 3, xxl: 3 },
      children: table['Risk Reward'],
    },
    // {
    //   label: 'Starting Equity',
    //   span: { xl: 3, xxl: 3 },
    //   children: '$1000000',
    // },
    // {
    //   label: 'Ending Equity',
    //   span: { xl: 3, xxl: 3 },
    //   children: '$1942570.436',
    // },
    {
      label: '% MaxDrawDown',
      span: { xl: 3, xxl: 3 },
      children: convertPercent(table['% MaxDrawDown']),
    },
    {
      label: 'Sharpe Ratio',
      span: { xl: 3, xxl: 3 },
      children: table['Sharpe Ratio'],
    },
    {
      label: 'Sortino Ratio',
      span: { xl: 3, xxl: 3 },
      children: table['Sortino Ratio'],
    },
  ]

  return (
    <div>
      <Descriptions bordered size='small' items={items}/>
    </div>
  )
}