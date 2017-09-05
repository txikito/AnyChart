goog.provide('anychart.chartEditor2Module.controls.Checkbox');

goog.require('anychart.chartEditor2Module.Chart');
goog.require('goog.ui.Checkbox');



/**
 * Extends control to work with EditorModel.
 * 
 * @param {goog.ui.Checkbox.State=} opt_checked Checked state to set.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
 *     document interaction.
 * @param {goog.ui.CheckboxRenderer=} opt_renderer Renderer used to render or
 *     decorate the checkbox; defaults to {@link goog.ui.CheckboxRenderer}.
 *
 * @constructor
 * @extends {goog.ui.Checkbox}
 */
anychart.chartEditor2Module.controls.Checkbox = function(opt_checked, opt_domHelper, opt_renderer) {
  anychart.chartEditor2Module.controls.Checkbox.base(this, 'constructor', opt_checked, opt_domHelper, opt_renderer);
  this.noDispatch = false;
  this.noRebuild = false;
};
goog.inherits(anychart.chartEditor2Module.controls.Checkbox, goog.ui.Checkbox);


/** @inheritDoc */
anychart.chartEditor2Module.controls.Checkbox.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.listen(goog.ui.Component.EventType.CHANGE, this.onChange);
};


/**
 * Updates EditorModel's state on value change.
 */
anychart.chartEditor2Module.controls.Checkbox.prototype.onChange = function() {
  if (!this.noDispatch && this.editorModel) {
    if (this.callback)
      this.editorModel[this.callback].call(this.editorModel, this);
    else
      this.editorModel.setValue(this.key, this.getChecked(), false, this.noRebuild);
  }
};


/**
 * Connects control with EditorMode.
 *
 * @param {anychart.chartEditor2Module.EditorModel} model
 * @param {anychart.chartEditor2Module.EditorModel.Key} key
 * @param {string=} opt_callback
 * @param {?Object=} opt_target
 * @param {boolean=} opt_noRebuild
 */
anychart.chartEditor2Module.controls.Checkbox.prototype.setEditorModel = function(model, key, opt_callback, opt_target, opt_noRebuild) {
  this.editorModel = model;
  this.key = key;
  this.callback = opt_callback;
  this.noRebuild = !!opt_noRebuild;

  if (opt_target) {
    var stringKey = anychart.chartEditor2Module.EditorModel.getStringKey(key);
    var value = !!(/** @type {string|boolean} */(anychart.bindingModule.exec(opt_target, stringKey)));
    this.noDispatch = true;
    this.setChecked(value);
    this.editorModel.setValue(this.key, value, true);
    this.noDispatch = false;
  }
};


/**
 * @return {anychart.chartEditor2Module.EditorModel.Key}
 */
anychart.chartEditor2Module.controls.Checkbox.prototype.getKey = function() {
  return this.key;
};
