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
      .minimumY(30)
      .maximumY(75);

  chart.padding(50);

  chart.axes().bottom().enabled(true);

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

    // xy = scale.transform(maxLong, minLat);
    // path.moveTo(xy[0], xy[1]);
    var currLong = maxLong;
    while (currLong > minLong) {
      xy = scale.transform(currLong, minLat);
      path.lineTo(xy[0], xy[1]);
      currLong -= 1;
    }
    xy = scale.transform(minLong, minLat);
    path.lineTo(xy[0], xy[1]);
    path.close();

    var clipPath = acgraph.path();
    clipPath.deserialize(path.serialize());

    stage.clip(clipPath);
  };

  chart.listen(anychart.enums.EventType.CHART_DRAW, drawAxes);

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
