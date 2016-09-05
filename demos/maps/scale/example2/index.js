var min = 1900;
var max = 2000;

var randomExt = function(a, b) {
  return Math.round(Math.random() * (b - a + 1) + a);
};

var generateData = function() {
  var auChoroplethData = [];
  features = chart.geoData()['features'];
  for (var i = 0, len = features.length; i < len; i++) {
    var feature = features[i];
    if (feature['properties']) {
      id = feature['properties'][chart.geoIdField()];
      auChoroplethData.push({'id': id, 'value': randomExt(min, max)});
    }
  }
  return auChoroplethData;
};

anychart.onDocumentReady(function() {
  anychart.licenseKey('test-key-32db1f79-cc9312c4');

  stage = anychart.graphics.create('container');
  stage.credits(false);

  chart = anychart.map();
  chart.crs(anychart.enums.MapProjections.BONNE);
  chart.geoData(anychart.maps.world_source);

  chart.scale().xTicks().count(10);
  chart.scale().yTicks().count(10);


  var tickPosition = anychart.enums.SidePosition.OUTSIDE;
  var stroke = '#000';
  var tickLength = 5;
  var padding = 2;

  var topAxis = chart.axes().top();
  topAxis
      .stroke(stroke)
      .enabled(true);
  topAxis.labels()
      .anchor('bottom')
      .padding(padding)
      .enabled(true)
      .textFormatter(function() {
        return this.value;
      })
      .positionFormatter(function() {
        return this.value;
      });

  topAxis.ticks()
      .length(tickLength)
      .position(tickPosition);


  var rightAxis = chart.axes().right();
  rightAxis
      .stroke(stroke)
      .enabled(true);
  rightAxis.labels()
      .padding(padding)
      .anchor('left')
      .enabled(true)
      .textFormatter(function() {
        return this.value;
      })
      .positionFormatter(function() {
        return this.value;
      });

  rightAxis.ticks()
      .length(tickLength)
      .position(tickPosition);


  var bottomAxis = chart.axes().bottom();
  bottomAxis
      .stroke(stroke)
      .enabled(true);
  bottomAxis.labels()
      .padding(padding)
      .anchor('top')
      .enabled(true)
      .textFormatter(function() {
        return this.value;
      })
      .positionFormatter(function() {
        return this.value;
      });
  bottomAxis.ticks()
      .length(tickLength)
      .position(tickPosition);


  var leftAxis = chart.axes().left();
  leftAxis
      .stroke(stroke)
      .enabled(true);
  leftAxis.labels()
      .padding(padding)
      .anchor('right')
      .enabled(true)
      .textFormatter(function() {
        return this.value;
      })
      .positionFormatter(function() {
        return this.value;
      });

  leftAxis.ticks()
      .length(tickLength)
      .position(tickPosition);

  // var series = chart.choropleth(generateData());
  //
  // var scale = anychart.scales.ordinalColor([
  //   {less: 1907},
  //   {from: 1907, to: 1920},
  //   {from: 1920, to: 1940},
  //   {from: 1940, to: 1950},
  //   {from: 1950, to: 1960},
  //   {from: 1960, to: 1970},
  //   {from: 1970, to: 1980},
  //   {greater: 1980}
  // ]);

  // scale.colors(['#42a5f5', '#64b5f6', '#90caf9', '#ffa726', '#fb8c00', '#f57c00', '#ef6c00', '#e65100']);
  // series.colorScale(scale);
  // series.labels(true);

  chart.container(stage).draw();
});
