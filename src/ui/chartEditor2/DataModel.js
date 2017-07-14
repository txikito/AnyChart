goog.provide('anychart.ui.chartEditor2.DataModel');

goog.require('goog.format.JsonPrettyPrinter');
goog.require('goog.events.EventTarget');


/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
anychart.ui.chartEditor2.DataModel = function() {
  anychart.ui.chartEditor2.DataModel.base(this, 'constructor');
  this.data_ = {};

  this.preparedData_ = [];
};
goog.inherits(anychart.ui.chartEditor2.DataModel, goog.events.EventTarget);

/**
 * @enum {string}
 */
anychart.ui.chartEditor2.DataModel.dataType = {
  UPLOADED: 'u',
  PREDEFINED: 'p',
  GEO: 'g'
};


anychart.ui.chartEditor2.DataModel.prototype.dataId_ = function(setId, dataType) {
  return dataType + setId;
};


anychart.ui.chartEditor2.DataModel.prototype.addData = function(setId, data, dataType) {
  var id = this.dataId_(setId, dataType);
  if (!this.data_[id]) {
    this.data_[id] = {setId: setId, type: dataType, data: data};
  }
  this.preparedData_.length = 0;
  this.dispatchEvent({
    type: anychart.ui.chartEditor2.events.EventType.DATA_MODEL_CHANGED
  });
};


anychart.ui.chartEditor2.DataModel.prototype.removeData = function(setId, dataType) {
  var id = this.dataId_(setId, dataType);
  delete this.data_[id];
  this.preparedData_.length = 0;
  this.dispatchEvent({
    type: anychart.ui.chartEditor2.events.EventType.DATA_MODEL_CHANGED
  });
};


anychart.ui.chartEditor2.DataModel.prototype.getDataKeys = function() {
  return goog.object.getKeys(this.data_);
};


anychart.ui.chartEditor2.DataModel.prototype.getPreparedData = function() {
  return this.isDirty() ? this.prepareData_() : this.preparedData_;
};


anychart.ui.chartEditor2.DataModel.prototype.isDirty = function() {
  return !this.preparedData_.length;
};


anychart.ui.chartEditor2.DataModel.prototype.prepareData_ = function() {
  var joinedSets = [];
  var singleSets = [];
  var geoSets = [];
  var dataSet;

  for (var i in this.data_) {
    if(this.data_.hasOwnProperty(i)) {
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
      } else if (dataSet.type == anychart.ui.chartEditor2.DataModel.dataType.GEO) {
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


anychart.ui.chartEditor2.DataModel.prototype.prepareDataSet_ = function(dataSet) {
  var result = {type: dataSet['type'], setId: dataSet['setId']/*, data: dataSet['data']*/};

  var row = dataSet['type'] == anychart.ui.chartEditor2.DataModel.dataType.GEO ?
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
      'type': typeof(row[i])
    };
    fields.push(field);
  }
  result['fields'] = fields;

  return result;
};
