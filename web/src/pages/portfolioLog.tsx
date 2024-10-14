import React, { useEffect } from 'react'
import { Layout, Spin, Table, Typography, Tag } from 'antd'
import { Div } from '../components/ui/animated'
import { Header } from '../components/ui/header'
import { usePortfolioStore } from '../store/usePortfolioStore'

function PortfolioLog(): React.ReactElement {
  const { portfolioLog, loading, resetPortfolio } = usePortfolioStore()
  let hedge: boolean = false

  useEffect(() => {
    resetPortfolio()
  }, [])

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

  let content: React.ReactNode = (
    <Spin tip='Loading' size='large' spinning={loading}>
      <Table size='middle' dataSource={portfolioLog} pagination={{ pageSize: portfolioLog.length }} scroll={{ y: 55 * 7.5 }}>
        <Table.ColumnGroup title='Basic Information'>
          <Table.Column key='date' title='Date' dataIndex='Date' sorter={(a, b) => new Date(a['Date']).getTime() - new Date(b['Date']).getTime()} />
          <Table.Column key='cash' title='Cash' dataIndex='Cash' sorter={(a, b) => a['Cash'] - b['Cash']} />
        </Table.ColumnGroup>
        <Table.ColumnGroup title='Equities Allocation'>
          <Table.Column key='allocatedPNL' title='Allocated PNL' dataIndex='Allocated PNL' render={renderPNL} sorter={(a, b) => a['Allocated PNL'] - b['Allocated PNL']} />
          <Table.Column key='allocatedPercentagePNL' title='Allocated % PNL' dataIndex='Allocated % PNL' render={renderPercentagePNL} sorter={(a, b) => a['Allocated % PNL'] - b['Allocated % PNL']} />
          <Table.Column key='allocated' title='Allocated' dataIndex='Allocated' sorter={(a, b) => a['Allocated'] - b['Allocated']} />
        </Table.ColumnGroup>
        {hedge ? (
          <Table.ColumnGroup title='Hedge Allocation'>
            <Table.Column key='hedgePNL' title='Hedge PNL' dataIndex='Hedge PNL' render={renderPNL} sorter={(a, b) => a['Hedge PNL'] - b['Hedge PNL']} />
            <Table.Column key='hedgePercentagePNL' title='Hedge % PNL' dataIndex='Hedge % PNL' render={renderPercentagePNL} sorter={(a, b) => a['Hedge % PNL'] - b['Hedge % PNL']} />
            <Table.Column key='hedge' title='Hedge' dataIndex='Hedge' sorter={(a, b) => a['Hedge'] - b['Hedge']} />
          </Table.ColumnGroup>
        ) : (<></>)}
        <Table.ColumnGroup title='Overall Information'>
          <Table.Column key='total' title='Total PNL' dataIndex='Total PNL' render={renderPNL} sorter={(a, b) => a['Total PNL'] - b['Total PNL']} />
          <Table.Column key='totalPercentagePNL' title='Total % PNL' dataIndex='Total % PNL' render={renderPercentagePNL} sorter={(a, b) => a['Total % PNL'] - b['Total % PNL']} />
          <Table.Column key='total' title='Total' dataIndex='Total' sorter={(a, b) => a['Total'] - b['Total']} />
        </Table.ColumnGroup>
      </Table>
    </Spin>
  )

  return (
    <Layout.Content className='layout-content' style={{ flexDirection: 'column' }}>
      <Header title='Portfolio Records' subtitle='Portfolio Records at the end of the each Trading Day' />
      <Div>
        {content}
      </Div>
    </Layout.Content>
  )
}

export default PortfolioLog