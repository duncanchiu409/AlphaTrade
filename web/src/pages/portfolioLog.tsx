import React, { useEffect, useState } from 'react'
import { Layout, Spin, Table, Typography, Tag } from 'antd'
import { Div } from '../components/ui/animated'
import { Header } from '../components/ui/header'
import { usePortfolioStore, PortfolioLogInterface } from '../store/usePortfolioStore'
import { DropDown } from '../components/ui/dropDown'

interface PortfolioLogProps {
  model: string;
  setModel: (name: string) => void;
}

function PortfolioLog(props: PortfolioLogProps): React.ReactElement {
  const { model, setModel } = props
  const { portfolioLog, loading, resetPortfolio, getPortfolio } = usePortfolioStore()
  const [ showingPortfolioLog, setShowingPortfolioLog ] = useState<PortfolioLogInterface[]>([])
  let hedge: boolean = false

  useEffect(() => {
    resetPortfolio()
  }, [])

  useEffect(() => {
    setShowingPortfolioLog(getPortfolio(model))
  }, [portfolioLog, model])

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

  function renderDates(timestamp :number): React.ReactNode {
    const dateLocalString = new Date(timestamp).toLocaleString()
    return <p>{dateLocalString}</p>
  }

  let content: React.ReactNode = (
    <Spin tip='Loading' size='large' spinning={loading}>
      <Table size='middle' dataSource={showingPortfolioLog} pagination={{ pageSize: 100 }} scroll={{ y: 55 * 7.5 }}>
        <Table.ColumnGroup title='Basic Information'>
          <Table.Column key='date' title='Date' dataIndex='Date' sorter={(a, b) => a['Date'] - b['Date']} render={renderDates} />
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

  const models = Array.from(portfolioLog.keys())
  let extra :React.ReactNode[] = React.Children.toArray([<DropDown model={model} models={models} setModel={setModel} />])

  return (
    <Layout.Content className='layout-content' style={{ flexDirection: 'column' }}>
      <Header title='Portfolio Records' subtitle='Portfolio Records at the end of the each Trading Day' extra={extra}/>
      <Div>
        {content}
      </Div>
    </Layout.Content>
  )
}

export default PortfolioLog