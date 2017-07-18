goog.provide('anychart.ui.chartEditor2.PlotPanel');

goog.require('anychart.ui.chartEditor2.SeriesPanel');
goog.require('goog.ui.Component');



/**
 * @constructor
 * @extends {goog.ui.Component}
 */
anychart.ui.chartEditor2.PlotPanel = function(chartType, index) {
  anychart.ui.chartEditor2.PlotPanel.base(this, 'constructor');

  this.type_ = chartType;

  this.index_ = index;

  this.series_ = [];
};
goog.inherits(anychart.ui.chartEditor2.PlotPanel, goog.ui.Component);


/** @inheritDoc */
anychart.ui.chartEditor2.PlotPanel.prototype.createDom = function() {
  anychart.ui.chartEditor2.PlotPanel.base(this, 'createDom');

  goog.dom.classlist.add(this.getElement(), 'plot-panel');
  // goog.dom.classlist.add(this.getElement(), this.className);

  var dom = this.getDomHelper();
  this.getElement().appendChild(dom.createDom(goog.dom.TagName.H2, null, this.type_ + ' plot ' + this.index_));

  this.addSeriesBtn_ = new goog.ui.Button('Add series');
  this.addChild(this.addSeriesBtn_, true);

  this.addSeries_(this.getDefaultSeriesType_());
};


anychart.ui.chartEditor2.PlotPanel.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.getHandler().listen(this.addSeriesBtn_, goog.ui.Component.EventType.ACTION, this.onAddSeries_);
};


anychart.ui.chartEditor2.PlotPanel.prototype.addSeries_ = function(seriesType) {
  var series = new anychart.ui.chartEditor2.SeriesPanel(seriesType, this.series_.length + 1);
  this.series_.push(series);
  this.addChildAt(series, this.getChildCount() - 1, true);
};


anychart.ui.chartEditor2.PlotPanel.prototype.onAddSeries_ = function(evt) {
  this.addSeries_(this.getDefaultSeriesType_());
};

anychart.ui.chartEditor2.PlotPanel.prototype.getDefaultSeriesType_ = function() {
  return 'line';
};