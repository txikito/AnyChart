goog.provide('anychart.chartEditor2Module.controls.Input');

goog.require('anychart.chartEditor2Module.Chart');
goog.require('goog.events.InputHandler');
goog.require('goog.ui.BidiInput');



/**
 * Extends standard control to work with EditorModel.
 * 
 * @param {goog.dom.DomHelper=} opt_domHelper  Optional DOM helper.
 * 
 * @constructor
 * @extends {goog.ui.BidiInput}
 */
anychart.chartEditor2Module.controls.Input = function(opt_domHelper) {
  anychart.chartEditor2Module.controls.Input.base(this, 'constructor', opt_domHelper);

  /**
   * @type {boolean}
   * @protected
   */
  this.noDispatch = false;

  /**
   * @type {boolean}
   * @protected
   */
  this.noRebuild = false;
};
goog.inherits(anychart.chartEditor2Module.controls.Input, goog.ui.BidiInput);


/** @inheritDoc */
anychart.chartEditor2Module.controls.Input.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.customInputHandler_ = new goog.events.InputHandler(this.getElement());
  goog.events.listen(
      this.customInputHandler_, goog.events.InputHandler.EventType.INPUT,
      this.onChange, false, this);
};


/** @override */
anychart.chartEditor2Module.controls.Input.prototype.disposeInternal = function() {
  if (this.customInputHandler_) {
    goog.events.removeAll(this.customInputHandler_);
    this.customInputHandler_.dispose();
    this.customInputHandler_ = null;
    anychart.chartEditor2Module.controls.Input.superClass_.disposeInternal.call(this);
  }
};


/**
 * Updates EditorModel's state on value change.
 */
anychart.chartEditor2Module.controls.Input.prototype.onChange = function() {
  if (!this.noDispatch && this.editorModel) {
    if (this.callback)
      this.editorModel.callbackByString(this.callback, this);
    else
      this.editorModel.setValue(this.key, this.getValue(), false, this.noRebuild);
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
anychart.chartEditor2Module.controls.Input.prototype.setEditorModel = function(model, key, opt_callback, opt_target, opt_noRebuild) {
  this.editorModel = model;
  this.key = key;
  this.callback = opt_callback;
  this.noRebuild = !!opt_noRebuild;

  if (opt_target) {
    var stringKey = anychart.chartEditor2Module.EditorModel.getStringKey(key);
    var value = /** @type {string} */(anychart.bindingModule.exec(opt_target, stringKey));
    this.noDispatch = true;
    this.setValue(value);
    this.editorModel.setValue(this.key, value, true);
    this.noDispatch = false;
  }
};


/**
 * @return {anychart.chartEditor2Module.EditorModel.Key}
 */
anychart.chartEditor2Module.controls.Input.prototype.getKey = function() {
  return this.key;
};
