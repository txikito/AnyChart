var model = {
  data: [
    {keys: [0, 1, 2], captions: ['Col 0', 'Col 2', 'Col 3'], data: []},
    {keys: ['x', 'expected', 'real'], captions: ['X', 'Expected', 'Real'], data: {}}
  ],
  mappings: [
    [
      {ctor: 'line', value: 1},
      {ctor: 'ohlc', open: 1, high: 2, low: 3, close: 4}
    ]
  ],
  chart: {
    type: 'line',
    seriesType: 'line',
    settings: {}
  }

};