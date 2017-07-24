goog.provide('anychart.chartEditor2Module.EditorModel');

goog.require('goog.events.EventTarget');


/**
 *
 * @constructor
 * @extends {goog.events.EventTarget}
 */
anychart.chartEditor2Module.EditorModel = function() {
  goog.base(this);

  this.inputs_ = {
    'chart': [],
    'plot': []
  };
};
goog.inherits(anychart.chartEditor2Module.EditorModel, goog.events.EventTarget);


/**
 * @typedef {{category: String, name: String, group: number=}}
 */
anychart.chartEditor2Module.EditorModel.Key;


anychart.chartEditor2Module.EditorModel.chartTypes = {
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


anychart.chartEditor2Module.EditorModel.series = {
  'line': {
    'fields': [{field: 'value', name: 'Y Value'}]
  },
  'spline': {
    'fields': [{field: 'value', name: 'Y Value'}]
  },
  'column': {
    'fields': [{field: 'value', name: 'Y Value'}]
  },
  'area': {
    'fields': [{field: 'value', name: 'Y Value'}]
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
 * @param {Array.<*>} key
 * @param {*} value
 */
anychart.chartEditor2Module.EditorModel.prototype.setInputValue = function(key, value) {
  var target = this.inputs_;
  for (var i = 0; i < key.length; i++) {
    if (goog.isArray(key[i])) {
      if (!goog.isDef(target[key[i][0]]))
        target[key[i][0]] = [];

      if (target[key[i][0]].length == key[i][1])
        target[key[i][0]].push({});

      target = target[key[i][0]][key[i][1]];
    } else if (goog.isString(key[i])) {
      target[String(key[i])] = value;
    }
  }
  this.dispatchUpdate();
};


/**
 * @param {Array} key
 */
anychart.chartEditor2Module.EditorModel.prototype.removeByKey = function(key) {
  var target = this.inputs_;
  var level;
  for (var i = 0; i < key.length; i++) {
    level = key[i];
    if (i == key.length - 1) {
      // remove
      if (goog.isArray(level))
        goog.array.splice(target[level[0]], level[1], 1);
      else if (goog.isString(level))
        delete target[level];

    } else {
      // drill down
      if (goog.isArray(level))
        target = target[level[0]][level[1]];
      else if (goog.isString(level))
        target = target[level];

      if (!target)
        break;
    }
  }
  this.dispatchUpdate();
};


/**
 * Getter for input's value
 * @param {anychart.chartEditor2Module.EditorModel.Key} key
 * @return {*} Input's value
 */
anychart.chartEditor2Module.EditorModel.prototype.getInputValue = function(key) {
  // var group = goog.isDef(key['group']) ? key['group'] : 0;
  // return this.inputs_[key['category']] && this.inputs_[key['category']][group] && goog.isDef(this.inputs_[key['category']][group][key['name']]) ?
  //     this.inputs_[key['category']][group][key['name']] :
  //     void 0;
};


anychart.chartEditor2Module.EditorModel.prototype.dispatchUpdate = function() {
  console.log(this.inputs_);
  this.dispatchEvent({
    type: anychart.chartEditor2Module.events.EventType.EDITOR_MODEL_UPDATE
  });
};