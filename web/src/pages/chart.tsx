import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { KlineChart, KlineChartProps } from '../components/charts/kline'
import { KLineData, CandleType, YAxisType } from 'klinecharts'
import { useIndicatorsStore } from '../store/useIndicatorsStore'
import { Layout, Row, Col, Flex, Button, Modal, Typography, Checkbox, Spin } from 'antd'
import { TradesTable } from '../components/tables/trades'
import { TechnicalIndicator, MainIndicators, SubIndicators } from '../config/indicators'
import { EquitiesTable } from '../components/tables/equities'
import { AiFillSliders, AiOutlineAreaChart, AiOutlinePercentage, AiOutlineFieldNumber, AiTwotoneSetting } from "react-icons/ai";
import { Header } from '../components/ui/header'
import { useKLineStore } from '../store/useKLineStore'
import { useTradeRecordsStore, TradesInterface } from '../store/useTradeRecordsStore'
import { DropDown } from '../components/ui/dropDown'

interface IndicatorsListProps {
  title: string;
  all: TechnicalIndicator[];
  indicators: TechnicalIndicator[];
  onUpdate: (update: TechnicalIndicator[]) => void
}

interface IndicatorLabelProps {
  indicator: TechnicalIndicator;
}

function IndicatorsList(props: IndicatorsListProps): React.ReactElement {
  const { title, all, indicators, onUpdate } = props

  function IndicatorLabel(props: IndicatorLabelProps): React.ReactElement {
    const { indicator } = props
    let checked = indicators.includes(indicator)

    function onClick() {
      if (!indicators.includes(indicator)) {
        let updated_indicators = [...indicators, indicator]
        onUpdate(updated_indicators)
      }
      else {
        let updated_indicators = indicators.filter(i => i.name !== indicator.name)
        onUpdate(updated_indicators)
      }
    }

    return (
      <div onClick={onClick} style={{}}>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '0.75em' }}>
          <Checkbox checked={checked} style={{ margin: '0px' }} />
          <h5 style={{ margin: '0px', alignSelf: 'center' }} >{indicator.name}</h5>
        </div>
        <span style={{ margin: '0px' }}>{indicator.description}</span>
      </div>
    )
  }

  let content: React.ReactNode | React.ReactNode[] = React.Children.toArray([
    all.map((indicator: TechnicalIndicator) => (
      <IndicatorLabel indicator={indicator} />
    ))
  ])

  if (!all.length) {
    content = (
      <div>
        <h5 style={{margin: '0px', alignSelf: 'center'}}>Not found</h5>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, marginLeft: '1em' }}>
      <h3 style={{ margin: '0', }}>{title}</h3>
      {content}
    </div>
  )
}

const Wrapper1 = styled.div`
height: 100%;
flex: 5;
`

const Wrapper2 = styled.div`
flex: 1;
display: flex;
flex-direction: column;
`

interface ChartProps {
  model: string;
  setModel: (name: string) => void;
}

export default function Chart(props :ChartProps): React.ReactElement {
  const [ equityName, setEquityName ] = useState<string>('')
  const { model, setModel } = props
  const [ showingKLine, setShowingKLine ] = useState<KLineData[]>([])
  const { type, axis, primary, secondary, setPrimary, setSecondary, setType, setAxis } = useIndicatorsStore()
  const [ showModal, setShowModal ] = useState<boolean>(false)
  const { klineData, resetKlineData, getKlineData } = useKLineStore()
  const { trades, loading, resetTradeRecords, getTradeRecords } = useTradeRecordsStore()
  const [ showingTrades, setShowingTrades ] = useState<TradesInterface[]>([])

  useEffect(() => {
    resetKlineData()
    resetTradeRecords()
  }, [])

  useEffect(() => {
    setShowingKLine(getKlineData(model, equityName))
    setShowingTrades(getTradeRecords(model))
  }, [trades, klineData, model])

  useEffect(() => {
    setShowingKLine(getKlineData(model, equityName))
  }, [equityName, model])

  const models = Array.from(trades.keys())

  const typeIcon: Record<string, React.ReactNode> = {
    [CandleType.CandleSolid]: (
      <AiOutlineAreaChart
        size={25}
        onClick={() => setType(CandleType.Area)}
      />
    ),
    [CandleType.Area]: (
      <AiFillSliders
        size={25}
        onClick={() => setType(CandleType.CandleSolid)}
      />
    ),
  };

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
    ),
  };

  const openModal = () => {
    setShowModal(true);
  };

  const handleOk = () => {
    setShowModal(false);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const extra: React.ReactNode[] = React.Children.toArray([
    <DropDown model={model} models={models} setModel={setModel}/>,
    <Button variant='link' icon={typeIcon[type]} />,
    <Button variant='link' icon={axisIcon[axis]} />,
    <Button variant='link' onClick={openModal} icon={<AiTwotoneSetting size={25} />} />,
  ])

  return (
    <Layout.Content className='layout-content'>
      <Wrapper1>
        <Header title='Charts' subtitle='Chart for Backtest' extra={extra} />
        <KlineChart klineData={showingKLine} trades={showingTrades} type={type} axis={axis} mainIndicators={primary} subIndicators={secondary} />
      </Wrapper1>
      <Wrapper2>
        <Header title='Equity Name' subtitle='Equities traded in this Backtest' />
        <Spin tip='Loading' spinning={loading}>
          <EquitiesTable trades={showingTrades} setEquity={setEquityName}/>
        </Spin>
      </Wrapper2>
      <Modal open={showModal} onOk={handleOk} onCancel={handleCancel}>
        <Header title='Indicators' subtitle='Select Indicators' />
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <IndicatorsList title='Primary Indicators' all={MainIndicators} indicators={primary} onUpdate={setPrimary} />
          <IndicatorsList title='Secondary Indicators' all={SubIndicators} indicators={secondary} onUpdate={setSecondary} />
        </div>
      </Modal>
    </Layout.Content>
  )
}