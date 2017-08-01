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
  this.chartType_ = this.editor_.getEditorModel().getModelValue([['chart'], 'type']);

  goog.dom.classlist.add(this.getElement(), 'plot-panel');
  goog.dom.classlist.add(this.getElement(), 'plot-panel-' + this.chartType_);
  goog.dom.classlist.add(this.getElement(), 'closable');

  if (this.chartType_ == 'stock' && this.index_ > 0) {
    this.close_ = dom.createDom(goog.dom.TagName.DIV, 'close', 'X');
    this.getElement().appendChild(this.close_);
  }

  this.title_ = dom.createDom(goog.dom.TagName.H2, 'title', 'Plot ' + (this.index_ + 1));
  this.getElement().appendChild(this.title_);

  // Series
  var plotModel = this.editor_.getEditorModel().getModelValue([['datasetSettings'], ['mappings', this.index_]]);
  for (var i = 0; i < plotModel.length; i++) {
    var series = new anychart.chartEditor2Module.SeriesPanel(this.editor_, i);
    this.series_.push(series);
    this.addChild(series, true);
  }

  // this.addSeriesBtn_ = new goog.ui.Button('Add series');
  // this.addChild(this.addSeriesBtn_, true);
};


anychart.chartEditor2Module.PlotPanel.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  if (this.close_)
    this.getHandler().listen(this.close_, goog.events.EventType.CLICK, this.onClose_);

  // this.getHandler().listen(this.addSeriesBtn_, goog.ui.Component.EventType.ACTION, this.addSeries_);
  //
  // this.listen(anychart.chartEditor2Module.events.EventType.PANEL_CLOSE, this.onCloseSeries_);


  // this.getHandler().listen(this.editor_.getDataModel(), anychart.chartEditor2Module.events.EventType.DATA_UPDATE_MODEL, this.onDataUpdate_);
  //
  // // Fint by ears to prevent build chart twice on dataset change
  // this.xValueSelect_.unlisten(goog.ui.Component.EventType.CHANGE, this.xValueSelect_.onChange);
  // this.getHandler().listen(this.xValueSelect_, goog.ui.Component.EventType.CHANGE, this.onChangeXValue_);
  //
  // this.onDataUpdate_(null);
};


anychart.chartEditor2Module.PlotPanel.prototype.addSeries_ = function() {
  var series = new anychart.chartEditor2Module.SeriesPanel(this.editor_, this.series_.length);
  this.series_.push(series);
  this.addChildAt(series, this.getChildCount() - 1, true);
  series.createFieldsOptions(this.currentSetId_);
};


anychart.chartEditor2Module.PlotPanel.prototype.getKey = function(opt_completion) {
  this.key_ = [['plot', this.index()]];
  return goog.base(this, 'getKey', opt_completion);
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


anychart.chartEditor2Module.PlotPanel.prototype.onCloseSeries_ = function(evt) {

  if (evt.panelType == 'series') {
    var series = goog.array.splice(this.series_, evt.index, 1)[0];
    this.removeChild(series, true);
    series.dispose();

    for (var i = 0; i < this.series_.length; i++) {
      this.series_[i].index(i);
    }
  }
};


anychart.chartEditor2Module.PlotPanel.prototype.onClose_ = function() {
  this.dispatchEvent({
    type: anychart.chartEditor2Module.events.EventType.PANEL_CLOSE,
    panelType: 'plot',
    index: this.index_
  })
};


// anychart.chartEditor2Module.PlotPanel.prototype.dispose = function() {
//
//   this.editor_.getEditorModel().removeByKey(this.getKey());
//   goog.base(this, 'dispose');
// };