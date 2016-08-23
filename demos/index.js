anychart.onDocumentReady(function() {
  anychart.licenseKey('test-key-32db1f79-cc9312c4');

  stage = anychart.graphics.create('container');
  stage.credits(false);

  chart = anychart.map();
  chart.crs(anychart.enums.MapProjections.BONNE);
  chart.geoData('anychart.maps.australia');

  chart.scale().gap(.3);

  chart.container(stage).draw();


  var scale = chart.scale();

  var minLong = scale.dataRangeMinLong;
  var maxLong = scale.dataRangeMaxLong;
  var minLat = scale.dataRangeMinLat;
  var maxLat = scale.dataRangeMaxLat;

  console.log(minLong, maxLong, minLat, maxLat);

  chart.marker([
    {lon: minLong, lat: minLat},
    {lon: minLong, lat: maxLat},
    {lon: maxLong, lat: maxLat},
    {lon: maxLong, lat: minLat},
    // {lon: 146.6894, lat: -42.1634}
  ]);

  // var path = stage.path();
  // path
  //     .moveTo(scale.transform(minLong, minLat)[0], scale.transform(minLong, minLat)[1])
  //     .lineTo(scale.transform(minLong, maxLat)[0], scale.transform(minLong, maxLat)[1])
  //     .lineTo(scale.transform(maxLong, maxLat)[0], scale.transform(maxLong, maxLat)[1])
  //     .lineTo(scale.transform(maxLong, minLat)[0], scale.transform(maxLong, minLat)[1])
  //     .close();

  var path = stage.path();
  chart.listen(anychart.enums.EventType.CHART_DRAW, function() {
    path.clear();
    var xy = scale.transform(minLong, minLat);

    path.moveTo(xy[0], xy[1]);
    var currLat = minLat;
    while (currLat < maxLat) {
      currLat += 1;
      xy = scale.transform(minLong, currLat);
      path.lineTo(xy[0], xy[1]);
    }

    xy = scale.transform(maxLong, minLat);

    path.moveTo(xy[0], xy[1]);
    currLat = minLat;
    while (currLat < maxLat) {
      currLat += 1;
      xy = scale.transform(maxLong, currLat);
      path.lineTo(xy[0], xy[1]);
    }

    xy = scale.transform(minLong, minLat);
    path.moveTo(xy[0], xy[1]);
    var currLong = minLong;
    while (currLong < maxLong) {
      currLong += 1;
      xy = scale.transform(currLong, minLat);
      path.lineTo(xy[0], xy[1]);
    }

    xy = scale.transform(minLong, maxLat);
    path.moveTo(xy[0], xy[1]);
    currLong = minLong;
    while (currLong < maxLong) {
      currLong += 1;
      xy = scale.transform(currLong, maxLat);
      path.lineTo(xy[0], xy[1]);
    }
  });
});
