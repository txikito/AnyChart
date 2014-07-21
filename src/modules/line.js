goog.provide('anychart.modules.line');

goog.require('anychart');
goog.require('anychart.cartesian.Chart');
goog.require('anychart.cartesian.series.Line');
goog.require('anychart.cartesian.series.Spline');
goog.require('anychart.cartesian.series.StepLine');


/**
 * Default line chart.
 * xAxis, yAxis, grids.
 * @param {...(anychart.data.View|anychart.data.Set|Array)} var_args Line chart data.
 * @return {anychart.cartesian.Chart} Chart with defaults for line series.
 */
anychart.lineChart = function(var_args) {
  var chart = new anychart.cartesian.Chart();

  for (var i = 0, count = arguments.length; i < count; i++) {
    chart.line(arguments[i]);
  }

  chart.title().text('Chart Title');

  chart.xAxis();
  chart.yAxis();

  chart.grid()
      .direction(anychart.utils.Direction.HORIZONTAL);

  chart.minorGrid()
      .evenFill('none')
      .oddFill('none')
      .stroke('black 0.1')
      .direction(anychart.utils.Direction.HORIZONTAL);

  chart.grid()
      .evenFill('none')
      .oddFill('none')
      .direction(anychart.utils.Direction.VERTICAL);

  return chart;
};

//exports
goog.exportSymbol('anychart.lineChart', anychart.lineChart);
