goog.provide('anychart.chartEditor2Module.controls.Select');

goog.require('goog.ui.Select');


/**
 * Overrides control to work with EditorModel.
 * @constructor
 * @extends {goog.ui.Select}
 */
anychart.chartEditor2Module.controls.Select = function(opt_caption, opt_menu, opt_renderer, opt_domHelper, opt_menuRenderer) {
  anychart.chartEditor2Module.controls.Select.base(this, 'constructor', opt_caption, opt_menu, opt_renderer, opt_domHelper, opt_menuRenderer);
};
goog.inherits(anychart.chartEditor2Module.controls.Select, goog.ui.Select);


anychart.chartEditor2Module.controls.Select.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.listen(goog.ui.Component.EventType.CHANGE, this.onChange);
};


anychart.chartEditor2Module.controls.Select.prototype.onChange = function(evt) {
  if (this.editorModel_ && goog.isDefAndNotNull(this.getValue())) {
    if (this.callback_)
      this.editorModel_[this.callback_].call(this.editorModel_, this.getValue());
    else
      this.editorModel_.setModelValue(this.key_, this.getValue());
  }
};


/**
 *
 * @param {anychart.chartEditor2Module.EditorModel} model
 * @param {anychart.chartEditor2Module.EditorModel.Key} key
 * @param {String=} opt_callback
 * @param {?{Object}=} opt_target
 */
anychart.chartEditor2Module.controls.Select.prototype.setEditorModel = function(model, key, opt_callback, opt_target) {
  this.editorModel_ = model;
  this.key_ = key;
  this.callback_ = opt_callback;
  if (opt_target) {
    var stringKey = anychart.chartEditor2Module.EditorModel.getStringKey(key);
    var value = anychart.bindingModule.exec(opt_target, stringKey);
    this.setValue(value);
    this.editorModel_.setModelValue(this.key_, value, true);
  }
};


anychart.chartEditor2Module.controls.Select.prototype.setValueByModel = function() {
  var value;
  if (this.editorModel_ && this.key_)
    value = this.editorModel_.getModelValue(this.key_);

  if (goog.isDef(value)) {
    this.setValue(value);

    if (!this.getSelectedItem()) {
      this.setSelectedIndex(0);
    }
  } else
    this.setSelectedIndex(0);
};


anychart.chartEditor2Module.controls.Select.prototype.setOptions = function(options, opt_default) {
  var self = this;
  if (this.getItemCount() > 0) return;

  goog.array.forEach(options,
      function(label) {
        var item;
        if (label) {
          item = new goog.ui.MenuItem(label);
          item.setId(label);
        } else {
          item = new goog.ui.MenuSeparator();
        }
        self.addItem(item);
      });

  if (opt_default) {
    this.setValue(opt_default);
  }
};


anychart.chartEditor2Module.controls.Select.prototype.resetEditorModel = function() {
  if (this.editorModel_ && this.key_)
    this.editorModel_.removeByKey(this.key_);

  this.setSelectedIndex(-1);
};
