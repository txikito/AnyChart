anychart.onDocumentReady(function() {
  chart = anychart.column([1, 2, 3, 4, 5]);
  chart.title('canvg is a SVG parser and renderer. It takes a URL to a SVG file or the text of an SVG file, parses it in JavaScript, and renders the result on a Canvas element. The rendering speed of the examples is about as fast as native SVG.')
  chart.bounds(0, 0, 800, 600);
  chart.container('container').draw();
});