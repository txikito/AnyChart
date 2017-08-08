goog.provide('anychart.chartEditor2Module.Chart');

goog.require('anychart.bindingModule.entry');
goog.require('anychart.chartEditor2Module.Component');
goog.require('anychart.chartEditor2Module.EditorModel');


/**
 * Chart widget.
 * @param {anychart.chartEditor2Module.Editor} editor
 * @constructor
 * @extends {anychart.chartEditor2Module.Component}
 */
anychart.chartEditor2Module.Chart = function(editor) {
  anychart.chartEditor2Module.Chart.base(this, 'constructor');

  /**
   * @type {anychart.chartEditor2Module.Editor}
   * @private
   */
  this.editor_ = editor;

  this.anychart = /** @type {Object} */(goog.dom.getWindow()['anychart']);
};
goog.inherits(anychart.chartEditor2Module.Chart, anychart.chartEditor2Module.Component);


anychart.chartEditor2Module.Chart.CHART_ID = goog.string.createUniqueString();


/** @inheritDoc */
anychart.chartEditor2Module.Chart.prototype.createDom = function() {
  goog.base(this, 'createDom');

  goog.dom.classlist.add(this.getElement(), 'chart-container');
  // var dom = this.getDomHelper();

  this.getDomHelper().setProperties(this.getElement(), {'id': 'chart-container'});
};


anychart.chartEditor2Module.Chart.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.update();
  this.getHandler().listen(this.editor_.getModel(), anychart.chartEditor2Module.events.EventType.EDITOR_MODEL_UPDATE, this.update);
};


anychart.chartEditor2Module.Chart.prototype.update = function(opt_evt) {
  var anychart = goog.dom.getWindow()['anychart'];
  var editorModel = this.editor_.getModel();
  var rawData = editorModel.getRawData();
  var settings = editorModel.getModel();
  var rebuild = !goog.isDefAndNotNull(opt_evt) || opt_evt.rebuild;

  // Global settings
  goog.object.forEach(settings['anychart'], function(value, key) {
    //console.log("anychart settings", key, value);
    anychart.bindingModule.exec(anychart, key, value);
  });

  var self = this;

  // Chart creation
  if (rebuild && this.chart_ && typeof this.chart_['dispose'] == 'function') {
    this.chart_['dispose']();
    this.chart_ = null;
  }

  if (rebuild) {
    console.log("BUILD CHART");
    this.chart_ = this.anychart[settings['chart']['type']]();

    if (settings['chart']['type'] == 'map') {
//      console.log(rawData);
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
            series = this.chart_[seriesCtor](mappingInstance);
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
      value = anychart['palettes'][value];
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
    this.chart_['container']('chart-container');
    this.chart_['draw']();
  }
};
