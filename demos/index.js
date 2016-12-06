anychart.onDocumentReady(function() {
  chart = anychart.column([1, 2, 3, 4, 5]);
  chart.bounds(0, 0, 800, 600);
  chart.container('container').draw();
});