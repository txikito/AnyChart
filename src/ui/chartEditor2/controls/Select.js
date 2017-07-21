goog.provide('anychart.ui.chartEditor2.controls.Select');

goog.require('goog.ui.Select');



/**
 * Overrides control to work with EditorModel.
 * @constructor
 * @extends {goog.ui.Select}
 */
anychart.ui.chartEditor2.controls.Select = function(opt_caption, opt_menu, opt_renderer, opt_domHelper, opt_menuRenderer) {
  anychart.ui.chartEditor2.controls.Select.base(this, 'constructor', opt_caption, opt_menu, opt_renderer, opt_domHelper, opt_menuRenderer);

  this.options_ = [];
};
goog.inherits(anychart.ui.chartEditor2.controls.Select, goog.ui.Select);


anychart.ui.chartEditor2.controls.Select.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.listen(goog.ui.Component.EventType.CHANGE, this.onChange_);
};


anychart.ui.chartEditor2.controls.Select.prototype.onChange_ = function(evt) {
  this.editorModel_.setInputValue(this.key_, this.getValue());
};


/**
 *
 * @param {anychart.ui.chartEditor2.EditorModel} model
 * @param {anychart.ui.chartEditor2.EditorModel.Key} key
 */
anychart.ui.chartEditor2.controls.Select.prototype.setEditorModel = function(model, key) {
  this.editorModel_ = model;
  this.key_ = key;
};


anychart.ui.chartEditor2.controls.Select.prototype.setSelectedByModel = function() {
  var value;
  if (this.editorModel_ && this.key_)
    value = this.editorModel_.getInputValue(this.key_);

  if (goog.isDef(value))
    this.setValue(value);
  else
    this.setSelectedIndex(0);
};
