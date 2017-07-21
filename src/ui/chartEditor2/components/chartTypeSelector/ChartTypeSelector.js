goog.provide('anychart.ui.chartEditor2.ChartTypeSelector');

goog.require('goog.ui.Component');
goog.require('anychart.ui.chartEditor2.PlotPanel');
goog.require('anychart.ui.chartEditor2.controls.ChartTypeSelect');


/**
 * Chart type selection widget.
 * Allows to choose chart type and contains PlotPanel widget(s).
 * @constructor
 * @extends {anychart.ui.Container}
 */
anychart.ui.chartEditor2.ChartTypeSelector = function(editor) {
  anychart.ui.chartEditor2.ChartTypeSelector.base(this, 'constructor');

  /**
   * @type {anychart.ui.Editor2}
   * @private
   */
  this.editor_ = editor;

  /**
   * @type {Array.<anychart.ui.chartEditor2.PlotPanel>}
   * @private
   */
  this.plots_ = [];
};
goog.inherits(anychart.ui.chartEditor2.ChartTypeSelector, goog.ui.Component);



/** @inheritDoc */
anychart.ui.chartEditor2.ChartTypeSelector.prototype.createDom = function() {
  anychart.ui.chartEditor2.ChartTypeSelector.base(this, 'createDom');

  goog.dom.classlist.add(this.getElement(), 'chart-type-selector');
  var dom = this.getDomHelper();

  this.chartTypeSelect_ = new anychart.ui.chartEditor2.controls.ChartTypeSelect();
  this.chartTypeSelect_.setEditorModel(this.editor_.getEditorModel(), {'category': 'chart', 'name': 'type'});
  this.chartTypeSelect_.setOptions(goog.object.getValues(anychart.ui.chartEditor2.EditorModel.chartTypes));

  this.typeIcon_ = dom.createDom(goog.dom.TagName.IMG, {'class': 'type-image', 'src': this.chartTypeSelect_.getIcon()});

  dom.appendChild(this.getElement(), this.typeIcon_);
  this.addChild(this.chartTypeSelect_, true);
};


anychart.ui.chartEditor2.ChartTypeSelector.prototype.enterDocument = function() {
  anychart.ui.chartEditor2.ChartTypeSelector.base(this, 'enterDocument');

  this.listen(anychart.ui.chartEditor2.events.EventType.PANEL_CLOSE, this.onClosePlot_);
  this.getHandler().listen(this.chartTypeSelect_, goog.ui.Component.EventType.CHANGE, this.onChangeChartType_);

  if(this.addPlotBtn_)
    this.getHandler().listen(this.addPlotBtn_, goog.ui.Component.EventType.ACTION, this.onAddPlot_);

  this.chartTypeSelect_.setSelectedByModel();
};


anychart.ui.chartEditor2.ChartTypeSelector.prototype.onChangeChartType_ = function() {
  this.typeIcon_.setAttribute('src', this.chartTypeSelect_.getIcon());
  this.setChartType(this.chartTypeSelect_.getValue());
  if(this.addPlotBtn_)
    this.getHandler().listen(this.addPlotBtn_, goog.ui.Component.EventType.ACTION, this.onAddPlot_);
};


anychart.ui.chartEditor2.ChartTypeSelector.prototype.onAddPlot_ = function() {
  var i = this.getChildCount();
  if (i > 0) i--;
  var plot = new anychart.ui.chartEditor2.PlotPanel(this.editor_, this.chartType_, this.plots_.length);
  this.plots_.push(plot);
  this.addChildAt(plot, i, true);
};


anychart.ui.chartEditor2.ChartTypeSelector.prototype.onClosePlot_ = function(evt) {
  if (evt.panelType == 'plot') {
    var plot = goog.array.splice(this.plots_, evt.index, 1)[0];
    this.removeChild(plot, true);
    plot.dispose();

    for (var i = 0; i < this.plots_.length; i++) {
      this.plots_[i].index(i);
    }
  }
};


anychart.ui.chartEditor2.ChartTypeSelector.prototype.setChartType = function(chartType) {
  if (this.chartType_ == chartType) return;

  this.chartType_ = chartType;

  for (var i = 0; i < this.plots_.length; i++) {
    this.removeChild(this.plots_[i], true);
    this.plots_[i].dispose();
  }

  this.plots_.length = 0;
  var plot = new anychart.ui.chartEditor2.PlotPanel(this.editor_, this.chartType_, 0);
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
