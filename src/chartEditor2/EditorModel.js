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

  this.data_ = {};

  this.preparedData_ = [];

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


anychart.chartEditor2Module.EditorModel.prototype.createInitialMappings = function(opt_active, opt_field) {
  var preparedData = this.getPreparedData();

  //todo: generate model.mapping based on model.datasets
  var active = opt_active;
  var field = opt_field;

  if (preparedData.length) {
    active = goog.isDefAndNotNull(active) ? active : preparedData[0]['setFullId'];
    field = goog.isDefAndNotNull(field) ? field : preparedData[0]['fields'][0]['key'];
  }

  var mapping = this.chooseDefaultMapping(active, field);

  return {
    active: active,
    field: field,
    mappings: [
      mapping
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


anychart.chartEditor2Module.EditorModel.prototype.setActiveField = function(input) {
  var key = input.getKey();
  var field = input.getValue();
  var active = input.getValue2();

  if (active != this.model_.datasetSettings.active) {
    this.model_.datasetSettings = this.createInitialMappings(active, field);
    // dropChartSettings('getSeriesAt');

    this.dispatchUpdate();
  }
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
  return type == 'ohlc' ?
      {ctor: type, mapping: {open: 1, high: 2, low: 3, close: 4}} :
      {ctor: type, mapping: {value: 1}};
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


anychart.chartEditor2Module.EditorModel.prototype.setChartType = function(input) {
  var type = input.getValue();
  var prevChartType = this.model_.chart.type;
  var prevDefaultSeriesType = this.model_.chart.seriesType;

  this.model_.chart.type = type;
  this.model_.chart.seriesType = this.chooseDefaultSeriesType();

  if (prevChartType == 'stock' || this.model_.chart.type == 'stock') {
    this.model_.datasetSettings.mappings = [this.chooseDefaultMapping()];
  }
  // this.updateSeriesConstructors();

  this.dispatchUpdate();
};


anychart.chartEditor2Module.EditorModel.prototype.setSeriesType = function(input) {
  var key = input.getKey();
  var type = input.getValue();
  var plotIndex = key[1][1]; // see SeriesPanel.getKey()
  var seriesIndex = key[2][0];
  if (this.model_.datasetSettings.mappings[plotIndex][seriesIndex].ctor != type) {
    this.model_.datasetSettings.mappings[plotIndex][seriesIndex] = this.generateMapping(type);
    this.dispatchUpdate();
  }
};


// anychart.chartEditor2Module.EditorModel.prototype.updateSeriesConstructors = function(defaultType, newType) {
//   for (var i = 0; i < this.model_.datasetSettings.mappings.length; i++) {
//     var plot = this.model_.datasetSettings.mappings.mappings[i];
//     for (var j = 0; j < plot.length; j+) {
//       var mapping = this.model_.datasetSettings.mappings.mappings[i][j];
//       if (mapping.ctor == defaultType)
//         this.model_.datasetSettings.mappings.mappings[i][j] = this.generateMapping(newType);
//     }
//   }
// };


anychart.chartEditor2Module.EditorModel.prototype.getInputs = function() {
  return this.inputs_;
};


/**
 * Setter for model's field state
 * @param {Array.<*>} key
 * @param {*} value
 * @param {boolean=} opt_noDispatch
 */
anychart.chartEditor2Module.EditorModel.prototype.setValue = function(key, value, opt_noDispatch) {
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
anychart.chartEditor2Module.EditorModel.prototype.getValue = function(key) {
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


anychart.chartEditor2Module.EditorModel.prototype.dispatchUpdate = function() {
  if (this.suspendQueue_ > 0) {
    this.needDispatch_ = true;
    return;
  }

  var isConsistent = this.checkConsistency_();

  //if (isConsistent) {
  console.log(this.model_);
  //}

  this.dispatchEvent({
    type: anychart.chartEditor2Module.events.EventType.EDITOR_MODEL_UPDATE,
    isDataConsistent: isConsistent
  });

  this.needDispatch_ = false;
};


anychart.chartEditor2Module.EditorModel.prototype.suspendDispatch = function() {
  this.suspendQueue_++;
};

anychart.chartEditor2Module.EditorModel.prototype.resumeDispatch = function() {
  this.suspendQueue_--;

  if (this.needDispatch_)
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


///////////////////////////////////////////////////////////////////
/**
 * @enum {string}
 */
anychart.chartEditor2Module.EditorModel.dataType = {
  UPLOADED: 'u',
  PREDEFINED: 'p',
  GEO: 'g'
};


anychart.chartEditor2Module.EditorModel.prototype.getFullId = function(dataType, setId) {
  return dataType + setId;
};


anychart.chartEditor2Module.EditorModel.prototype.addData = function(dataType, setId, data) {
  var id = this.getFullId(dataType, setId);
  if (!this.data_[id]) {
    this.data_[id] = {'type': dataType, 'setId': setId, 'setFullId': id, 'data': data};
  }
  this.preparedData_.length = 0;

  this.dispatchUpdate();
};


anychart.chartEditor2Module.EditorModel.prototype.removeData = function(setFullId) {
  delete this.data_[setFullId];
  this.preparedData_.length = 0;

  if (setFullId == this.model_.datasetSettings.active) {
    this.model_.datasetSettings = this.createInitialMappings();
  }

  this.dispatchUpdate();
};


anychart.chartEditor2Module.EditorModel.prototype.getDataKeys = function() {
  return goog.object.getKeys(this.data_);
};


/**
 * @return {!Array.<*>}
 */
anychart.chartEditor2Module.EditorModel.prototype.getPreparedData = function() {
  return this.isDirty() ? this.prepareData_() : this.preparedData_;
};


/**
 * @return {?String}
 */
anychart.chartEditor2Module.EditorModel.prototype.getActive = function() {
  return this.model_.datasetSettings.active;
};


anychart.chartEditor2Module.EditorModel.prototype.getRawData = function() {
  var dataSet = this.data_[this.getActive()];
  return dataSet ? dataSet['data'] : null;
};


anychart.chartEditor2Module.EditorModel.prototype.isDirty = function() {
  return !this.preparedData_.length;
};


anychart.chartEditor2Module.EditorModel.prototype.prepareData_ = function() {
  var joinedSets = [];
  var singleSets = [];
  var geoSets = [];
  var dataSet;

  for (var i in this.data_) {
    if (this.data_.hasOwnProperty(i)) {
      dataSet = this.prepareDataSet_(this.data_[i]);

      var joined = false;
      if (dataSet['join']) {
        /*
         * todo: process join
         */
        joined = true;
      }

      if (joined) {
        dataSet['name'] = 'Joined set ' + (joinedSets.length + 1);
        joinedSets.push(dataSet);
      } else if (dataSet.type == anychart.chartEditor2Module.EditorModel.dataType.GEO) {
        dataSet['name'] = 'Geo data ' + (geoSets.length + 1);
        geoSets.push(dataSet);
      } else {
        dataSet['name'] = 'Data set ' + (singleSets.length + 1);
        singleSets.push(dataSet);
      }
    }
  }

  this.preparedData_ = goog.array.concat(joinedSets, singleSets, geoSets);

  return this.preparedData_;
};


anychart.chartEditor2Module.EditorModel.prototype.prepareDataSet_ = function(dataSet) {
  var result = {type: dataSet['type'], setId: dataSet['setId'], setFullId: dataSet['setFullId']};

  var row = dataSet['type'] == anychart.chartEditor2Module.EditorModel.dataType.GEO ?
      dataSet['data']['features'][0]['properties'] :
      dataSet['data'][0];

  var settings = new goog.format.JsonPrettyPrinter.SafeHtmlDelimiters();
  settings.lineBreak = '';
  settings.objectStart = '\n{';
  settings.arrayStart = '\n[';
  settings.space = '';
  settings.propertySeparator = ', ';
  settings.nameValueSeparator = ': ';

  var f = new goog.format.JsonPrettyPrinter(settings);
  result['sample'] = f.format(row);

  var fields = [];
  var i;
  var field;

  for (i in row) {
    field = {
      'name': goog.isArray(row) ? 'Field ' + i : i,
      'type': typeof(row[i]),
      'key': i
    };
    fields.push(field);
  }
  result['fields'] = fields;

  return result;
};
