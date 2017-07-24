goog.provide('anychart.chartEditor2Module.PlotPanel');

goog.require('anychart.chartEditor2Module.controls.SelectWithLabel');
goog.require('anychart.chartEditor2Module.controls.MenuItemWithTwoValues');
goog.require('anychart.chartEditor2Module.SeriesPanel');
goog.require('goog.ui.Component');



/**
 * @constructor
 * @extends {goog.ui.Component}
 */
anychart.chartEditor2Module.PlotPanel = function(editor, chartType, index) {
  goog.base(this);

  /**
   * @type {anychart.chartEditor2Module.Editor}
   * @private
   */
  this.editor_ = editor;

  this.chartType_ = chartType;

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
goog.inherits(anychart.chartEditor2Module.PlotPanel, goog.ui.Component);


/** @inheritDoc */
anychart.chartEditor2Module.PlotPanel.prototype.createDom = function() {
  anychart.chartEditor2Module.PlotPanel.base(this, 'createDom');

  goog.dom.classlist.add(this.getElement(), 'plot-panel');
  goog.dom.classlist.add(this.getElement(), 'plot-panel-' + this.chartType_);
  goog.dom.classlist.add(this.getElement(), 'closable');

  var dom = this.getDomHelper();
  if (this.chartType_ == 'stock' && this.index_ > 0) {
    this.close_ = dom.createDom(goog.dom.TagName.DIV, 'close', 'X');
    this.getElement().appendChild(this.close_);
  }

  this.title_ = dom.createDom(goog.dom.TagName.H2, 'title', 'Plot ' + (this.index_ + 1));
  this.getElement().appendChild(this.title_);

  // X Values Input
  this.xValueSelect_ = new anychart.chartEditor2Module.controls.SelectWithLabel('X Values');
  this.xValueSelect_.setEditorModel(this.editor_.getEditorModel(), {'category': 'plot', 'group': 0, 'name': 'x'});
  this.addChild(this.xValueSelect_, true);

  this.addSeriesBtn_ = new goog.ui.Button('Add series');
  this.addChild(this.addSeriesBtn_, true);
};


anychart.chartEditor2Module.PlotPanel.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.getHandler().listen(this.addSeriesBtn_, goog.ui.Component.EventType.ACTION, this.onAddSeries_);
  this.listen(anychart.chartEditor2Module.events.EventType.PANEL_CLOSE, this.onCloseSeries_);
  if (this.close_)
    this.getHandler().listen(this.close_, goog.events.EventType.CLICK, this.onClose_);
  this.getHandler().listen(this.editor_.getDataModel(), anychart.chartEditor2Module.events.EventType.DATA_UPDATE_MODEL, this.update);
  this.getHandler().listen(this.xValueSelect_, goog.ui.Component.EventType.CHANGE, this.onChangeXValue_);

  this.update(null);
};


anychart.chartEditor2Module.PlotPanel.prototype.update = function(evt) {
  if (evt && evt.action == 'add') return;

  // if (evt.action == 'remove' && !evt.action.isActiveRemoved) {
  //
  // }
  var data = this.editor_.getDataModel().getPreparedData();

  for (var a = this.xValueSelect_.getItemCount(); a--;) {
    this.xValueSelect_.removeItemAt(a);
  }

  for(var i = 0; i < data.length; i++) {
    var fields = data[i]['fields'];
    for(var j = 0; j < fields.length; j++) {
      var caption = data.length == 1 ? fields[j]['name'] : data[i]['name'] + ' - ' + fields[j]['name'];
      var setFullId = data[i]['type'] + data[i]['setId'];
      var item = new anychart.chartEditor2Module.controls.MenuItemWithTwoValues(caption, fields[j]['key'], setFullId);
      this.xValueSelect_.addItem(item);
    }
  }


  // todo: Do more deliberate choice
  this.xValueSelect_.setSelectedByModel();
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


anychart.chartEditor2Module.PlotPanel.prototype.addSeries_ = function(seriesType) {
  var series = new anychart.chartEditor2Module.SeriesPanel(this.editor_, this.chartType_, seriesType, this.series_.length);
  this.series_.push(series);
  this.addChildAt(series, this.getChildCount() - 1, true);
  series.createFieldsOptions(this.currentSetId_);
};


anychart.chartEditor2Module.PlotPanel.prototype.getDefaultSeriesType_ = function() {
  /**
   * todo: проверять, позволяют ли выбранные данные использовать дефолтную серию.
   */
  return anychart.chartEditor2Module.EditorModel.chartTypes[this.chartType_]['series'][0];
};


anychart.chartEditor2Module.PlotPanel.prototype.onAddSeries_ = function(evt) {
  this.addSeries_(this.getDefaultSeriesType_(), true);
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


anychart.chartEditor2Module.PlotPanel.prototype.onChangeXValue_ = function(evt) {
  var setFullId = evt.target.getValue2();
  if (setFullId) {
    this.currentSetId_ = setFullId;
    this.dispatchEvent({
      type: anychart.chartEditor2Module.events.EventType.DATA_USE,
      setFullId: this.currentSetId_
    });

    if (!this.series_.length)
      this.addSeries_(this.getDefaultSeriesType_());
  }
};


anychart.chartEditor2Module.PlotPanel.prototype.onClose_ = function(evt) {
  this.dispatchEvent({
    type: anychart.chartEditor2Module.events.EventType.PANEL_CLOSE,
    panelType: 'plot',
    index: this.index_
  })
};