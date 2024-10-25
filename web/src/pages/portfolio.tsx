import React, { useState, useEffect } from 'react'
import { LineChart } from '../components/charts/line'
import { Layout, Button, Spin } from 'antd'
import { Serie } from '@nivo/line'
import { YAxisType } from 'klinecharts'
import styled from 'styled-components'
import { Header } from '../components/ui/header'
import { StatsTable } from '../components/tables/stats'
import { AiOutlinePercentage, AiOutlineFieldNumber } from "react-icons/ai";
import '../App.css'
import { loadPortfolioData } from '../api/getFakePortfolioLog'
import { LineChartID, LineChartConfig, LineChartYAXIS } from '../config/lineChart'
import { usePortfolioStore, PortfolioLogInterface } from '../store/usePortfolioStore'
import { Div } from '../components/ui/animated'

const Wrapper1 = styled.div`
height: 80%;
flex: 8;
`

const Wrapper2 = styled.div`
flex: 5;
display: flex;
padding-right: 4em;
flex-direction: column;
`

interface PortfolioProps {
  model: string;
  setModel: (name: string) => void
}

function Portfolio(props: PortfolioProps): React.ReactElement {
  const [axis, setAxis] = useState<YAxisType>(YAxisType.Normal)
  const { portfolioLog, loading, resetPortfolio, getPortfolio } = usePortfolioStore()
  const models = Array.from(portfolioLog.keys())
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    resetPortfolio()
  }, [])

  const axisIcon: Record<string, React.ReactNode> = {
    [YAxisType.Percentage]: (
      <AiOutlineFieldNumber
        size={25}
        onClick={() => setAxis(YAxisType.Normal)}
      />
    ),
    [YAxisType.Normal]: (
      <AiOutlinePercentage
        size={25}
        onClick={() => setAxis(YAxisType.Percentage)}
      />
    )
  }

  function convert(val: PortfolioLogInterface, axis: YAxisType): number {
    const t = LineChartYAXIS[axis]
    return t === 'Total' ? val['Total'] : val['Total % PNL']
  }

  useEffect(() => {
    const data = models.map((modelName: string) => {
      const data = getPortfolio(modelName)
      const dataPoint = parseInt((data.length / 20).toFixed())
      return {
        id: modelName,
        // color: LineChartConfig[LineChartID.TOTAL],
        data: data.filter((_, i) => i % dataPoint === 0).map(value => {
          return {
            x: new Date(value['Date']).toLocaleString(),
            y: convert(value, axis)
          }
        })
      }
    })
    setChartData(data)
  }, [portfolioLog, axis])

  const extra = [axisIcon[axis]]

  return (
    <Layout.Content className='layout-content' style={{ flexDirection: 'column' }}>
      <Spin tip='Loading' size='large' spinning={loading}>
        <div style={{marginRight: '110px'}}>
          <Header title='Portfolio' subtitle='Line Chart for Portfolio' extra={extra} />
        </div>
        <div style={{ height: '80vh' }}>
          <LineChart data={chartData} />
        </div>
      </Spin>
    </Layout.Content>
  )
}

export default Portfolio