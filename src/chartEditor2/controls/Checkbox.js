goog.provide('anychart.chartEditor2Module.controls.Checkbox');

goog.require('anychart.chartEditor2Module.Chart');
goog.require('goog.ui.Checkbox');



/**
 * Overrides control to work with EditorModel.
 * @constructor
 * @extends {goog.ui.Checkbox}
 */
anychart.chartEditor2Module.controls.Checkbox = function(opt_checked, opt_domHelper, opt_renderer) {
  anychart.chartEditor2Module.controls.Checkbox.base(this, 'constructor', opt_checked, opt_domHelper, opt_renderer);
};
goog.inherits(anychart.chartEditor2Module.controls.Checkbox, goog.ui.Checkbox);


anychart.chartEditor2Module.controls.Checkbox.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.listen(goog.ui.Component.EventType.CHANGE, this.onChange);
};


anychart.chartEditor2Module.controls.Checkbox.prototype.onChange = function(evt) {
  if (this.editorModel_ && this.key_)
    this.editorModel_.setInputValue(this.key_, this.getChecked());
};


/**
 * @param {anychart.chartEditor2Module.EditorModel} model
 * @param {anychart.chartEditor2Module.EditorModel.Key} key
 * @param {?{Object}=} opt_chart
 */
anychart.chartEditor2Module.controls.Checkbox.prototype.setEditorModel = function(model, key, opt_chart) {
  this.editorModel_ = model;
  this.key_ = key;
  if (opt_chart) {
    var stringKey = anychart.chartEditor2Module.EditorModel.getStringKey(key);
    var value = anychart.bindingModule.exec(opt_chart, stringKey);
    this.setChecked(value);
    this.editorModel_.setInputValue(this.key_, value, true);
  }
};


anychart.chartEditor2Module.controls.Checkbox.prototype.resetEditorModel = function() {
  if (this.editorModel_ && this.key_)
    this.editorModel_.removeByKey(this.key_);
};
