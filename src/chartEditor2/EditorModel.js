goog.provide('anychart.chartEditor2Module.EditorModel');

goog.require('goog.events.EventTarget');


/**
 *
 * @constructor
 * @extends {goog.events.EventTarget}
 */
anychart.chartEditor2Module.EditorModel = function() {
  goog.base(this);

  this.inputs_ = {};

  this.model_ = {
    generateInitialMappingsOnChangeView: true,
    defaultSeriesType: null,
    // datasets: [
    //   {keys: [0, 1, 2], caption: ['Col 1', 'Col 2', 'Col 3'], types: ['string', 'number', 'number'], data: []},
    //   {
    //     keys: ['x', 'actual', 'expected'],
    //     caption: ['x', 'actual', 'expected'],
    //     types: ['string', 'number', 'number'],
    //     data: []
    //   }
    // ],
    datasetSettings: {
      active: null,
      field: null,
      mappings: [
        // [ // plot
        //   {ctl: 'line', mapping: {value: 1}},
        //   {ctl: 'column', mapping: {value: 2}}
        // ]
      ]
    },
    chart: {
      type: null,
      seriesType: null,
      settings: {
        //'getSeriesAt(0).name()': 'my series'
      }
    }
  };

  this.suspendQueue_ = 0;
};
goog.inherits(anychart.chartEditor2Module.EditorModel, goog.events.EventTarget);


/**
 * @typedef {Array.<(Array|String)>}
 */
anychart.chartEditor2Module.EditorModel.Key;


