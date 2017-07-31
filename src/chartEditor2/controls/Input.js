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
  if (this.editorModel_ && this.key_ && goog.isDefAndNotNull(this.getValue()))
    this.editorModel_.setInputValue(this.key_, this.getValue());
};


/**
 * @param {anychart.chartEditor2Module.EditorModel} model
 * @param {anychart.chartEditor2Module.EditorModel.Key} key
 * @param {?{Object}=} opt_chart
 */
anychart.chartEditor2Module.controls.Input.prototype.setEditorModel = function(model, key, opt_chart) {
  this.editorModel_ = model;
  this.key_ = key;
  if (opt_chart) {
    var stringKey = anychart.chartEditor2Module.EditorModel.getStringKey(key);
    var value = anychart.bindingModule.exec(opt_chart, stringKey);
    this.setValue(value);
    this.editorModel_.setInputValue(this.key_, value, true);
  }
};


anychart.chartEditor2Module.controls.Input.prototype.resetEditorModel = function() {
  if (this.editorModel_ && this.key_)
    this.editorModel_.removeByKey(this.key_);
};
