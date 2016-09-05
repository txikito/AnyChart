anychart.onDocumentReady(function() {
  anychart.licenseKey('test-key-32db1f79-cc9312c4');

  stage = anychart.graphics.create('container');
  stage.credits(false);

  chart = anychart.map();
  // chart.crs(anychart.enums.MapProjections.HAMMER);
  chart.crs(anychart.enums.MapProjections.AUGUST);
  chart.geoData('anychart.maps.world_source');

  // chart.scale().gap(456.2);
  chart.scale()
      .minimumX(-13)
      .maximumX(45)
      .minimumY(33)
      .maximumY(75);

  chart.scale().xTicks().count(90);
  chart.scale().yTicks().count(90);

  var data = [
    {name: 'Albania', id: 'AL'},
    {name: 'Andorra', id: 'AD'},
    {name: 'Austria', id: 'AT'},
    {name: 'Belarus', id: 'BY'},
    {name: 'Belgium', id: 'BE'},
    {name: 'Bosnia and Herzegovina', id: 'BA'},
    {name: 'Bulgaria', id: 'BG'},
    {name: 'Croatia', id: 'HR'},
    {name: 'Cyprus', id: 'CY'},
    {name: 'Czech Republic', id: 'CZ'},
    {name: 'Denmark', id: 'DK'},
    {name: 'Estonia', id: 'EE'},
    {name: 'Faroe Islands', id: 'FO'},
    {name: 'Finland', id: 'FI'},
    {name: 'France', id: 'FR'},
    {name: 'Germany', id: 'DE'},
    {name: 'Gibraltar', id: 'GI'},
    {name: 'Greece', id: 'GR'},
    {name: 'Hungary', id: 'HU'},
    {name: 'Iceland', id: 'IS'},
    {name: 'Ireland', id: 'IE'},
    {name: 'Italy', id: 'IT'},
    {name: 'Latvia', id: 'LV'},
    {name: 'Liechtenstein', id: 'LI'},
    {name: 'Lithuania', id: 'LT'},
    {name: 'Luxembourg', id: 'LU'},
    {name: 'Macedonia', id: 'MK'},
    {name: 'Malta', id: 'MT'},
    {name: 'Moldova', id: 'MD'},
    {name: 'Monaco', id: 'MC'},
    {name: 'Netherlands', id: 'NL'},
    {name: 'Norway', id: 'NO'},
    {name: 'Poland', id: 'PL'},
    {name: 'Portugal', id: 'PT'},
    {name: 'Romania', id: 'RO'},
    {name: 'Russia', id: 'RU'},
    {name: 'San Marino', id: 'SM'},
    {name: 'Serbia', id: 'RS'},
    {name: 'Slovakia', id: 'SK'},
    {name: 'Slovenia', id: 'SI'},
    {name: 'Spain', id: 'ES'},
    {name: 'Sweden', id: 'SE'},
    {name: 'Switzerland', id: 'CH'},
    {name: 'Ukraine', id: 'UA'},
    {name: 'United Kingdom', id: 'GB'},
    {name: 'Vatican city', id: 'VA'},
    {name: 'Yugoslavia', id: 'RS'},
    {name: 'Isle of Man', id: 'IM'},
    {name: 'Kosovo', id: 'RS'},
    {name: 'Montenegro', id: 'ME'}
  ];

  var series = chart.choropleth(data);

  // var callout = chart.callout();
  // callout.items(['FR']);
  // callout.padding(10);
  // callout.background().fill('blue .3');

  // chart.padding(50);

  var tickPosition = anychart.enums.SidePosition.OUTSIDE;
  var stroke = '#ccc';

  // var topAxis = chart.axes().top();
  // topAxis
  //     .stroke(stroke)
  //     .enabled(true);
  // topAxis.labels()
  //     .textFormatter(function() {
  //       return this.value;
  //     })
  //     .positionFormatter(function() {
  //       return this.value;
  //     });
  // //
  // topAxis.ticks()
  //     .length(5)
  //     .position(tickPosition);
  //
  //
  // var rightAxis = chart.axes().right();
  // rightAxis
  //     .stroke(stroke)
  //     .enabled(true);
  // rightAxis.labels()
  //     .textFormatter(function() {
  //       return this.value;
  //     })
  //     .positionFormatter(function() {
  //       return this.value;
  //     });
  //
  // rightAxis.ticks()
  //     .length(10)
  //     .position(tickPosition);
  //
  //
  // var bottomAxis = chart.axes().bottom();
  // bottomAxis
  //     .stroke(stroke)
  //     .enabled(true);
  // bottomAxis.labels()
  //     .textFormatter(function() {
  //       return this.value;
  //     })
  //     .positionFormatter(function() {
  //       return this.value;
  //     });
  // bottomAxis.ticks()
  //     .length(5)
  //     .position(tickPosition);
  //
  //
  // var leftAxis = chart.axes().left();
  // leftAxis
  //     .stroke(stroke)
  //     .enabled(true);
  // leftAxis.labels()
  //     .textFormatter(function() {
  //       return this.value;
  //     })
  //     .positionFormatter(function() {
  //       return this.value;
  //     });
  //
  // leftAxis.ticks()
  //     .length(10)
  //     .position(tickPosition);

  chart.container(stage).draw();

  var scale = chart.scale();

  // setInterval(function() {
  //   scale.minimumX(scale.minimumX() - 1).maximumX(scale.maximumX() + 1);
  // }, 100);


  // chart.marker([
  //   {lon: minLong, lat: minLat},
  //   {lon: minLong, lat: maxLat},
  //   {lon: maxLong, lat: maxLat},
  //   {lon: maxLong, lat: minLat},
  // ]);

  var path = stage.path();

  var drawAxes = function() {
    var minLong = scale.minimumX();
    var maxLong = scale.maximumX();
    var minLat = scale.minimumY();
    var maxLat = scale.maximumY();

    path.clear();
    var xy = scale.transform(minLong, minLat);

    path.moveTo(xy[0], xy[1]);
    var currLat = minLat;
    while (currLat < maxLat) {
      xy = scale.transform(minLong, currLat);
      path.lineTo(xy[0], xy[1]);
      currLat += 1;
    }
    xy = scale.transform(minLong, maxLat);
    path.lineTo(xy[0], xy[1]);

    // xy = scale.transform(minLong, maxLat);
    // path.moveTo(xy[0], xy[1]);
    currLong = minLong;
    while (currLong < maxLong) {
      xy = scale.transform(currLong, maxLat);
      path.lineTo(xy[0], xy[1]);
      currLong += 1;
    }
    xy = scale.transform(maxLong, maxLat);
    path.lineTo(xy[0], xy[1]);

    // xy = scale.transform(maxLong, maxLat);
    // path.moveTo(xy[0], xy[1]);
    currLat = maxLat;
    while (currLat > minLat) {
      xy = scale.transform(maxLong, currLat);
      path.lineTo(xy[0], xy[1]);
      currLat -= 1;
    }
    xy = scale.transform(maxLong, minLat);
    path.lineTo(xy[0], xy[1]);

    xy = scale.transform(maxLong, minLat);
    path.moveTo(xy[0], xy[1]);
    var currLong = maxLong;
    while (currLong > minLong) {
      xy = scale.transform(currLong, minLat);
      path.lineTo(xy[0], xy[1]);
      currLong -= 1;
    }
    xy = scale.transform(minLong, minLat);
    path.lineTo(xy[0], xy[1]);
    path.close();

    // var clipPath = acgraph.path();
    // clipPath.deserialize(path.serialize());

    // stage.clip(clipPath);
  };

  // chart.listen(anychart.enums.EventType.CHART_DRAW, drawAxes);

  // var h = 1;
  // var tt = function() {
  //   if (h < 180) {
  //     scale.minimumX(-h).maximumX(h);
  //     drawAxes();
  //     h += 3;
  //     setTimeout(tt, 20);
  //   }
  // };
  // tt();
});
