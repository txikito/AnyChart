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
  this.noDispatch_ = false;
  this.noRebuild_ = false;
};
goog.inherits(anychart.chartEditor2Module.controls.Checkbox, goog.ui.Checkbox);


anychart.chartEditor2Module.controls.Checkbox.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.listen(goog.ui.Component.EventType.CHANGE, this.onChange);
};


anychart.chartEditor2Module.controls.Checkbox.prototype.onChange = function() {
  if (!this.noDispatch_ && this.editorModel_) {
    console.log("Checkbox onChange()", this.getChecked());
    if (this.callback_)
      this.editorModel_[this.callback_].call(this.editorModel_, this);
    else
      this.editorModel_.setValue(this.key_, this.getChecked(), false, this.noRebuild_);
  }
};


/**
 *
 * @param {anychart.chartEditor2Module.EditorModel} model
 * @param {anychart.chartEditor2Module.EditorModel.Key} key
 * @param {String=} opt_callback
 * @param {?{Object}=} opt_target
 * @param {Boolean=} opt_noRebuild
 */
anychart.chartEditor2Module.controls.Checkbox.prototype.setEditorModel = function(model, key, opt_callback, opt_target, opt_noRebuild) {
  this.editorModel_ = model;
  this.key_ = key;
  this.callback_ = opt_callback;
  this.noRebuild_ = !!opt_noRebuild;

  if (opt_target) {
    var stringKey = anychart.chartEditor2Module.EditorModel.getStringKey(key);
    var value = anychart.bindingModule.exec(opt_target, stringKey);
    this.noDispatch_ = true;
    this.setChecked(value);
    this.editorModel_.setValue(this.key_, value, true);
    this.noDispatch_ = false;
  }
};


anychart.chartEditor2Module.controls.Checkbox.prototype.getKey = function() {
  return this.key_;
};