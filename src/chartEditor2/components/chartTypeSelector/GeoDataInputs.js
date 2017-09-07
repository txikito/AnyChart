goog.provide('anychart.chartEditor2Module.GeoDataInputs');

goog.require('anychart.chartEditor2Module.Component');
goog.require('anychart.chartEditor2Module.EditorModel');
goog.require('anychart.chartEditor2Module.controls.SelectWithLabel');



/**
 * Inputs specific for map charts.
 *
 * @param {anychart.chartEditor2Module.EditorModel} model
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper; see {@link goog.ui.Component} for semantics.
 * @constructor
 * @extends {anychart.chartEditor2Module.Component}
 */
anychart.chartEditor2Module.GeoDataInputs = function(model, opt_domHelper) {
  anychart.chartEditor2Module.GeoDataInputs.base(this, 'constructor', opt_domHelper);

  this.setModel(model);

  /**
   * @type {Array}
   * @protected
   */
  this.geoDataIndex = [];
};
goog.inherits(anychart.chartEditor2Module.GeoDataInputs, anychart.chartEditor2Module.Component);


/** @inheritDoc */
anychart.chartEditor2Module.GeoDataInputs.prototype.createDom = function() {
  anychart.chartEditor2Module.GeoDataInputs.base(this, 'createDom');
  goog.dom.classlist.add(this.getElement(), 'geo-data-inputs');
};


/** @inheritDoc */
anychart.chartEditor2Module.GeoDataInputs.prototype.update = function() {
  if (this.isHidden()) return;

  var chartType = /** @type {anychart.chartEditor2Module.EditorModel} */(this.getModel()).getValue([['chart'], 'type']);

  if (this.geoDataSelect_) {
    this.removeChild(this.geoDataSelect_, true);
    this.geoDataSelect_.dispose();
    this.geoDataSelect_ = null;
  }

  if (this.geoIdFieldSelect_) {
    this.removeChild(this.geoIdFieldSelect_, true);
    this.geoIdFieldSelect_.dispose();
    this.geoIdFieldSelect_ = null;
  }

  if (chartType == 'map') {
    // Geo data select
    this.geoDataSelect_ = new anychart.chartEditor2Module.controls.SelectWithLabel('activeGeo', 'Geo data');
    this.addChild(this.geoDataSelect_, true);
    this.getHandler().listen(this.geoDataSelect_, goog.ui.Component.EventType.CHANGE, this.onSelectGeoData_);

    if (this.geoDataIndex.length)
      this.createGeoDataOptions_();
    else
      this.loadGeoDataIndex_();

    this.geoIdFieldSelect_ = new anychart.chartEditor2Module.controls.SelectWithLabel('id', 'Geo Id Field');
    this.geoIdFieldSelect_.setEditorModel(/** @type {anychart.chartEditor2Module.EditorModel} */(this.getModel()), [['dataSettings'], 'geoIdField']);
    this.addChild(this.geoIdFieldSelect_, true);

    if (this.createGeoIdFieldOptions_())
      this.geoIdFieldSelect_.setValueByModel();
  }
};


/** @private */
anychart.chartEditor2Module.GeoDataInputs.prototype.loadGeoDataIndex_ = function() {
  this.dispatchEvent({
    type: anychart.chartEditor2Module.events.EventType.WAIT,
    wait: true
  });

  var self = this;
  goog.net.XhrIo.send('https://cdn.anychart.com/anydata/geo/index.json',
      function(e) {
        var xhr = e.target;
        var indexJson = xhr.getResponseJson();
        if (indexJson['sets']) {
          for (var i in indexJson['sets']) {
            self.geoDataIndex[indexJson['sets'][i]['id']] = indexJson['sets'][i];
          }
        }
        self.createGeoDataOptions_();
      });
};


/**
 * Creates options for geo data sets select.
 * @private
 */
anychart.chartEditor2Module.GeoDataInputs.prototype.createGeoDataOptions_ = function() {
  if (!this.geoDataSelect_ || !this.geoDataIndex.length) return;

  var options = [];
  for (var key = 0; key < this.geoDataIndex.length; key++) {
    options.push([this.geoDataIndex[key]['name'], this.geoDataIndex[key]['id']]);
  }
  this.geoDataSelect_.setOptions(options);
  var activeGeo = /** @type {anychart.chartEditor2Module.EditorModel} */(this.getModel()).getValue([['dataSettings'], 'activeGeo']);

  if (!activeGeo)
    this.geoDataSelect_.setSelectedIndex(0);
  else
    this.geoDataSelect_.setValue(activeGeo.substr(1));
};


/**
 * Loads geo data.
 *
 * @param {Object} evt
 * @private
 */
anychart.chartEditor2Module.GeoDataInputs.prototype.onSelectGeoData_ = function(evt) {
  if (!this.geoDataIndex.length) return;

  var setId = /** @type {number} */(/** @type {anychart.chartEditor2Module.controls.SelectWithLabel} */(evt.target).getValue());
  var activeGeo = /** @type {anychart.chartEditor2Module.EditorModel} */(this.getModel()).getValue([['dataSettings'], 'activeGeo']);
  if (activeGeo && (anychart.chartEditor2Module.EditorModel.dataType.GEO + setId) == activeGeo) return;

  this.dispatchEvent({
    type: anychart.chartEditor2Module.events.EventType.WAIT,
    wait: true
  });

  var setUrl = 'https://cdn.anychart.com/geodata/1.2.0' + this.geoDataIndex[setId]['data'];
  var self = this;
  goog.net.XhrIo.send(setUrl,
      function(e) {
        if (e.target.getStatus() == 200) {
          var json = e.target.getResponseJson();
          var dataType = anychart.chartEditor2Module.EditorModel.dataType.GEO;
          self.dispatchEvent({
            type: anychart.chartEditor2Module.events.EventType.DATA_ADD,
            data: json,
            dataType: dataType,
            setId: setId,
            setFullId: dataType + setId,
            title: self.geoDataIndex[setId]['name']
          });
        }

        self.dispatchEvent({
          type: anychart.chartEditor2Module.events.EventType.WAIT,
          wait: false
        });
      });
};


/**
 * Creates options for geo id field select.
 *
 * @return {boolean}
 * @private
 */
anychart.chartEditor2Module.GeoDataInputs.prototype.createGeoIdFieldOptions_ = function() {
  var activeGeo = /** @type {anychart.chartEditor2Module.EditorModel} */(this.getModel()).getActiveGeo();
  if (!activeGeo) return false;

  var preparedData = /** @type {anychart.chartEditor2Module.EditorModel} */(this.getModel()).getPreparedData(activeGeo);
  if (!preparedData.length) return false;

  var options = [];
  for (var key in preparedData[0].fields) {
    options.push(preparedData[0].fields[key].name);
  }
  this.geoIdFieldSelect_.setOptions(options);

  return true;
};
