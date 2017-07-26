goog.provide('anychart.chartEditor2Module.controls.Select');

goog.require('goog.ui.Select');



/**
 * Overrides control to work with EditorModel.
 * @constructor
 * @extends {goog.ui.Select}
 */
anychart.chartEditor2Module.controls.Select = function(opt_caption, opt_menu, opt_renderer, opt_domHelper, opt_menuRenderer) {
  anychart.chartEditor2Module.controls.Select.base(this, 'constructor', opt_caption, opt_menu, opt_renderer, opt_domHelper, opt_menuRenderer);

  this.options_ = [];
};
goog.inherits(anychart.chartEditor2Module.controls.Select, goog.ui.Select);


anychart.chartEditor2Module.controls.Select.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.listen(goog.ui.Component.EventType.CHANGE, this.onChange_);
};


anychart.chartEditor2Module.controls.Select.prototype.onChange_ = function(evt) {
  if (goog.isDefAndNotNull(this.getValue()))
    this.editorModel_.setInputValue(this.key_, this.getValue());
};


/**
 *
 * @param {anychart.chartEditor2Module.EditorModel} model
 * @param {anychart.chartEditor2Module.EditorModel.Key} key
 */
anychart.chartEditor2Module.controls.Select.prototype.setEditorModel = function(model, key) {
  this.editorModel_ = model;
  this.key_ = key;
};


anychart.chartEditor2Module.controls.Select.prototype.resetEditorModel = function() {
  if (this.editorModel_ && this.key_)
    this.editorModel_.removeByKey(this.key_);

  this.setSelectedIndex(-1);
};


anychart.chartEditor2Module.controls.Select.prototype.setSelectedByModel = function() {
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


anychart.chartEditor2Module.controls.Select.prototype.setSelectedDefault = function() {
  this.setSelectedIndex(0);
};