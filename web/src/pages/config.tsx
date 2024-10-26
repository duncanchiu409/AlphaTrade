import React, { useState, useEffect } from 'react'
import { Layout, Spin } from 'antd'
import { StatsTable } from '../components/tables/stats'
import { Header } from '../components/ui/header'
import styled from 'styled-components'
import { useTableStore, TableInterface } from '../store/useTableStore'
import { DropDown } from '../components/ui/dropDown'
import { ComparisonStatsTable } from '../components/tables/compStats'

interface ConfigProps {
  model: string
  setModel: (name: string) => void
}

const Wrapper1 = styled.div`
display: flex;
flex-direction: row;
`

const Wrapper2 = styled.div`
flex: 5;
display: flex;
margin-right: 4em;
flex-direction: column;
`

export default function Config(props: ConfigProps): React.ReactElement {
  const { model, setModel } = props
  const [ model1, setModel1 ] = useState<string>('NONE')
  const [ model2, setModel2 ] = useState<string>('NONE')
  const [ models, setModels ] = useState<string[]>([])
  const { tables , loading, resetTables, getTable } = useTableStore()
  const [ showingTable, setShowingTable ] = useState<TableInterface>()
  const [ showingTable1, setShowingTable1 ] = useState<TableInterface>()
  const [ showingTable2, setShowingTable2 ] = useState<TableInterface>()

  useEffect(() => {
    resetTables()
  }, [])

  useEffect(() => {
    setModels(Array.from(tables.keys()))
  }, [tables])

  useEffect(() => {
    let defaultTable = getTable(model)
    setShowingTable(defaultTable)
  }, [tables, model])

  useEffect(() => {
    let defaultTable = getTable(model1)
    setShowingTable1(defaultTable)
  }, [tables, model1])

  useEffect(() => {
    let defaultTable = getTable(model2)
    setShowingTable2(defaultTable)
  }, [tables, model2])

  let extra :React.ReactNode[] = React.Children.toArray([
    <p>DEFAULT</p>,
    <DropDown model={model} models={models} setModel={setModel} />,
    <p>VS</p>,
    <DropDown model={model1} models={['NONE', ...models]} setModel={setModel1} />,
    <p>VS</p>,
    <DropDown model={model2} models={['NONE', ...models]} setModel={setModel2} />,
  ])

  return (
    <Layout.Content className='layout-content' style={{flexDirection: 'column'}}>
      <Header title='Strategy Comparison' subtitle='Table from each Strategy for comparison' extra={extra}/>
      <Wrapper1>
        <Wrapper2 style={{borderStyle:'solid', borderWidth:'2px', borderColor: showingTable ? 'blue' : 'white', borderRadius: '10px'}}>
          <Spin tip='Loading' size='large' spinning={loading} >
            { showingTable && <StatsTable table={showingTable}/> }
          </Spin>
        </Wrapper2>
        <Wrapper2>
          <Spin tip='Loading' size='large' spinning={loading} >
            { showingTable1 && showingTable && <ComparisonStatsTable defaultTable={showingTable} table={showingTable1}/> }
          </Spin>
        </Wrapper2>
        <Wrapper2>
          <Spin tip='Loading' size='large' spinning={loading} >
            { showingTable2 && showingTable && <ComparisonStatsTable defaultTable={showingTable} table={showingTable2}/> }
          </Spin>
        </Wrapper2>
      </Wrapper1>
    </Layout.Content>
  )
}