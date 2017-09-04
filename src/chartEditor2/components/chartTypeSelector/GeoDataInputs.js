goog.provide('anychart.chartEditor2Module.GeoDataInputs');

goog.require('anychart.chartEditor2Module.EditorModel');
goog.require('anychart.chartEditor2Module.Component');


/**
 * @param {anychart.chartEditor2Module.EditorModel} model
 * @constructor
 * @extends {anychart.chartEditor2Module.Component}
 */
anychart.chartEditor2Module.GeoDataInputs = function(model) {
  anychart.chartEditor2Module.GeoDataInputs.base(this, 'constructor');

  /**
   * @type {anychart.chartEditor2Module.Editor}
   * @private
   */
  this.model_ = model;

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
  var dom = this.getDomHelper();
};



anychart.chartEditor2Module.GeoDataInputs.prototype.update = function() {
  if (this.hidden_) return;

  var chartType = this.model_.getValue([['chart'], 'type']);

  if (this.geoDataSelect_) {
    this.removeChild(this.geoDataSelect_, true);
    this.geoDataSelect_.dispose();
    this.geoDataSelect_ = null;
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

  } else {
    // hide or dispose everything
  }
};


anychart.chartEditor2Module.GeoDataInputs.prototype.createGeoDataOptions_ = function() {
  for (var a = this.geoDataSelect_.getItemCount(); a--;) {
    this.geoDataSelect_.removeItemAt(a);
  }

  var data = this.model_.getPreparedData();
  // dummy field value - will not be used
  var field = this.model_.getValue([['dataSettings'], 'field']);

  for (var i = 0; i < data.length; i++) {
    if (data[i]['type'] == anychart.chartEditor2Module.EditorModel.dataType.GEO)
      continue;

    var fields = data[i]['fields'];
    var caption = data[i]['title'];
    var setFullId = data[i]['setFullId'];
    var item = new anychart.chartEditor2Module.controls.MenuItemWithTwoValues(caption, field, setFullId);
    this.geoDataSelect_.addItem(item);
  }
};


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


anychart.chartEditor2Module.GeoDataInputs.prototype.createGeoDataOptions_ = function() {
  if (!this.geoDataSelect_ || !this.geoDataIndex.length) return;

  var options = [];
  for (var key in this.geoDataIndex) {
    options.push([this.geoDataIndex[key]['name'], this.geoDataIndex[key]['id']]);
  }
  this.geoDataSelect_.setOptions(options);
  var activeGeo = this.model_.getValue([['dataSettings'], 'activeGeo']);

  if (!activeGeo)
    this.geoDataSelect_.setSelectedIndex(0);
  else
    this.geoDataSelect_.setValue(activeGeo.substr(1));
};


anychart.chartEditor2Module.GeoDataInputs.prototype.onSelectGeoData_ = function(evt) {
  if (!this.geoDataIndex.length) return;

  var setId = evt.target.getValue();
  var activeGeo = this.model_.getValue([['dataSettings'], 'activeGeo']);
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
