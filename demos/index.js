anychart.onDocumentReady(function () {
  // Defines settings for maps regions (regions bounds are not relevant for this data, so let's make it less contrast)
  var customTheme = {
    "map": {
      'unboundRegions': {'enabled': true, 'fill': '#E1E1E1', 'stroke': '#D2D2D2'}
    }
  };
  anychart.theme(customTheme);

  // Creates map chart
  map = anychart.connector();

  // Sets settings for map chart
  map.padding(0);
  map.scale().gap(0.2);
  map.geoData(anychart.maps.united_states_of_america);
  map.interactivity().selectionMode("none");

  // Sets title for map chart and customizes it
  map.title().enabled(true).padding([20, 0, 20, 0]).useHtml(true).text('The 25 Most Poppular Destinations<br/>' +
      'for New Yorkers during Summer 2015<br/>' +
      '<span style="color:#212121; font-size: 13px;">According to http://www.businessinsider.com/</span>');


  // Sets credits data
  map.credits(true);
  map.credits().url('//www.businessinsider.com/top-summer-destinations-from-new-york-city-2015-5?op=1');
  map.credits().text('Data source: http://www.businessinsider.com/');
  map.credits().logoSrc('//static3.businessinsider.com/assets/images/us/favicons/favicon.ico');

  // Creates connector series for destinations and customizes them
  var connectorSeries = map.connector(destinationsData)
      .startSize(0)
      .endSize(0)
      .hoverStroke('1.5 #455a64')
      .stroke('1.5 #1976d2')
      .markers({position: '100%', size: 5, fill: '#1976d2', stroke: '2 #E1E1E1', type: 'circle'})
      .hoverMarkers({position: '100%',  size: 4,  fill: '#455a64', stroke: '2 #455a64', type: 'circle'})
      .curvature(0);

  // Customizes labels for the destination series
  connectorSeries.labels()
      .enabled(false)
      .fontSize(12)
      .offsetY(0)
      .offsetX(0)
      .position('100%')
      .textFormatter(function () {
        return this.getDataValue('to')
      });
  // Customizes labels on hover for the destination series
  connectorSeries.hoverLabels().fontColor('#455a64').fontWeight('bold');

  // Sets tooltip setting for the destination series
  connectorSeries.tooltip({padding: [8, 13, 10, 13]});
  connectorSeries.tooltip().titleFormatter(function(){return this.getDataValue('number')});
  connectorSeries.tooltip().useHtml(true).fontSize(13).textFormatter(function() {
    return '<span style="font-size: 12px; color: #E1E1E1">' + this.getDataValue('to') + '</span>';
  });

  // Sets container id for the chart
  map.container('container');

  // Initiates chart drawing
  map.draw();
});

// Sets data for the destination (connector) series
var destinationsData = [
  {points: [40.71262,-74.006124,38.716183,-75.075441], number: 25, to: "Rehoboth Beach, DE", marker: {fill: "#9fa8da"}},
  {points: [40.71262,-74.006124,39.941479,-74.07011], number: 24, to: "Seaside Heights, NJ", marker: {fill: "#93abe0"}},
  {points: [40.71262,-74.006124,40.089822,-74.037677], number: 23, to: "Point Pleasant Beach, NJ", marker: {fill: "#86ade6"}},
  {points: [40.71262,-74.006124,42.364363,-73.594993], number: 22, to: "Chatham, NY", marker: {fill: "#7ab0ec"}},
  {points: [40.71262,-74.006124,41.456637,-70.555377], number: 21, to: "Oak Bluffs, MA", marker: {fill: "#6eb3f1"}},
  {points: [40.71262,-74.006124,39.27582,-74.574824], number: 20, to: "Ocean City, NJ", marker: {fill: "#61b2f5"}},
  {points: [40.71262,-74.006124,40.971872,-72.122145], number: 19, to: "Amagansett, NY", marker: {fill: "#51a5ed"}},
  {points: [40.71262,-74.006124,39.563483,-74.23509], number: 18, to: "Beach Haven, NJ", marker: {fill: "#4298e6"}},
  {points: [40.71262,-74.006124,36.17002,-115.140154], number: 17, to: "Las Vegas, NV", marker: {fill: "#328bde"}, label: {enabled: true}},
  {points: [40.71262,-74.006124,38.931883,-74.906278], number: 16, to: "Cape May, NJ", marker: {fill: "#227ed7"}},
  {points: [40.71262,-74.006124,26.105904,-80.10741], number: 15, to: "Fort Lauderdale, FL", marker: {fill: "#1b74cf"}, label: {enabled: true}},
  {points: [40.71262,-74.006124,36.83094,-75.97903], number: 14, to: "Virginia Beach, VA", marker: {fill: "#216ec8"}},
  {points: [40.71262,-74.006124,43.560453,-73.641411], number: 13, to: "Lake George, NY", marker: {fill: "#2769c2"}, label: {enabled: true}},
  {points: [40.71262,-74.006124,40.653823,-73.107648], number: 12, to: "Fire Island, NY", marker: {fill: "#2d64bb"}},
  {points: [40.71262,-74.006124,41.25058,-70.004391], number: 11, to: "Nantucket, MA", marker: {fill: "#335eb4"}},
  {points: [40.71262,-74.006124,35.556088,-75.467633], number: 10, to: "Outer Banks, NC", marker: {fill: "#3a57ab"}, label: {enabled: true, anchor: 'topLeft'}},
  {points: [40.71262,-74.006124,38.980089,-74.820254], number: 9, to: "Wildwood, NJ", marker: {fill: "#4250a2"}},
  {points: [40.71262,-74.006124,33.698234,-78.875056], number: 8, to: "Myrtle Beach, SC", marker: {fill: "#4a4998"}, label: {enabled: true}},
  {points: [40.71262,-74.006124,39.641815,-74.187045], number: 7, to: "Long Beach Island, NJ", marker: {fill: "#52418f"}},
  {points: [40.71262,-74.006124,42.006971,-74.386233], number: 6, to: "Catskills, NY", marker: {fill: "#5a3985"}, label: {enabled: true}},
  {points: [40.71262,-74.006124,41.664336,-70.463233], number: 5, to: "Cape Cod, MA", marker: {fill: "#63317a"}, label: {enabled: true, anchor: 'bottomLeft'}},
  {points: [40.71262,-74.006124,38.39482,-75.061095], number: 4, to: "Ocean City, MD", marker: {fill: "#6d2870"}, label: {enabled: true, anchor: 'left', offsetX: 5}},
  {points: [40.71262,-74.006124,41.040324,-71.923127], number: 3, to: "Montauk, NY", marker: {fill: "#762065"}},
  {points: [40.71262,-74.006124,41.2478,-75.248327], number: 2, to: "The Poconos, PA", marker: {fill: "#7f175a"}, label: {enabled: true}},
  {points: [40.71262,-74.006124,40.922888,-72.3563], number: 1, to: "The Hamptons, NY", marker: {fill: "#880e4f"}, label: {enabled: true, anchor: 'left', offsetX: 10}}
];