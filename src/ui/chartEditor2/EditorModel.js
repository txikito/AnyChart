goog.provide('anychart.ui.chartEditor2.EditorModel');

goog.require('goog.events.EventTarget');


/**
 *
 * @constructor
 * @extends {goog.events.EventTarget}
 */
anychart.ui.chartEditor2.EditorModel = function() {
  goog.base(this);

  this.inputs_ = {
    /**
     * Format:
      // category = 'chart'
      'chart': [
        // group = 0
        {
          // name = 'type', value = 'line'
          'type': 'line'
        }
      ],
      // category = 'series'
      'series': [
        // group = 0
        {
          // name = 'type', value = 'ohlc'
          'type': 'ohlc',

          // name = 'open', value = 'field0'
          'open': 'field0',

          // so on...
          'high': 'field1',
          'low': 'field2',
          'close': 'field3'
        }
      ],
     ...
     */
    'chart': [],
    'plot': [],
    'series': []
  };
};
goog.inherits(anychart.ui.chartEditor2.EditorModel, goog.events.EventTarget);


/**
 * @typedef {{category: String, name: String, group: number=}}
 */
anychart.ui.chartEditor2.EditorModel.Key;


anychart.ui.chartEditor2.EditorModel.chartTypes = {
  'line': {
    'value': 'line',
    'name': 'Line Chart',
    'icon': 'line-chart-1.svg', // 'http://www.anychart.com/_design/img/upload/charts/types/'
    'series': ['line', 'spline', 'column', 'area', 'ohlc'] // first value is default
  },
  'column': {
    'value': 'column',
    'name': 'Column Chart',
    'icon': 'column-chart.svg',
    'series': ['column', 'line', 'spline', 'area', 'ohlc']
  },
  'area': {
    'value': 'area',
    'name': 'Area Chart',
    'icon': 'area-chart.svg',
    'series': ['area', 'line', 'spline', 'column', 'ohlc']
  },
  'stock': {
    'value': 'stock',
    'name': 'Stock Chart',
    'icon': 'stock-chart.svg',
    'series': ['ohlc', 'line', 'spline', 'column', 'area']
  }
};


anychart.ui.chartEditor2.EditorModel.series = {
  'line': {
    'fields': [{name: 'Y Value', field: 'y'}]
  },
  'spline': {
    'fields': [{name: 'Y Value', field: 'y'}]
  },
  'column': {
    'fields': [{name: 'Y Value', field: 'y'}]
  },
  'area': {
    'fields': [{name: 'Y Value', field: 'y'}]
  },
  'ohlc': {
    'fields': [
      {field: 'open'},
      {field: 'high'},
      {field: 'low'},
      {field: 'close'}]
  }
};


/**
 * Setter for input's state
 * @param {anychart.ui.chartEditor2.EditorModel.Key} key
 * @param {*} value
 */
anychart.ui.chartEditor2.EditorModel.prototype.setInputValue = function(key, value) {
  var group = goog.isDef(key['group']) ? key['group'] : 0;
  if (this.inputs_[key['category']].length >= group) {
    if (this.inputs_[key['category']].length == group) {
      this.inputs_[key['category']].push({});
    }
    this.inputs_[key['category']][group][key['name']] = value;
  } else {
    console.warn('Bad group! EditorModel.setInput(\'', key, value, '\'');
  }
};


/**
 * Getter for input's value
 * @param {anychart.ui.chartEditor2.EditorModel.Key} key
 * @return {*} Input's value
 */
anychart.ui.chartEditor2.EditorModel.prototype.getInputValue = function(key) {
  var group = goog.isDef(key['group']) ? key['group'] : 0;
  return this.inputs_[key['category']] && this.inputs_[key['category']][group] && goog.isDef(this.inputs_[key['category']][group][key['name']]) ?
      this.inputs_[key['category']][group][key['name']] :
      void 0;
};


/**
 * @param {String} category
 * @param {number} group
 */
anychart.ui.chartEditor2.EditorModel.prototype.removeInputsGroup = function(category, group) {
  goog.array.splice(this.inputs_[category], group, 1);
};
