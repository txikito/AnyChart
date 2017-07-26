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

  this.key_ = [['chart']];
};
goog.inherits(anychart.chartEditor2Module.ChartTypeSelector, anychart.chartEditor2Module.Component);



/** @inheritDoc */
anychart.chartEditor2Module.ChartTypeSelector.prototype.createDom = function() {
  anychart.chartEditor2Module.ChartTypeSelector.base(this, 'createDom');

  goog.dom.classlist.add(this.getElement(), 'chart-type-selector');
  var dom = this.getDomHelper();

  this.chartTypeSelect_ = new anychart.chartEditor2Module.controls.ChartTypeSelect();
  this.chartTypeSelect_.setEditorModel(this.editor_.getEditorModel(), this.getKey('ctor'));
  this.chartTypeSelect_.setOptions(goog.object.getValues(anychart.chartEditor2Module.EditorModel.chartTypes));

  this.typeIcon_ = dom.createDom(goog.dom.TagName.IMG, {'class': 'type-image', 'src': this.chartTypeSelect_.getIcon()});

  dom.appendChild(this.getElement(), this.typeIcon_);
  this.addChild(this.chartTypeSelect_, true);
};


anychart.chartEditor2Module.ChartTypeSelector.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.getHandler().listen(this.editor_.getDataModel(), anychart.chartEditor2Module.events.EventType.DATA_UPDATE_MODEL, this.onDataUpdate_);
  this.getHandler().listen(this.chartTypeSelect_, goog.ui.Component.EventType.CHANGE, this.onChangeChartType_);

  if(this.addPlotBtn_)
    this.getHandler().listen(this.addPlotBtn_, goog.ui.Component.EventType.ACTION, this.onAddPlot_);

  this.listen(anychart.chartEditor2Module.events.EventType.PANEL_CLOSE, this.onClosePlot_);

  this.onDataUpdate_();
  this.chartTypeSelect_.setSelectedByModel();
};


anychart.chartEditor2Module.ChartTypeSelector.prototype.onDataUpdate_ = function() {
  var data = this.editor_.getDataModel().getPreparedData();
  if (!data.length) {
    this.removePlots_();
    this.chartTypeSelect_.resetEditorModel();
  }

  goog.dom.classlist.enable(this.getElement(), 'hidden', !data.length);
};


anychart.chartEditor2Module.ChartTypeSelector.prototype.onChangeChartType_ = function() {
  this.typeIcon_.setAttribute('src', this.chartTypeSelect_.getIcon());
  this.setChartType(this.chartTypeSelect_.getValue());
  if(this.addPlotBtn_)
    this.getHandler().listen(this.addPlotBtn_, goog.ui.Component.EventType.ACTION, this.onAddPlot_);
};


anychart.chartEditor2Module.ChartTypeSelector.prototype.onAddPlot_ = function() {
  var i = this.getChildCount();
  if (i > 0) i--;
  var plot = new anychart.chartEditor2Module.PlotPanel(this.editor_, this.chartType_, this.plots_.length);
  this.plots_.push(plot);
  this.addChildAt(plot, i, true);
};


anychart.chartEditor2Module.ChartTypeSelector.prototype.onClosePlot_ = function(evt) {
  if (evt.panelType == 'plot') {
    var plot = goog.array.splice(this.plots_, evt.index, 1)[0];
    this.removeChild(plot, true);
    plot.dispose();

    for (var i = 0; i < this.plots_.length; i++) {
      this.plots_[i].index(i);
    }
  }
};


anychart.chartEditor2Module.ChartTypeSelector.prototype.setChartType = function(chartType) {
  if (this.chartType_ == chartType) return;
  this.chartType_ = chartType;
  if (!this.chartType_) return;

  this.removePlots_();

  var plot = new anychart.chartEditor2Module.PlotPanel(this.editor_, this.chartType_, 0);
  this.plots_.push(plot);
  this.addChild(plot, true);

  if (this.chartType_ == 'stock' && !this.addPlotBtn_) {
    this.addPlotBtn_ = new goog.ui.Button('Add plot');
    this.addChildAt(this.addPlotBtn_, this.getChildCount(), true);
  } else if (this.addPlotBtn_) {
    // Убрать кнопку
    this.removeChild(this.addPlotBtn_, true);
    this.addPlotBtn_.dispose();
    this.addPlotBtn_ = null;
  }
};


anychart.chartEditor2Module.ChartTypeSelector.prototype.removePlots_ = function() {
  for (var i = 0; i < this.plots_.length; i++) {
    this.removeChild(this.plots_[i], true);
    this.plots_[i].dispose();
  }
  this.plots_.length = 0;
};