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


anychart.chartEditor2Module.Chart.prototype.update = function() {
  var anychart = goog.dom.getWindow()['anychart'];
  var editorModel = this.editor_.getModel();
  var rawData = editorModel.getRawData();
  var settings = editorModel.getModel();

  // Global settings
  goog.object.forEach(settings['anychart'], function(value, key) {
    //console.log("anychart settings", key, value);
    anychart.bindingModule.exec(anychart, key, value);
  });

  var self = this;

  // Chart creation
  console.log("BUILD CHART");
  if (this.chart_ && typeof this.chart_['dispose'] == 'function')
    this.chart_['dispose']();

  this.chart_ = this.anychart[settings['chart']['type']]();
  // this.chart_['id'](anychart.chartEditor2Module.Chart.CHART_ID);

  // Create data set
  var dsCtor = anychart.chartEditor2Module.EditorModel.chartTypes[settings['chart']['type']]['dataSetCtor'];
  var dataSet = this.anychart['data'][dsCtor](rawData);

  // create mapping and series
  for (var i = 0; i < settings['dataSettings']['mappings'].length; i++) {
    // mappings.push([]);
    for (var j = 0; j < settings['dataSettings']['mappings'][i].length; j++) {
      var seriesMapping = settings['dataSettings']['mappings'][i][j]['mapping'];
      var mappingObj = {'x': settings['dataSettings']['field']};
      for (var k in seriesMapping) {
        if (seriesMapping.hasOwnProperty(k))
          mappingObj[k] = seriesMapping[k];
      }
      var mappingInstance = dataSet['mapAs'](mappingObj);

      // Create series
      // todo: process stock too
      this.chart_[settings['dataSettings']['mappings'][i][j]['ctor']](mappingInstance);
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

  this.chart_['container']('chart-container');

  this.getHandler().listenOnce(this.chart_, 'chartdraw',
      function() {
        self.dispatchEvent({
          type: anychart.chartEditor2Module.events.EventType.CHART_DRAW,
          chart: self.chart_
        });
      });

  this.chart_['draw']();
};


anychart.chartEditor2Module.Chart.prototype.deepClone_ = function(obj) {
  if (goog.typeOf(obj) == 'object') {
    var res = {};
    for (var key in obj) {
      if (obj.hasOwnProperty(key))
        res[key] = this.deepClone_(obj[key]);
    }
    return res;
  } else {
    return obj;
  }
};
