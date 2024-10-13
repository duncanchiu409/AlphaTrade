// install (please try to align the version of installed @nivo packages)
// yarn add @nivo/line
import { ResponsiveLine } from '@nivo/line'

const data = [
  {
    "id": "japan",
    "color": "hsl(333, 70%, 50%)",
    "data": [
      {
        "x": "plane",
        "y": 129
      },
      {
        "x": "helicopter",
        "y": 61
      },
      {
        "x": "boat",
        "y": 191
      },
      {
        "x": "train",
        "y": 105
      },
      {
        "x": "subway",
        "y": 84
      },
      {
        "x": "bus",
        "y": 231
      },
      {
        "x": "car",
        "y": 79
      },
      {
        "x": "moto",
        "y": 161
      },
      {
        "x": "bicycle",
        "y": 4
      },
      {
        "x": "horse",
        "y": 4
      },
      {
        "x": "skateboard",
        "y": 158
      },
      {
        "x": "others",
        "y": 73
      }
    ]
  },
  {
    "id": "france",
    "color": "hsl(108, 70%, 50%)",
    "data": [
      {
        "x": "plane",
        "y": 90
      },
      {
        "x": "helicopter",
        "y": 1
      },
      {
        "x": "boat",
        "y": 44
      },
      {
        "x": "train",
        "y": 101
      },
      {
        "x": "subway",
        "y": 233
      },
      {
        "x": "bus",
        "y": 141
      },
      {
        "x": "car",
        "y": 98
      },
      {
        "x": "moto",
        "y": 155
      },
      {
        "x": "bicycle",
        "y": 131
      },
      {
        "x": "horse",
        "y": 95
      },
      {
        "x": "skateboard",
        "y": 143
      },
      {
        "x": "others",
        "y": 63
      }
    ]
  },
  {
    "id": "us",
    "color": "hsl(92, 70%, 50%)",
    "data": [
      {
        "x": "plane",
        "y": 63
      },
      {
        "x": "helicopter",
        "y": 21
      },
      {
        "x": "boat",
        "y": 174
      },
      {
        "x": "train",
        "y": 298
      },
      {
        "x": "subway",
        "y": 198
      },
      {
        "x": "bus",
        "y": 112
      },
      {
        "x": "car",
        "y": 279
      },
      {
        "x": "moto",
        "y": 253
      },
      {
        "x": "bicycle",
        "y": 279
      },
      {
        "x": "horse",
        "y": 5
      },
      {
        "x": "skateboard",
        "y": 277
      },
      {
        "x": "others",
        "y": 111
      }
    ]
  },
  {
    "id": "germany",
    "color": "hsl(104, 70%, 50%)",
    "data": [
      {
        "x": "plane",
        "y": 114
      },
      {
        "x": "helicopter",
        "y": 106
      },
      {
        "x": "boat",
        "y": 12
      },
      {
        "x": "train",
        "y": 75
      },
      {
        "x": "subway",
        "y": 67
      },
      {
        "x": "bus",
        "y": 39
      },
      {
        "x": "car",
        "y": 125
      },
      {
        "x": "moto",
        "y": 44
      },
      {
        "x": "bicycle",
        "y": 97
      },
      {
        "x": "horse",
        "y": 264
      },
      {
        "x": "skateboard",
        "y": 169
      },
      {
        "x": "others",
        "y": 27
      }
    ]
  },
  {
    "id": "norway",
    "color": "hsl(185, 70%, 50%)",
    "data": [
      {
        "x": "plane",
        "y": 129
      },
      {
        "x": "helicopter",
        "y": 268
      },
      {
        "x": "boat",
        "y": 173
      },
      {
        "x": "train",
        "y": 231
      },
      {
        "x": "subway",
        "y": 163
      },
      {
        "x": "bus",
        "y": 50
      },
      {
        "x": "car",
        "y": 117
      },
      {
        "x": "moto",
        "y": 129
      },
      {
        "x": "bicycle",
        "y": 259
      },
      {
        "x": "horse",
        "y": 255
      },
      {
        "x": "skateboard",
        "y": 99
      },
      {
        "x": "others",
        "y": 121
      }
    ]
  }
]

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
export function LineChart(): React.ReactElement {
  return(
  <ResponsiveLine
    data={data}
    margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
    xScale={{ type: 'point' }}
    yScale={{
      type: 'linear',
      min: 'auto',
      max: 'auto',
      stacked: true,
      reverse: false
    }}
    yFormat=" >-.2f"
    curve="cardinal"
    axisTop={null}
    axisRight={null}
    axisBottom={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: 'transportation',
      legendOffset: 36,
      legendPosition: 'middle',
      truncateTickAt: 0
    }}
    axisLeft={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: 'count',
      legendOffset: -40,
      legendPosition: 'middle',
      truncateTickAt: 0
    }}
    pointSize={10}
    pointColor={{ theme: 'background' }}
    pointBorderWidth={2}
    pointBorderColor={{ from: 'serieColor' }}
    pointLabel="data.yFormatted"
    pointLabelYOffset={-12}
    enableTouchCrosshair={true}
    useMesh={true}
    legends={[
      {
        anchor: 'bottom-right',
        direction: 'column',
        justify: false,
        translateX: 100,
        translateY: 0,
        itemsSpacing: 0,
        itemDirection: 'left-to-right',
        itemWidth: 80,
        itemHeight: 20,
        itemOpacity: 0.75,
        symbolSize: 12,
        symbolShape: 'circle',
        symbolBorderColor: 'rgba(0, 0, 0, .5)',
        effects: [
          {
            on: 'hover',
            style: {
              itemBackground: 'rgba(0, 0, 0, .03)',
              itemOpacity: 1
            }
          }
        ]
      }
    ]}
  />
)}