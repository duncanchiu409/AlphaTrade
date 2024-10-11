import React, { useState, useEffect } from 'react'
import difference from 'lodash/difference'
import { TechnicalIndicator, MainIndicators, SubIndicators } from '../config/indicators'
import { Chart, init, dispose, YAxisType, CandleStyle, CandleType, KLineData } from 'klinecharts'
import { Div } from '../ui/animated'
import useFakeData from '../utils/usefakeData'
import './kline.css'

const CHART_ID = 'kline-chart'

interface KlineChartProps {
  type: CandleType;
  axis: YAxisType;
  mainIndicators: TechnicalIndicator[];
  subIndicators: TechnicalIndicator[];
}

const options = {
  styles: {
    candle: {
      type: CandleType.CandleSolid
    },
    yAxis: {
      type: YAxisType.Normal
    }
  }
};

export function KlineChart(): React.ReactElement {
  // const { type, axis, mainIndicators, subIndicators } = props
  const [chart, setChart] = useState<Chart | null>(null)
  const fakeData = useFakeData()

  useEffect(() => {
    const tmp_chart = init(CHART_ID, options)

    tmp_chart?.applyNewData(fakeData)

    setChart(tmp_chart)
    return () => {
      dispose(CHART_ID)
    }
  }, [])

  // useEffect(() => {
  //   chart?.setStyles({
  //     candle: {
  //       type: type
  //     }
  //   })
  // }, [chart, type])

  // useEffect(() => {
  //   chart?.setStyles({
  //     yAxis: {
  //       type: axis
  //     }
  //   })
  // }, [chart, axis])

  // useEffect(() => {
  //   const id = 'candle_pane'
  //   const diffMain = difference(MainIndicators, mainIndicators)


  //   diffMain.forEach((value) => {
  //     chart?.removeIndicator(id)
  //   })

  //   mainIndicators.forEach((value) => {
  //     chart?.createIndicator(value.name, true, {id: id})
  //   })

  //   const diffSub = difference(SubIndicators, subIndicators)

  //   diffSub.forEach((value) => {
  //     chart?.removeIndicator(id)
  //   })

  //   subIndicators.forEach((value) => {
  //     chart?.createIndicator(value.name)
  //   })
  // }, [chart, mainIndicators, subIndicators])

  return (
    <>
      <Div id={CHART_ID} className='klinechart' />
    </>
  )
}