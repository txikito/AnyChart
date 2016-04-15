/**
 * @fileoverview anychart.modules.heatMap namespace file.
 * @suppress {extraRequire}
 */

goog.provide('anychart.modules.calendar');

goog.require('anychart.charts.Calendar');
goog.require('anychart.modules.base');


/**
 * Default heat map.<br/>
 * <b>Note:</b> Contains predefined settings for axes and grids.
 * @param {(anychart.data.View|anychart.data.Set|Array|string)=} opt_data Data for the chart.
 * @param {Object.<string, (string|boolean)>=} opt_csvSettings If CSV string is passed, you can pass CSV parser settings here as a hash map.
 * @return {anychart.charts.Calendar} Heat map chart with defaults.
 */
anychart.calendar = function(opt_data, opt_csvSettings) {
  var chart = new anychart.charts.Calendar(opt_data, opt_csvSettings);

  var theme = anychart.getFullTheme();
  chart.setup(theme['calendar']);

  return chart;
};
anychart.chartTypesMap[anychart.enums.ChartTypes.CALENDAR] = anychart.calendar;

//exports
goog.exportSymbol('anychart.calendar', anychart.calendar);
