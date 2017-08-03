goog.provide('anychart.chartEditor2Module.PlotPanel');

goog.require('anychart.chartEditor2Module.Component');
goog.require('anychart.chartEditor2Module.controls.SelectWithLabel');
goog.require('anychart.chartEditor2Module.controls.MenuItemWithTwoValues');
goog.require('anychart.chartEditor2Module.SeriesPanel');
goog.require('goog.ui.Component');



/**
 * @constructor
 * @extends {anychart.chartEditor2Module.Component}
 */
anychart.chartEditor2Module.PlotPanel = function(editor, index) {
  goog.base(this);

  /**
   * @type {anychart.chartEditor2Module.Editor}
   * @private
   */
  this.editor_ = editor;

  this.index_ = index;

  /**
   * @type {Array.<anychart.chartEditor2Module.SeriesPanel>}
   * @private
   */
  this.series_ = [];

  /**
   * @type {?String}
   * @private
   */
  this.currentSetId_ = null;
};
goog.inherits(anychart.chartEditor2Module.PlotPanel, anychart.chartEditor2Module.Component);


/** @inheritDoc */
anychart.chartEditor2Module.PlotPanel.prototype.createDom = function() {
  anychart.chartEditor2Module.PlotPanel.base(this, 'createDom');

  var dom = this.getDomHelper();
  this.chartType_ = this.editor_.getModel().getValue([['chart'], 'type']);

  goog.dom.classlist.add(this.getElement(), 'plot-panel');
  goog.dom.classlist.add(this.getElement(), 'plot-panel-' + this.chartType_);
  goog.dom.classlist.add(this.getElement(), 'closable');

  if (this.chartType_ == 'stock' && this.index_ > 0) {
    this.close_ = dom.createDom(goog.dom.TagName.DIV, 'close', 'X');
    this.getElement().appendChild(this.close_);
  }

  this.title_ = dom.createDom(goog.dom.TagName.H2, 'title', 'Plot ' + (this.index_ + 1));
  this.getElement().appendChild(this.title_);
};


anychart.chartEditor2Module.PlotPanel.prototype.update = function() {
  // Series
  this.removeAllSeries_();

  var plotModel = this.editor_.getModel().getValue([['dataSettings'], ['mappings', this.index_]]);
  for (var i = 0; i < plotModel.length; i++) {
    var series = new anychart.chartEditor2Module.SeriesPanel(this.editor_, i);
    this.series_.push(series);
    this.addChild(series, true);
  }

  this.addSeriesBtn_ = new goog.ui.Button('Add series');
  this.addChild(this.addSeriesBtn_, true);

};


anychart.chartEditor2Module.PlotPanel.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.update();

  if (this.close_)
    this.getHandler().listen(this.close_, goog.events.EventType.CLICK, function() {
      this.editor_.getModel().dropPlot(this.index_);
    });

  this.getHandler().listen(this.addSeriesBtn_, goog.ui.Component.EventType.ACTION, function() {
    this.editor_.getModel().addSeries(this.index_);
  });
};


anychart.chartEditor2Module.PlotPanel.prototype.removeAllSeries_ = function() {
  for (var i = 0; i < this.series_.length; i++) {
    this.removeChild(this.series_[i], true);
    this.series_[i].dispose();
  }
  this.series_.length = 0;
};


anychart.chartEditor2Module.PlotPanel.prototype.index = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (goog.isNumber(opt_value)) {
      this.index_ = opt_value;
      this.title_.innerHTML = 'Plot ' + (this.index_ + 1);
    }
    return this;
  }
  return this.index_;
};


anychart.chartEditor2Module.PlotPanel.prototype.dispose = function() {
  this.removeAllSeries_();
  goog.base(this, 'dispose');
};


anychart.chartEditor2Module.PlotPanel.prototype.getKey = function(opt_completion) {
  this.key_ = [['plot', this.index()]];
  return goog.base(this, 'getKey', opt_completion);
};
