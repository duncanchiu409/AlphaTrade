export enum LineChartID {
  CASH = "Cash",
  ALLOCATED = "Allocated",
  HEDGE = "Hedge",
  TOTAL = "Total",
}

export enum LineChartColor {
  GREY = "hsl(333, 70%, 50%)",
  PINK = "hsl(108, 70%, 50%)",
  YELLOW = "hsl(92, 70%, 50%)",
  ORANGE = "hsl(104, 70%, 50%)",
  BLUE = "hsl(185, 70%, 50%)"
}

export const LineChartConfig: Record<LineChartID, LineChartColor> = {
  [LineChartID.CASH]: LineChartColor.BLUE,
  [LineChartID.ALLOCATED]: LineChartColor.ORANGE,
  [LineChartID.HEDGE]: LineChartColor.YELLOW,
  [LineChartID.TOTAL]: LineChartColor.PINK
}

export const LineChartYAXIS: Record<string, string> = {
  'percentage': 'Total % PNL',
  'normal': 'Total'
}