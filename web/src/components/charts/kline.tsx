import React, { useState, useEffect } from 'react'
import difference from 'lodash/difference'
import { TechnicalIndicator, MainIndicators, SubIndicators } from '../../config/indicators'
import { Chart, init, dispose, YAxisType, CandleStyle, CandleType, KLineData, registerIndicator } from 'klinecharts'
import { Div } from '../ui/animated'
import { TradesFormat } from '../../api/getFakeTradingRecords'
import '../../App.css'

const CHART_ID = 'kline-chart'

export interface KlineChartProps {
  klineData: KLineData[];
  trades: TradesFormat[];
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

export function KlineChart(props: KlineChartProps): React.ReactElement {
  const { klineData, trades, type, axis, mainIndicators, subIndicators } = props
  const [chart, setChart] = useState<Chart | null>(null)

  useEffect(() => {
    const chart = init(CHART_ID, options)
    chart?.setStyles('light')
    chart?.applyNewData(klineData)

    registerIndicator({
      name: 'EES',
      figures: [
        { key: 'location' }
      ],
      calc: (kLineDataList) => {
        const filteredTrades = trades.filter(trade => trade['Equity Name'] === 'AENT')
        const tradesEntryDates = filteredTrades.map(trade => trade['Entry Time'])
        const tradesExitDates = filteredTrades.map(trade => trade['Exit Time'])

        return kLineDataList.map(kLineData => {
          let text = tradesEntryDates.includes(new Date(kLineData['timestamp']).toDateString()) ? '🟩' : ' '
          text = tradesExitDates.includes(new Date(kLineData['timestamp']).toDateString()) ? '🟥' : text
          return { location: kLineData.close * 1.5, text: text }
        })
      },
      draw: ({
        ctx,
        barSpace,
        visibleRange,
        indicator,
        xAxis,
        yAxis
      }) => {
        const { from, to } = visibleRange

        ctx.font = barSpace.gapBar + 'px' + ' Helvetica Neue'
        ctx.textAlign = 'center'
        const result = indicator.result
        for (let i = from; i < to; i++) {
          const data = result[i]
          const x = xAxis.convertToPixel(i)
          const y = yAxis.convertToPixel(data.location)
          ctx.fillText(data.text, x, y)
        }
        return false
      }
    })

    setChart(chart)
    return () => {
      dispose(CHART_ID)
    }
  }, [klineData, trades])

  useEffect(() => {
    chart?.setStyles({
      candle: {
        type: type
      }
    })
  }, [chart, type])

  useEffect(() => {
    chart?.setStyles({
      yAxis: {
        type: axis
      }
    })
  }, [chart, axis])

  useEffect(() => {
    const id = 'candle_pane'
    const diffMain = difference(MainIndicators, mainIndicators)

    diffMain.forEach((value) => {
      chart?.removeIndicator(id, value.name)
    })

    mainIndicators.forEach((value) => {
      chart?.createIndicator(value.name, true, {id: id})
    })

    const diffSub = difference(SubIndicators, subIndicators)

    diffSub.forEach((value) => {
      chart?.removeIndicator(`Sub-CandlePane${value.name}`, value.name)
    })

    subIndicators.forEach((value) => {
      chart?.createIndicator(value.name, false, {id: `Sub-CandlePane${value.name}`})
    })
  }, [chart, mainIndicators, subIndicators])

  return (
    <>
      <Div id={CHART_ID} className='klinechart' />
    </>
  )
}