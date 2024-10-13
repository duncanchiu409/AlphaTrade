import { Descriptions, DescriptionsProps } from 'antd'
import React from 'react'

export function StatsTable(): React.ReactElement {
  const items: DescriptionsProps['items'] = [
    {
      label: 'Total Trade Scripts',
      span: { xl: 3, xxl: 3 },
      children: 69,
    },
    {
      label: 'Total Trade',
      span: { xl: 3, xxl: 3 },
      children: 69,
    },
    {
      label: '% PNL',
      span: { xl: 3, xxl: 3 },
      children: '94.26 %',
    },
    {
      label: 'Winners',
      span: { xl: 3, xxl: 3 },
      children: 48,
    },
    {
      label: 'Losers',
      span: { xl: 3, xxl: 3 },
      children: 21,
    },
    {
      label: '% Win Ratio',
      span: { xl: 3, xxl: 3 },
      children: '69.57 %',
    },
    {
      label: '% Total Profit',
      span: { xl: 3, xxl: 3 },
      children: '117.42 %',
    },
    {
      label: '% Average Profit per Trade',
      span: { xl: 3, xxl: 3 },
      children: '2.45 %',
    },
    {
      label: '% Average Loss per Trade',
      span: { xl: 3, xxl: 3 },
      children: '-1.1 %',
    },
    {
      label: '% Average PNL per Trade',
      span: { xl: 3, xxl: 3 },
      children: '1.37 %',
    },
    {
      label: 'Risk Reward',
      span: { xl: 3, xxl: 3 },
      children: '1:2.23',
    },
    {
      label: 'Starting Equity',
      span: { xl: 3, xxl: 3 },
      children: '$1000000',
    },
    {
      label: 'Ending Equity',
      span: { xl: 3, xxl: 3 },
      children: '$1942570.436',
    },
    {
      label: '% MaxDrawDown',
      span: { xl: 3, xxl: 3 },
      children: '-50.284 %',
    },
    {
      label: 'Sharpe Ratio',
      span: { xl: 3, xxl: 3 },
      children: '2.877',
    },
    {
      label: 'Sortino Ratio',
      span: { xl: 3, xxl: 3 },
      children: '4.329',
    },
  ]

  return (
    <div>
      <Descriptions bordered size='small' items={items}/>
    </div>
  )
}