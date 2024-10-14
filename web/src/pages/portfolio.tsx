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
import { LineChartID, LineChartConfig } from '../config/lineChart'

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

const LineChartIds = [LineChartID.CASH, LineChartID.ALLOCATED, LineChartID.TOTAL]

function Portfolio(): React.ReactElement {
  const fakeData = loadPortfolioData()
  const chartData: Serie[] = [
    // {
    //   id: LineChartID.CASH,
    //   color: LineChartConfig[LineChartID.CASH],
    //   data: fakeData.filter((_, i) => i % 55 == 0).map(value => {
    //     return {
    //       x: value['Date'],
    //       y: value[LineChartID.CASH]
    //     }
    //   })
    // },
    // {
    //   id: LineChartID.ALLOCATED,
    //   color: LineChartConfig[LineChartID.ALLOCATED],
    //   data: fakeData.filter((_, i) => i % 55 == 0).map(value => {
    //     return {
    //       x: value['Date'],
    //       y: value[LineChartID.ALLOCATED]
    //     }
    //   })
    // },
    {
      id: LineChartID.TOTAL,
      color: LineChartConfig[LineChartID.TOTAL],
      data: fakeData.filter((_, i) => i % 20 == 0).map(value => {
        return {
          x: value['Date'],
          y: value[LineChartID.TOTAL]
        }
      })
    }
  ]

  return (
    <Layout.Content className='layout-content'>
      <Wrapper1>
        <Header title='Portfolio' subtitle='Line Chart for Portfolio' />

          <LineChart data={chartData} />
      </Wrapper1>
      <Wrapper2>
        <Header title='Strategy Stats' subtitle='Table for Strategy'/>
        <Spin tip='Loading' size='large' spinning={false} >
          <StatsTable/>
        </Spin>
      </Wrapper2>
    </Layout.Content>
  )
}

export default Portfolio