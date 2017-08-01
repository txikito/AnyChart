goog.provide('anychart.chartEditor2Module.Chart');

goog.require('anychart.bindingModule.entry');
goog.require('anychart.chartEditor2Module.Component');
goog.require('anychart.chartEditor2Module.EditorModel');
goog.require('anychart.chartEditor2Module.DataModel');



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

  this.getHandler().listen(this.editor_.getEditorModel(), anychart.chartEditor2Module.events.EventType.EDITOR_MODEL_UPDATE, this.update_);

  if (this.chart_)
    anychart.ui.binding.init();
};


anychart.chartEditor2Module.Chart.prototype.update_ = function(evt) {
  var anychart = goog.dom.getWindow()['anychart'];
  var inputs = this.editor_.getEditorModel().getInputs();
  //console.log(inputs);

  // Global settings
  goog.object.forEach(inputs['anychart'], function(value, key) {
    //console.log("anychart settings", key, value);
    anychart.bindingModule.exec(anychart, key, value);
  });

  if (evt.isDataConsistent) {
    var self = this;

    //console.log("Build chart!");
    var dataModel = this.editor_.getDataModel();

    // Create data set
    var dsCtor = anychart.chartEditor2Module.EditorModel.chartTypes[inputs['chart']['ctor']]['dataSetCtor'];
    var dataSet = this.anychart['data'][dsCtor](dataModel.getRawData());

    // Chart creation
    if (this.chart_ && typeof this.chart_['dispose'] == 'function') {
      this.chart_['dispose']();
    }

    this.chart_ = this.anychart[inputs['chart']['ctor']]();
    this.chart_['id'](anychart.chartEditor2Module.Chart.CHART_ID);

    // Chart settings
    goog.object.forEach(inputs['chart'], function(value, key) {
      if (key != 'ctor') {
        // //console.log("chart settings", key, value);
        if (key == "palette()") {
          value = anychart['palettes'][value];
        }
        anychart.bindingModule.exec(self.chart_, key, value);
      }
    });

    // create mapping and series
    // var mappings = [];
    for (var i = 0; i < inputs['plot'].length; i++) {
      // mappings.push([]);
      for (var j = 0; j < inputs['plot'][i]['series'].length; j++) {
        var seriesMapping = inputs['plot'][i]['series'][j]['mapping'];
        var mappingObj = this.deepClone_(inputs['plot'][0]['mapping']);
        for (var k in seriesMapping) {
          if (seriesMapping.hasOwnProperty(k))
            mappingObj[k] = seriesMapping[k];
        }
        var mappingInstance = dataSet['mapAs'](mappingObj);
        //mappings[i].push(mappingInstance);

        // Create series
        // todo: process stock too
        this.chart_[inputs['plot'][i]['series'][j]['ctor']](mappingInstance);
      }
    }
    this.chart_['container']('chart-container');

    this.getHandler().listenOnce(this.chart_, 'chartdraw',
        function() {
          self.dispatchEvent({
            type: anychart.chartEditor2Module.events.EventType.CHART_DRAW,
            chart: self.chart_
          });
        });

    this.chart_['draw']();
  }
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
