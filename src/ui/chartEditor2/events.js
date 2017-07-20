goog.provide('anychart.ui.chartEditor2.events');
goog.require('goog.events');


/** @enum {string} */
anychart.ui.chartEditor2.events.EventType = {
  // working with data model
  DATA_UPDATE_MODEL: goog.events.getUniqueId('data-update-model'),
  DATA_ADD: goog.events.getUniqueId('data-add'),
  DATA_REMOVE: goog.events.getUniqueId('data-remove'),
  DATA_USE: goog.events.getUniqueId('data-use'),
  // DATA_RELEASE: goog.events.getUniqueId('data-release'),
  DATA_UPDATE_USING_STATE: goog.events.getUniqueId('data-update-using-state'),

  // widgets events
  FILTER_UPDATE: goog.events.getUniqueId('filter-update'),
  PANEL_CLOSE: goog.events.getUniqueId('panel-close')

  // CLOSE: goog.events.getUniqueId('close'),
  // ADD_SERIES: goog.events.getUniqueId('add-series'),
  // REMOVE_SERIES: goog.events.getUniqueId('remove-series'),
  // REMOVE_ALL_SERIES: goog.events.getUniqueId('remove-all-series'),
  // SET_PRESET_TYPE: goog.events.getUniqueId('set-preset-type'),
  // SET_SERIES_MAPPING: goog.events.getUniqueId('set-series-mapping'),
  // SET_CHART_DATA: goog.events.getUniqueId('set-chart-data'),
  // CHANGE_MODEL: goog.events.getUniqueId('change-model'),
  // BUILD_CHART: goog.events.getUniqueId('build-chart'),
  // UPDATE_EDITOR: goog.events.getUniqueId('update')
};
