import { useState } from 'react'
import { CandleType, YAxisType } from 'klinecharts'
import { TechnicalIndicator } from '../config/indicators'

interface IndicatorsStore {
  type: CandleType;
  axis: YAxisType;
  primary: TechnicalIndicator[];
  secondary: TechnicalIndicator[];
  setPrimary(indicators: TechnicalIndicator[]): void;
  setSecondary(indicators: TechnicalIndicator[]): void;
  setType(type: CandleType): void;
  setAxis(type: YAxisType): void;
};

export const useIndicatorsStore = (): IndicatorsStore => {
  const [mainIndicators, setMainIndicators] = useState<TechnicalIndicator[]>([])
  const [subIndicators, setSubIndicators] = useState<TechnicalIndicator[]>([])
  const [type, setType] = useState<CandleType>(CandleType.CandleSolid)
  const [axis, setAxis] = useState<YAxisType>(YAxisType.Normal)

  return {
    type: type,
    axis: axis,
    primary: mainIndicators,
    secondary: subIndicators,
    setPrimary: setMainIndicators,
    setSecondary: setSubIndicators,
    setType: setType,
    setAxis: setAxis,
  }
}