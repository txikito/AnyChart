goog.provide('anychart.chartEditor2Module.ChartTypeSelector');

goog.require('anychart.chartEditor2Module.Component');
goog.require('anychart.chartEditor2Module.PlotPanel');
goog.require('anychart.chartEditor2Module.controls.ChartTypeSelect');


/**
 * Chart type selection widget.
 * Allows to choose chart type and contains PlotPanel widget(s).
 * @param {anychart.chartEditor2Module.Editor} editor
 * @constructor
 * @extends {anychart.chartEditor2Module.Component}
 */
anychart.chartEditor2Module.ChartTypeSelector = function(editor) {
  anychart.chartEditor2Module.ChartTypeSelector.base(this, 'constructor');

  /**
   * @type {anychart.chartEditor2Module.Editor}
   * @private
   */
  this.editor_ = editor;

  /**
   * @type {Array.<anychart.chartEditor2Module.PlotPanel>}
   * @private
   */
  this.plots_ = [];

  // this.key_ = [['chart']];
};
goog.inherits(anychart.chartEditor2Module.ChartTypeSelector, anychart.chartEditor2Module.Component);



/** @inheritDoc */
anychart.chartEditor2Module.ChartTypeSelector.prototype.createDom = function() {
  anychart.chartEditor2Module.ChartTypeSelector.base(this, 'createDom');

  goog.dom.classlist.add(this.getElement(), 'chart-type-selector');
  var dom = this.getDomHelper();

  this.typeIcon_ = dom.createDom(goog.dom.TagName.IMG, {'class': 'type-image'/*, 'src': this.chartTypeSelect_.getIcon()*/});
  dom.appendChild(this.getElement(), this.typeIcon_);

  this.chartTypeSelect_ = new anychart.chartEditor2Module.controls.ChartTypeSelect();
  this.chartTypeSelect_.setEditorModel(this.editor_.getModel(), [['chart'], 'type'], 'setChartType');
  this.chartTypeSelect_.setOptions(goog.object.getValues(anychart.chartEditor2Module.EditorModel.chartTypes));
  this.addChild(this.chartTypeSelect_, true);
};


anychart.chartEditor2Module.ChartTypeSelector.prototype.update = function() {
  var chartType = this.editor_.getModel().getValue([['chart'], 'type']);
  var stackMode = this.editor_.getModel().getValue([['chart'], ['settings'], 'yScale().stackMode()']);
  this.chartTypeSelect_.setValueByModel(stackMode);

  this.typeIcon_.setAttribute('src', this.chartTypeSelect_.getIcon());

  if(this.geoDataSelect_) {
    this.removeChild(this.geoDataSelect_, true);
    this.geoDataSelect_.dispose();
    this.geoDataSelect_ = null;
  }

  if(this.xValueSelect_) {
    this.removeChild(this.xValueSelect_, true);
    this.xValueSelect_.dispose();
    this.xValueSelect_ = null;
  }

  if (chartType == 'map') {
    // Geo data select
    this.geoDataSelect_ = new anychart.chartEditor2Module.controls.SelectWithLabel('activeGeo', 'Geo data');

    var geoData = this.editor_.getModel().getGeoData();
    var options = [];
    for (var key in geoData) {
      options.push([geoData[key]['title'], key]);
    }
    this.geoDataSelect_.setOptions(options);

    this.geoDataSelect_.setEditorModel(this.editor_.getModel(), [['dataSettings'], 'activeGeo'], 'setActiveGeo');
    this.addChild(this.geoDataSelect_, true);
    this.geoDataSelect_.setValueByModel();

  } else {
    // X Values select
    this.xValueSelect_ = new anychart.chartEditor2Module.controls.SelectWithLabel('x', 'X Values');
    this.xValueSelect_.setEditorModel(this.editor_.getModel(), [['dataSettings'], 'field'], 'setActiveField');
    this.addChild(this.xValueSelect_, true);

    this.createXValuesOptions_();
    var activeDatasetId = this.editor_.getModel().getActive();
    this.xValueSelect_.setValueByModel(activeDatasetId);
  }

  // Plots
  this.removeAllPlots_();

  var dsSettings = this.editor_.getModel().getValue(['dataSettings']);
  for (var i = 0; i < dsSettings['mappings'].length; i++) {
    var plot = new anychart.chartEditor2Module.PlotPanel(this.editor_, i);
    this.plots_.push(plot);
    this.addChild(plot, true);
  }

  if (this.addPlotBtn_) {
    // Убрать старую кнопку
    this.getHandler().unlisten(this.addPlotBtn_, goog.ui.Component.EventType.ACTION, this.onAddPlot_);
    this.removeChild(this.addPlotBtn_, true);
    this.addPlotBtn_.dispose();
    this.addPlotBtn_ = null;
  }

  if (chartType == 'stock') {
    this.addPlotBtn_ = new goog.ui.Button('Add plot');
    this.addChildAt(this.addPlotBtn_, this.getChildCount(), true);
    this.getHandler().listen(this.addPlotBtn_, goog.ui.Component.EventType.ACTION, this.onAddPlot_);
  }
};


anychart.chartEditor2Module.ChartTypeSelector.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.update();

  if(this.addPlotBtn_)
    this.getHandler().listen(this.addPlotBtn_, goog.ui.Component.EventType.ACTION, this.onAddPlot_);

  this.getHandler().listen(this.editor_.getModel(), anychart.chartEditor2Module.events.EventType.EDITOR_MODEL_UPDATE, this.update);
};


anychart.chartEditor2Module.ChartTypeSelector.prototype.createXValuesOptions_ = function() {
  for (var a = this.xValueSelect_.getItemCount(); a--;) {
    this.xValueSelect_.removeItemAt(a);
  }

  var data = this.editor_.getModel().getPreparedData();
  for(var i = 0; i < data.length; i++) {
    var fields = data[i]['fields'];
    for(var j = 0; j < fields.length; j++) {
      var caption = data.length == 1 ? fields[j]['name'] : data[i]['title'] + ' - ' + fields[j]['name'];
      var setFullId = data[i]['type'] + data[i]['setId'];
      var item = new anychart.chartEditor2Module.controls.MenuItemWithTwoValues(caption, fields[j]['key'], setFullId);
      this.xValueSelect_.addItem(item);
    }
  }
};


anychart.chartEditor2Module.ChartTypeSelector.prototype.onAddPlot_ = function() {
  this.editor_.getModel().addPlot();
};


anychart.chartEditor2Module.ChartTypeSelector.prototype.removeAllPlots_ = function() {
  for (var i = 0; i < this.plots_.length; i++) {
    this.removeChild(this.plots_[i], true);
    this.plots_[i].dispose();
  }
  this.plots_.length = 0;
};
