import React from 'react'
import { TableInterface } from '../../store/useTableStore'
import { Descriptions, DescriptionsProps, Typography, Tag } from 'antd'

interface ComparisonStatsTableProps {
  defaultTable: TableInterface;
  table: TableInterface;
}

function convertPercent(i: number): string{
  return i.toFixed() + ' %'
}

export function ComparisonStatsTable(props: ComparisonStatsTableProps): React.ReactElement {
  const { defaultTable, table } = props

  function convertPercent(i: number): string{
    return i.toFixed() + ' %'
  }

  function renderNumber(defaultNum: number, num: number): React.ReactNode {
    let color = 'blue'
    if (defaultNum < num) {
      color = 'green'
    }
    else if(defaultNum == num){
      color = 'orange'
    }
    else if (defaultNum > num) {
      color = 'red'
    }
    return (<Typography.Text style={{ color: color }}>{num}</Typography.Text>)
  }

  function renderPercentage(defaultNum: number, num: number): React.ReactNode {
    let color = 'blue'
    if (defaultNum < num) {
      color = 'green'
    }
    else if(defaultNum == num){
      color = 'orange'
    }
    else if (defaultNum > num) {
      color = 'red'
    }
    return (<Tag color={color}>{num} %</Tag>)
  }

  const items: DescriptionsProps['items'] = [
    {
      label: 'Total Trade Scripts',
      span: { xl: 3, xxl: 3 },
      children: renderNumber(defaultTable['Total Trade Scripts'], table['Total Trade Scripts']),
    },
    {
      label: 'Total Trade',
      span: { xl: 3, xxl: 3 },
      children: renderNumber(defaultTable['Total Trade'], table['Total Trade']),
    },
    {
      label: '% PNL',
      span: { xl: 3, xxl: 3 },
      children: renderPercentage(defaultTable['% PNL'], table['% PNL']),
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
      children: renderPercentage(defaultTable['% Win Ratio'], table['% Win Ratio']),
    },
    {
      label: '% Total Profit',
      span: { xl: 3, xxl: 3 },
      children: renderPercentage(defaultTable['% Total Profit'], table['% Total Profit']),
    },
    {
      label: '% Average Profit per Trade',
      span: { xl: 3, xxl: 3 },
      children: renderPercentage(defaultTable['% Average Profit per Trade'], table['% Average Profit per Trade']),
    },
    {
      label: '% Average Loss per Trade',
      span: { xl: 3, xxl: 3 },
      children: renderPercentage(defaultTable['% Average Loss per Trade'], table['% Average Loss per Trade']),
    },
    {
      label: '% Average PNL per Trade',
      span: { xl: 3, xxl: 3 },
      children: renderPercentage(defaultTable['% Average PNL per Trade'], table['% Average PNL per Trade']),
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
      children: renderPercentage(defaultTable['% MaxDrawDown'], table['% MaxDrawDown']),
    },
    {
      label: 'Sharpe Ratio',
      span: { xl: 3, xxl: 3 },
      children: renderNumber(defaultTable['Sharpe Ratio'], table['Sharpe Ratio']),
    },
    {
      label: 'Sortino Ratio',
      span: { xl: 3, xxl: 3 },
      children: renderNumber(defaultTable['Sortino Ratio'], table['Sortino Ratio']),
    },
  ]

  return (
    <div>
      <Descriptions bordered size='small' items={items}/>
    </div>
  )
}