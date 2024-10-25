import React, { useState } from 'react'
import { Layout, Spin } from 'antd'
import { StatsTable } from '../components/tables/stats'
import { Header } from '../components/ui/header'
import styled from 'styled-components'

interface ConfigProps {
  model: string
}

const Wrapper1 = styled.div`
display: flex;
flex-direction: row;
`

const Wrapper2 = styled.div`
flex: 5;
display: flex;
padding-right: 4em;
flex-direction: column;
`

export default function Config(props: ConfigProps): React.ReactElement {
  return (
    <Layout.Content className='layout-content' style={{flexDirection: 'column'}}>
      <Header title='Strategy Comparison' subtitle='Table from each Strategy for comparison'/>
      <Wrapper1>
        <Wrapper2>
          <Spin tip='Loading' size='large' spinning={false} >
            <StatsTable />
          </Spin>
        </Wrapper2>
        <Wrapper2>
          <Spin tip='Loading' size='large' spinning={false} >
            <StatsTable />
          </Spin>
        </Wrapper2>
        <Wrapper2>
          <Spin tip='Loading' size='large' spinning={false} >
            <StatsTable />
          </Spin>
        </Wrapper2>
      </Wrapper1>
    </Layout.Content>
  )
}