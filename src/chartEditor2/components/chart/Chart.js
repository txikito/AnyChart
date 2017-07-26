goog.provide('anychart.chartEditor2Module.Chart');

goog.require('anychart.chartEditor2Module.Component');


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
};
goog.inherits(anychart.chartEditor2Module.Chart, anychart.chartEditor2Module.Component);



/** @inheritDoc */
anychart.chartEditor2Module.Chart.prototype.createDom = function() {
  goog.base(this, 'createDom');

  goog.dom.classlist.add(this.getElement(), 'chart-container');
  // var dom = this.getDomHelper();
};


anychart.chartEditor2Module.Chart.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.getHandler().listen(this.editor_.getEditorModel(), anychart.chartEditor2Module.events.EventType.EDITOR_MODEL_UPDATE, this.update_);
  // this.getHandler().listen(this.chartTypeSelect_, goog.ui.Component.EventType.CHANGE, this.onChangeChartType_);
  //
  // if(this.addPlotBtn_)
  //   this.getHandler().listen(this.addPlotBtn_, goog.ui.Component.EventType.ACTION, this.onAddPlot_);
  //
  // this.listen(anychart.chartEditor2Module.events.EventType.PANEL_CLOSE, this.onClosePlot_);
  //
  // this.onDataUpdate_();
  // this.chartTypeSelect_.setSelectedByModel();
};


anychart.chartEditor2Module.Chart.prototype.update_ = function(evt) {
  if (evt.isDataConsistent) {
    console.log("Build chart!");
  }
};