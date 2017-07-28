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
  this.listen(goog.events.EventType.INPUT, this.onChange);
};


anychart.chartEditor2Module.controls.Input.prototype.onChange = function(evt) {
  console.log("input changes");
  if (this.editorModel_ && this.key_ && goog.isDefAndNotNull(this.getValue()))
    this.editorModel_.setInputValue(this.key_, this.getValue());
};


/**
 * @param {anychart.chartEditor2Module.EditorModel} model
 * @param {anychart.chartEditor2Module.EditorModel.Key} key
 * @param {boolean=} opt_useBinding
 */
anychart.chartEditor2Module.controls.Input.prototype.setEditorModel = function(model, key, opt_useBinding) {
  this.editorModel_ = model;
  this.key_ = key;
  if (opt_useBinding) {
    var stringKey = anychart.chartEditor2Module.EditorModel.getStringKey(key);
    anychart.chartEditor2Module.Chart.bindElement(this.getElement(), stringKey);
  }
};


anychart.chartEditor2Module.controls.Input.prototype.resetEditorModel = function() {
  if (this.editorModel_ && this.key_)
    this.editorModel_.removeByKey(this.key_);
};


anychart.chartEditor2Module.controls.Input.prototype.setSelectedByModel = function() {
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


anychart.chartEditor2Module.controls.Input.prototype.setSelectedDefault = function() {
  this.setSelectedIndex(0);
};