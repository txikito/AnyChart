goog.provide('anychart.chartEditor2Module.controls.Input');

goog.require('anychart.chartEditor2Module.Chart');
goog.require('goog.ui.BidiInput');



/**
 * Overrides control to work with EditorModel.
 * @constructor
 * @extends {goog.ui.BidiInput}
 */
anychart.chartEditor2Module.controls.Input = function(opt_domHelper) {
  anychart.chartEditor2Module.controls.Input.base(this, 'constructor', opt_domHelper);
  this.suspendDispatch_ = false;
};
goog.inherits(anychart.chartEditor2Module.controls.Input, goog.ui.BidiInput);


anychart.chartEditor2Module.controls.Input.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.inputHandler_ = new goog.events.InputHandler(this.getElement());
  goog.events.listen(
      this.inputHandler_, goog.events.InputHandler.EventType.INPUT,
      this.onChange, false, this);
};


anychart.chartEditor2Module.controls.Input.prototype.onChange = function(evt) {
  if (!this.suspendDispatch_ && this.editorModel_) {
    console.log("Input onChange()", this.getValue());
    if (this.callback_)
      this.editorModel_[this.callback_].call(this.editorModel_, this);
    else
      this.editorModel_.setValue(this.key_, this.getValue());
  }
};


/**
 *
 * @param {anychart.chartEditor2Module.EditorModel} model
 * @param {anychart.chartEditor2Module.EditorModel.Key} key
 * @param {String=} opt_callback
 * @param {?{Object}=} opt_target
 */
anychart.chartEditor2Module.controls.Input.prototype.setEditorModel = function(model, key, opt_callback, opt_target) {
  this.editorModel_ = model;
  this.key_ = key;
  this.callback_ = opt_callback;

  if (opt_target) {
    var stringKey = anychart.chartEditor2Module.EditorModel.getStringKey(key);
    var value = anychart.bindingModule.exec(opt_target, stringKey);
    this.suspendDispatch_ = true;
    this.setValue(value);
    this.editorModel_.setValue(this.key_, value, true);
    this.suspendDispatch_ = false;
  }
};


anychart.chartEditor2Module.controls.Input.prototype.getKey = function() {
  return this.key_;
};
