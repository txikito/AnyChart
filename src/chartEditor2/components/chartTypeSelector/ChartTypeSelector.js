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
  this.chartTypeSelect_.setEditorModel(this.editor_.getEditorModel(), [['chart'], 'type'], 'setChartType');
  this.chartTypeSelect_.setOptions(goog.object.getValues(anychart.chartEditor2Module.EditorModel.chartTypes));
  this.addChild(this.chartTypeSelect_, true);

  // X Values Input
  this.xValueSelect_ = new anychart.chartEditor2Module.controls.SelectWithLabel('x', 'X Values');
  this.xValueSelect_.setEditorModel(this.editor_.getEditorModel(), [['datasetSettings'], 'field']);
  this.addChild(this.xValueSelect_, true);
};


anychart.chartEditor2Module.ChartTypeSelector.prototype.update = function() {
  this.chartTypeSelect_.setValueByModel();

  this.typeIcon_.setAttribute('src', this.chartTypeSelect_.getIcon());

  this.createXValuesOptions_();
  this.xValueSelect_.setValueByModel();

  // Plots
  this.removePlots_();
  var dsSettings = this.editor_.getEditorModel().getModelValue(['datasetSettings']);
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

  var chartType = this.editor_.getEditorModel().getModelValue([['chart'], 'type']);
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

  this.listen(anychart.chartEditor2Module.events.EventType.PANEL_CLOSE, this.onClosePlot_);

  //this.getHandler().listen(this.editor_.getDataModel(), anychart.chartEditor2Module.events.EventType.DATA_UPDATE_MODEL, this.onDataUpdate_);
  this.getHandler().listen(this.editor_.getEditorModel(), anychart.chartEditor2Module.events.EventType.EDITOR_MODEL_UPDATE, this.update);
};


anychart.chartEditor2Module.ChartTypeSelector.prototype.createXValuesOptions_ = function() {
  for (var a = this.xValueSelect_.getItemCount(); a--;) {
    this.xValueSelect_.removeItemAt(a);
  }

  var data = this.editor_.getDataModel().getPreparedData();
  for(var i = 0; i < data.length; i++) {
    var fields = data[i]['fields'];
    for(var j = 0; j < fields.length; j++) {
      var caption = data.length == 1 ? fields[j]['name'] : data[i]['name'] + ' - ' + fields[j]['name'];
      var setFullId = data[i]['type'] + data[i]['setId'];
      var item = new anychart.chartEditor2Module.controls.MenuItemWithTwoValues(caption, fields[j]['key'], setFullId);
      this.xValueSelect_.addItem(item);
    }
  }
};


anychart.chartEditor2Module.ChartTypeSelector.prototype.onAddPlot_ = function() {
  this.editor_.getEditorModel().addPlot();
};


anychart.chartEditor2Module.ChartTypeSelector.prototype.onClosePlot_ = function(evt) {
  if (evt.panelType == 'plot')
    this.editor_.getEditorModel().removePlot(evt.index);
};


anychart.chartEditor2Module.ChartTypeSelector.prototype.removePlots_ = function() {
  for (var i = 0; i < this.plots_.length; i++) {
    this.removeChild(this.plots_[i], true);
    this.plots_[i].dispose();
  }
  this.plots_.length = 0;
};


/*
anychart.chartEditor2Module.ChartTypeSelector.prototype.onDataUpdate_ = function() {
  var data = this.editor_.getDataModel().getPreparedData();
  if (!data.length) {
    this.removePlots_();
    this.chartTypeSelect_.resetEditorModel();
  }

  goog.dom.classlist.enable(this.getElement(), 'hidden', !data.length);
};


anychart.chartEditor2Module.ChartTypeSelector.prototype.onChangeChartType_ = function(evt) {
  this.chartType_ = this.chartTypeSelect_.getValue();
  if (!this.chartType_) return;

  this.typeIcon_.setAttribute('src', this.chartTypeSelect_.getIcon());

  this.editor_.getEditorModel().suspendDispatch();
  this.removePlots_();

  var plot = new anychart.chartEditor2Module.PlotPanel(this.editor_, this.chartType_, 0);
  this.plots_.push(plot);
  this.addChild(plot, true);

  this.chartTypeSelect_.onChange(evt);
  this.editor_.getEditorModel().resumeDispatch();
};

*/
