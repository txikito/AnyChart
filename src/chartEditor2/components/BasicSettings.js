goog.provide('anychart.chartEditor2Module.BasicSettings');

goog.require('anychart.chartEditor2Module.Component');
goog.require('anychart.chartEditor2Module.controls.Checkbox');
goog.require('anychart.chartEditor2Module.controls.Input');
goog.require('anychart.chartEditor2Module.EditorModel');
goog.require('anychart.chartEditor2Module.DataModel');



/**
 * Chart widget.
 * @param {anychart.chartEditor2Module.Editor} editor
 * @constructor
 * @extends {anychart.chartEditor2Module.Component}
 */
anychart.chartEditor2Module.BasicSettings = function(editor) {
  anychart.chartEditor2Module.BasicSettings.base(this, 'constructor');

  /**
   * @type {anychart.chartEditor2Module.Editor}
   * @private
   */
  this.editor_  = editor;
};
goog.inherits(anychart.chartEditor2Module.BasicSettings, anychart.chartEditor2Module.Component);



/** @inheritDoc */
anychart.chartEditor2Module.BasicSettings.prototype.createDom = function() {
  goog.base(this, 'createDom');

  goog.dom.classlist.add(this.getElement(), 'settings-panel');
  goog.dom.classlist.add(this.getElement(), 'basic-settings');
  // var dom = this.getDomHelper();

  // var titleEnabled = new anychart.chartEditor2Module.controls.Checkbox();
  // this.addChild(titleEnabled, true);
  // titleEnabled.setEditorModel(this.editor_.getEditorModel(), ['chart', 'title().enabled()'], true);

  this.titleText = new anychart.chartEditor2Module.controls.Input();
  this.addChild(this.titleText, true);
};


anychart.chartEditor2Module.BasicSettings.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  var self = this;
  this.getHandler().listenOnce(this.editor_, anychart.chartEditor2Module.events.EventType.CHART_DRAW, function(evt){
    this.titleText.setEditorModel(self.editor_.getEditorModel(), [['chart'], 'title().text()'], evt.chart);
  });
};