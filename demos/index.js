anychart.onDocumentReady(function() {
  stage = anychart.graphics.create('container', 600, 500);
  anychart.licenseKey('test-key-32db1f79-cc9312c4');


  dataSet = anychart.data.set([
    {id: 'AU.CT', value: 15, title: 'Australian Capital Territory'},
    {id: 'AU.VI', value: 23, title: 'Victoria'},
    {id: 'AU.WA', value: 86, title: 'Western Australia'},
    {id: 'AU.QL', value: 16, title: 'Queensland'},
    {id: 'AU.NS', value: 32, title: 'New South Wales'},
    {id: 'AU.NT', value: 64, title: 'Northern Territory'},
    {id: 'AU.TS', value: 28, title: 'Tasmania'}
  ]);
  dataSetForSeries = dataSet.mapAs({id: 'id'});

  chart = anychart.map();
  chart
      .geoData('anychart.maps.australia')
      .unboundRegions(false);
  var series1 = chart.choropleth(dataSetForSeries);
  series1.geoIdField('code_hasc');
  chart.bounds(0, 0, '50%', '50%');
  chart.container(stage).draw();



});
