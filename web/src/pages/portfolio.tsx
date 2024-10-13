import React, { useState } from 'react'
import { LineChart } from '../components/charts/line'
import { Layout, Button } from 'antd'
import { YAxisType } from 'klinecharts'
import styled from 'styled-components'
import { Header } from '../components/ui/header'
import { StatsTable } from '../components/tables/stats'
import { AiOutlinePercentage, AiOutlineFieldNumber } from "react-icons/ai";
import '../App.css'


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

function Portfolio(): React.ReactElement {
  // const [axis, setAxis] = useState<YAxisType>(YAxisType.Normal)

  // const axisIcon: Record<string, React.ReactNode> = {
  //   [YAxisType.Percentage]: (
  //     <AiOutlineFieldNumber
  //       size={25}
  //       onClick={() => setAxis(YAxisType.Normal)}
  //     />
  //   ),
  //   [YAxisType.Normal]: (
  //     <AiOutlinePercentage
  //       size={25}
  //       onClick={() => setAxis(YAxisType.Percentage)}
  //     />
  //   ),
  // };

  // const extra: React.ReactNode[] = [<Button variant='link' icon={axisIcon[axis]}/>]

  return (
    <Layout.Content className='layout-content'>
      <Wrapper1>
        <Header title='Portfolio' subtitle='Line Chart for Portfolio'/>
        <LineChart/>
      </Wrapper1>
      <Wrapper2>
        <Header title='Strategy Stats' subtitle='Table for Strategy'/>
        <StatsTable/>
      </Wrapper2>
    </Layout.Content>
  )
}

export default Portfolio