anychart.chartEditor2Module.EditorModel.chartTypes = {
  'line': {
    'value': 'line',
    'name': 'Line Chart',
    'icon': 'line-chart-1.svg', // 'http://www.anychart.com/_design/img/upload/charts/types/'
    'series': ['line', 'spline', 'column', 'area', 'ohlc'], // first value is default
    'dataSetCtor': 'set'
  },
  'column': {
    'value': 'column',
    'name': 'Column Chart',
    'icon': 'column-chart.svg',
    'series': ['column', 'line', 'spline', 'area', 'ohlc'],
    'dataSetCtor': 'set'
  },
  'area': {
    'value': 'area',
    'name': 'Area Chart',
    'icon': 'area-chart.svg',
    'series': ['area', 'line', 'spline', 'column', 'ohlc'],
    'dataSetCtor': 'set'
  },
  'stock': {
    'value': 'stock',
    'name': 'Stock Chart',
    'icon': 'stock-chart.svg',
    'series': ['ohlc', 'line', 'spline', 'column', 'area'],
    'dataSetCtor': 'table'
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


anychart.chartEditor2Module.EditorModel.consistencyObject = {
  'chart': {
    'ctor': ''
  },
  'plot': [{
    'mapping': {'x': ''},

    'series': [{
      'ctor': '',
      'mapping': {}
    }]
  }]
};


anychart.chartEditor2Module.EditorModel.prototype.createInitialMappings = function() {
  //todo: generate model.mapping based on model.datasets
  return {
    active: 0,
    field: 0,
    mappings: [
        this.chooseDefaultMapping()
    ]
  };
};

anychart.chartEditor2Module.EditorModel.prototype.chooseDefaultMapping = function() {
  //todo: придумываем тип серии на основе данных
  return [{ctor: 'line', mapping: {value: 1}}];
};


anychart.chartEditor2Module.EditorModel.prototype.chooseDefaultChartType = function() {
  //todo: придумываем тип серии на основе данных
  return 'line';
};


anychart.chartEditor2Module.EditorModel.prototype.chooseDefaultSeriesType = function() {
  //todo: придумываем тип серии на основе данных
  return 'line';
};


anychart.chartEditor2Module.EditorModel.prototype.addPlot = function() {
  var mapping = [{ctor: 'line', mapping: {value: 1}}];
  this.model_.datasetSettings.mappings.push(mapping);
  this.dispatchUpdate();
};

anychart.chartEditor2Module.EditorModel.prototype.dropPlot = function(index) {
  if (index > 0 && this.model_.datasetSettings.mappings.length > index) {
    goog.array.splice(this.model_.datasetSettings.mappings, index, 1);
    this.dispatchUpdate();
  }
};


anychart.chartEditor2Module.EditorModel.prototype.addSeries = function(plotIndex) {
  var mapping = this.generateMapping(this.model_.chart.seriesType);
  this.model_.datasetSettings.mappings[plotIndex].push(mapping);
  this.dispatchUpdate();
};


anychart.chartEditor2Module.EditorModel.prototype.dropSeries = function(plotIndex, seriesIndex) {
  if (this.model_.datasetSettings.mappings.length > plotIndex && this.model_.datasetSettings.mappings[plotIndex].length > seriesIndex) {
    goog.array.splice(this.model_.datasetSettings.mappings[plotIndex], seriesIndex, 1);
    this.dispatchUpdate();
  }
};


anychart.chartEditor2Module.EditorModel.prototype.generateMapping = function(type) {
  // todo: generate based on data
  return {ctor: 'line', mapping: {value: 1}};
};


anychart.chartEditor2Module.EditorModel.prototype.onChangeView = function() {
  if (this.model_.generateInitialMappingsOnChangeView) {
    this.model_.generateInitialMappingsOnChangeView = false;
    this.model_.chart.type = this.chooseDefaultChartType();
    this.model_.chart.seriesType = this.chooseDefaultSeriesType();
    this.model_.datasetSettings = this.createInitialMappings();
  }
};


anychart.chartEditor2Module.EditorModel.prototype.onChangeDatasetsComposition = function() {
  this.model_.mapping = [];
  this.model_.chart.settings = {};
  this.model_.generateInitialMappingsOnChangeView = true;
};


anychart.chartEditor2Module.EditorModel.prototype.setChartType = function(type) {
  var prevChartType = this.model_.chart.type;
  var prevDefaultSeriesType = this.model_.chart.seriesType;

  this.model_.chart.type = type;
  this.model_.chart.seriesType = this.chooseDefaultSeriesType();

  if (prevChartType == 'stock' || this.model_.chart.type == 'stock') {
    this.model_.datasetSettings.mappings = [this.chooseDefaultMapping()];
  }
  this.dispatchUpdate();
};


anychart.chartEditor2Module.EditorModel.prototype.getInputs = function() {
  return this.inputs_;
};


/**
 * Setter for model's field state
 * @param {Array.<*>} key
 * @param {*} value
 * @param {boolean=} opt_noDispatch
 */
anychart.chartEditor2Module.EditorModel.prototype.setModelValue = function(key, value, opt_noDispatch) {
  var target = this.model_;
  for (var i = 0; i < key.length; i++) {
    var level = key[i];
    if (goog.isArray(level)) {
      if (!goog.isDef(target[level[0]])) {
        if (level.length > 1)
          target[level[0]] = [];
        else
          target[level[0]] = {};
      }

      if (goog.isArray(target[level[0]]) && target[level[0]].length == level[1])
        target[level[0]].push({});

      target = goog.isArray(target[level[0]]) ? target[level[0]][level[1]] : target[level[0]];
    } else if (goog.isString(level) && target[String(level)] != value) {
      target[String(level)] = value;

      if (!opt_noDispatch)
        this.dispatchUpdate();
    }
  }
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
      if (goog.isArray(level)) {
        goog.array.splice(target[level[0]], level[1], 1);
      }
      else if (goog.isString(level)) {
        delete target[level];
      }


    } else {
      // drill down
      if (goog.isArray(level))
        target = goog.isArray(target[level[0]]) ? target[level[0]][level[1]] : target[level[0]];
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
anychart.chartEditor2Module.EditorModel.prototype.getModelValue = function(key) {
  var target = this.model_;
  var level;

  for (var i = 0; i < key.length; i++) {
    level = key[i];
    if (i == key.length - 1) {
      // result
      if (goog.isArray(level))
        return target[level[0]][level[1]];
      else if (goog.isString(level))
        return target[level];

    } else {
      // drill down
      if (goog.isArray(level))
        target = goog.isArray(target[level[0]]) ? target[level[0]][level[1]] : target[level[0]];
      else if (goog.isString(level))
        target = target[level];

      if (!target)
        return void 0;
    }
  }
};


anychart.chartEditor2Module.EditorModel.prototype.dispatchUpdate = function() {
  if (this.suspendQueue_ > 0) return;

  var isConsistent = this.checkConsistency_();

  //if (isConsistent) {
  console.log(this.model_);
  //}

  this.dispatchEvent({
    type: anychart.chartEditor2Module.events.EventType.EDITOR_MODEL_UPDATE,
    isDataConsistent: isConsistent
  });
};


/**
 * Checks if available data is enough to build chart
 * @return {boolean} true if available data is enough
 */
anychart.chartEditor2Module.EditorModel.prototype.checkConsistency_ = function() {
  // console.log(this.inputs_);

  // Check by consistencyObject
  if (!this.checkConsistencyByObject_(this.inputs_, anychart.chartEditor2Module.EditorModel.consistencyObject))
    return false;

  // Check series fields
  for (var i = this.inputs_['plot'].length; i--;) {
    for (var j = this.inputs_['plot'][i]['series'].length; j--;) {
      var series = this.inputs_['plot'][i]['series'][j];
      var mapping = series['mapping'];
      var fields = /** @type {Array.<String>} */(goog.object.getKeys(mapping));
      var seriesFields = goog.array.map(anychart.chartEditor2Module.EditorModel.series[series['ctor']]['fields'],
          function(item) {
            return item['field']
          });

      if (goog.array.compare3(fields, seriesFields) != 0)
        return false;
    }
  }

  return true;
};


anychart.chartEditor2Module.EditorModel.prototype.checkConsistencyByObject_ = function(opt_target, opt_object) {
  if (goog.typeOf(opt_target) != goog.typeOf(opt_object))
    return false;

  if (goog.isObject(opt_object)) {
    for (var i in opt_object) {
      if (opt_object.hasOwnProperty(i)) {
        if (!opt_target.hasOwnProperty(i) || !this.checkConsistencyByObject_(opt_target[i], opt_object[i]))
          return false;
      }
    }
  }

  return true;
};


anychart.chartEditor2Module.EditorModel.prototype.suspendDispatch = function() {
  this.suspendQueue_++;
};

anychart.chartEditor2Module.EditorModel.prototype.resumeDispatch = function() {
  this.suspendQueue_--;
  this.dispatchUpdate();
};


/**
 * Converts string to valid model key.
 * @param {anychart.chartEditor2Module.EditorModel.Key} key
 * @return {String} key as a string
 */
anychart.chartEditor2Module.EditorModel.getStringKey = function(key) {
  var stringKey = '';

  for (var i = 0; i < key.length; i++) {
    var level = key[i];
    if (i == 0 && goog.isArray(level) && (level[0] == 'anychart' || level[0] == 'chart')) continue;

    if (goog.isArray(level))
      stringKey += level[0] + '(' + level[1] + ')';
    else if (goog.isString(level))
      stringKey += level;

    if (i < key.length - 1)
      stringKey += '.';
  }

  return stringKey;
};