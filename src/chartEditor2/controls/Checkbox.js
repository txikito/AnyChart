goog.provide('anychart.chartEditor2Module.controls.Checkbox');

goog.require('anychart.chartEditor2Module.Chart');
goog.require('goog.ui.Checkbox');



/**
 * Overrides control to work with EditorModel.
 * @constructor
 * @extends {goog.ui.Checkbox}
 */
anychart.chartEditor2Module.controls.Checkbox = function(opt_checked, opt_domHelper, opt_renderer) {
  anychart.chartEditor2Module.controls.Checkbox.base(this, 'constructor', opt_checked, opt_domHelper,
      opt_renderer);
};
goog.inherits(anychart.chartEditor2Module.controls.Checkbox, goog.ui.Checkbox);


anychart.chartEditor2Module.controls.Checkbox.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.listen(goog.ui.Component.EventType.CHANGE, this.onChange);
};


anychart.chartEditor2Module.controls.Checkbox.prototype.onChange = function(evt) {
  console.log("Checkbox changes", evt, this.getChecked());
  // if (this.editorModel_ && this.key_ && goog.isDefAndNotNull(this.getValue()))
  //   this.editorModel_.setInputValue(this.key_, this.getValue());
};


/**
 * @param {anychart.chartEditor2Module.EditorModel} model
 * @param {anychart.chartEditor2Module.EditorModel.Key} key
 * @param {boolean=} opt_binded
 */
anychart.chartEditor2Module.controls.Checkbox.prototype.setEditorModel = function(model, key, opt_binded) {
  this.editorModel_ = model;
  this.key_ = key;
  // if (opt_binded) {
  //   var stringKey = anychart.chartEditor2Module.EditorModel.getStringKey(key);
  //   debugger;
  //   var value = anychart.chartEditor2Module.Chart.getChartValue(stringKey);
  //   this.setValue(value);
  // }
};


anychart.chartEditor2Module.controls.Checkbox.prototype.resetEditorModel = function() {
  if (this.editorModel_ && this.key_)
    this.editorModel_.removeByKey(this.key_);
};


anychart.chartEditor2Module.controls.Checkbox.prototype.setSelectedByModel = function() {
  var value;
  if (this.editorModel_ && this.key_)
    value = this.editorModel_.getInputValue(this.key_);

  if (goog.isDef(value)) {
    this.setValue(value);

    if (!this.getSelectedItem()) {
      this.setSelectedDefault();

    }
  } else
    this.setSelectedDefault();
};


anychart.chartEditor2Module.controls.Checkbox.prototype.setSelectedDefault = function() {
  this.setSelectedIndex(0);
};