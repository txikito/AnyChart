goog.provide('anychart.chartEditor2Module.DataModel');

goog.require('goog.events.EventTarget');
goog.require('goog.format.JsonPrettyPrinter');



/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
anychart.chartEditor2Module.DataModel = function() {
  goog.base(this);

  this.data_ = {};

  this.preparedData_ = [];

  /**
   * @type {?String}
   * @private
   */
  this.currentId_ = null;
};
goog.inherits(anychart.chartEditor2Module.DataModel, goog.events.EventTarget);


/**
 * @enum {string}
 */
anychart.chartEditor2Module.DataModel.dataType = {
  UPLOADED: 'u',
  PREDEFINED: 'p',
  GEO: 'g'
};


anychart.chartEditor2Module.DataModel.prototype.getFullId = function(setId, dataType) {
  return dataType + setId;
};


anychart.chartEditor2Module.DataModel.prototype.addData = function(setId, data, dataType) {
  var id = this.getFullId(setId, dataType);
  if (!this.data_[id]) {
    this.data_[id] = {'setId': setId, 'type': dataType, 'data': data};
  }
  this.preparedData_.length = 0;

  this.dispatchEvent({
    type: anychart.chartEditor2Module.events.EventType.DATA_UPDATE_MODEL,
    action: 'add'
  });
};


anychart.chartEditor2Module.DataModel.prototype.removeData = function(setId, dataType) {
  var id = this.getFullId(setId, dataType);
  delete this.data_[id];
  this.preparedData_.length = 0;

  this.dispatchEvent({
    type: anychart.chartEditor2Module.events.EventType.DATA_UPDATE_MODEL,
    action: 'remove',
    setFullId: id,
    isActiveRemoved: this.currentId_ == id
  });
};


/**
 * @param opt_setFullId {String=}
 */
anychart.chartEditor2Module.DataModel.prototype.currentId = function(opt_setFullId) {
  if (goog.isDef(opt_setFullId)) {
    this.currentId_ = opt_setFullId;

    this.dispatchEvent({
      type: anychart.chartEditor2Module.events.EventType.DATA_UPDATE_USING_STATE,
      setFullId: this.currentId_
    });
  }

  return this.currentId_;
};


anychart.chartEditor2Module.DataModel.prototype.getDataKeys = function() {
  return goog.object.getKeys(this.data_);
};


anychart.chartEditor2Module.DataModel.prototype.getPreparedData = function() {
  return this.isDirty() ? this.prepareData_() : this.preparedData_;
};


anychart.chartEditor2Module.DataModel.prototype.isDirty = function() {
  return !this.preparedData_.length;
};


anychart.chartEditor2Module.DataModel.prototype.prepareData_ = function() {
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
      } else if (dataSet.type == anychart.chartEditor2Module.DataModel.dataType.GEO) {
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


anychart.chartEditor2Module.DataModel.prototype.prepareDataSet_ = function(dataSet) {
  var result = {type: dataSet['type'], setId: dataSet['setId']};

  var row = dataSet['type'] == anychart.chartEditor2Module.DataModel.dataType.GEO ?
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
