goog.provide('anychart.chartEditor2Module.Chart');

goog.require('anychart.bindingModule.entry');
goog.require('anychart.chartEditor2Module.Component');
goog.require('anychart.chartEditor2Module.EditorModel');


/**
 * Chart widget.
 *
 * @param {anychart.chartEditor2Module.EditorModel} model
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper; see {@link goog.ui.Component} for semantics.
 * @constructor
 * @extends {anychart.chartEditor2Module.Component}
 */
anychart.chartEditor2Module.Chart = function(model, opt_domHelper) {
  anychart.chartEditor2Module.Chart.base(this, 'constructor', opt_domHelper);

  this.setModel(model);

  this.anychart = /** @type {Object} */(goog.dom.getWindow()['anychart']);

  /**
   * @type {string}
   * @private
   */
  this.containerId_ = 'chart-container-' + goog.string.createUniqueString();
};
goog.inherits(anychart.chartEditor2Module.Chart, anychart.chartEditor2Module.Component);


/** @inheritDoc */
anychart.chartEditor2Module.Chart.prototype.createDom = function() {
  anychart.chartEditor2Module.Chart.base(this, 'createDom');


  goog.dom.classlist.add(this.getElement(), 'chart-container');
  // var dom = this.getDomHelper();

  this.getDomHelper().setProperties(this.getElement(), {'id': this.containerId_});
};


/** @inheritDoc */
anychart.chartEditor2Module.Chart.prototype.enterDocument = function() {
  anychart.chartEditor2Module.Chart.base(this, 'enterDocument');
  this.update();
  this.getHandler().listen(/** @type {anychart.chartEditor2Module.EditorModel} */(this.getModel()),
      anychart.chartEditor2Module.events.EventType.EDITOR_MODEL_UPDATE, this.update);
};


/** @inheritDoc */
anychart.chartEditor2Module.Chart.prototype.update = function() {
  var self = this;
  var model = /** @type {anychart.chartEditor2Module.EditorModel} */(this.getModel());
  var rawData = model.getRawData();
  var settings = model.getModel();
  var rebuild = !arguments.length || arguments[0].rebuild;

  if (!settings['chart']['type'])
    return;

  // Global settings
  goog.object.forEach(settings['anychart'], function(value, key) {
    anychart.bindingModule.exec(self.anychart, key, value);
  });

  // Chart creation
  if (rebuild && this.chart_ && typeof this.chart_['dispose'] == 'function') {
    this.chart_['dispose']();
    this.chart_ = null;
  }

  if (rebuild) {
    // console.log("BUILD CHART");
    this.chart_ = this.anychart[settings['chart']['type']]();

    if (settings['chart']['type'] == 'map') {
      var geoData = model.getRawData(true);
      if (geoData) {
        this.chart_['geoData'](geoData);
        var geoIdField = model.getGeoIdField();
        if (geoIdField)
          this.chart_['geoIdField'](geoIdField);
      }
    }

    // Create data set
    var dsCtor = anychart.chartEditor2Module.EditorModel.chartTypes[settings['chart']['type']]['dataSetCtor'];
    var dataSet = this.anychart['data'][dsCtor]();

    if (dsCtor == 'table')
      dataSet['addData'](rawData);
    else
      dataSet['data'](rawData);

    // create mapping and series
    for (var i = 0; i < settings['dataSettings']['mappings'].length; i++) {
      var plotMapping = settings['dataSettings']['mappings'][i];
      for (var j = 0; j < plotMapping.length; j++) {
        var seriesMapping = plotMapping[j]['mapping'];
        var mappingObj = {'x': settings['dataSettings']['field']};
        for (var k in seriesMapping) {
          if (seriesMapping.hasOwnProperty(k))
            mappingObj[k] = seriesMapping[k];
        }

        var mappingInstance = dataSet['mapAs'](mappingObj);

        if (settings['chart']['type'] == 'pie') {
          this.chart_['data'](mappingInstance);

        } else {
          var seriesCtor = plotMapping[j]['ctor'];
          var series;
          if (settings['chart']['type'] == 'stock') {
            var plot = this.chart_['plot'](i);
            series = plot[seriesCtor](mappingInstance);
          } else {
            if (settings['chart']['type'] == 'map') {
              seriesCtor = seriesCtor.split('-')[0];
            }

            series = this.chart_[seriesCtor](mappingInstance);

            // if (settings['chart']['type'] == 'map' && mappingObj['geoIdField']) {
            //   series['geoIdField'](mappingObj['geoIdField']);
            // }
          }

          var id = plotMapping[j]['id'];
          if (goog.isDef(id))
            series['id'](id);
          else
            plotMapping[j]['id'] = series['id']();
        }
      }
    }
  }

  // Chart settings
  goog.object.forEach(settings['chart']['settings'], function(value, key) {
    // //console.log("chart settings", key, value);
    if (key == "palette()") {
      value = self.anychart['palettes'][value];
    }
    anychart.bindingModule.exec(self.chart_, key, value);
  });

  this.getHandler().listenOnce(this.chart_, 'chartdraw',
      function() {
        self.dispatchEvent({
          type: anychart.chartEditor2Module.events.EventType.CHART_DRAW,
          chart: self.chart_,
          rebuild: rebuild
        });
      });

  if (rebuild) {
    this.chart_['container'](this.containerId_);
    this.chart_['draw']();
  }
};


/** @inheritDoc */
anychart.chartEditor2Module.Chart.prototype.dispose = function() {
  if (this.chart_ && typeof this.chart_['dispose'] == 'function') {
    this.chart_['dispose']();
    this.chart_ = null;
  }

  anychart.chartEditor2Module.Chart.base(this, 'dispose');
};