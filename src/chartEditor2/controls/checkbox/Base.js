goog.provide('anychart.chartEditor2Module.checkbox.Base');

goog.require('anychart.chartEditor2Module.checkbox.Renderer');
goog.require('anychart.chartEditor2Module.events');
goog.require('goog.ui.Checkbox');
goog.require('goog.ui.Checkbox.State');



/**
 * A Checkbox control.
 * @param {goog.ui.Checkbox.State=} opt_checked Checked state to set.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
 *     document interaction.
 * @param {goog.ui.CheckboxRenderer=} opt_renderer Renderer used to render or
 *     decorate the checkbox; defaults to {@link goog.ui.CheckboxRenderer}.
 * @constructor
 * @extends {goog.ui.Checkbox}
 */
anychart.chartEditor2Module.checkbox.Base = function(opt_checked, opt_domHelper, opt_renderer) {
  anychart.chartEditor2Module.checkbox.Base.base(this, 'constructor', opt_checked, opt_domHelper,
      opt_renderer || anychart.chartEditor2Module.checkbox.Renderer.getInstance());
};
goog.inherits(anychart.chartEditor2Module.checkbox.Base, goog.ui.Checkbox);


/**
 * @type {*}
 * @private
 */
anychart.chartEditor2Module.checkbox.Base.prototype.normalValue_ = '';


/** @param {*} value */
anychart.chartEditor2Module.checkbox.Base.prototype.setNormalValue = function(value) {
  this.normalValue_ = value;
};


/**
 * @type {*}
 * @private
 */
anychart.chartEditor2Module.checkbox.Base.prototype.checkedValue_ = '';


/** @param {*} value */
anychart.chartEditor2Module.checkbox.Base.prototype.setCheckedValue = function(value) {
  this.checkedValue_ = value;
};


/**
 * @type {string|Array.<string>}
 * @private
 */
anychart.chartEditor2Module.checkbox.Base.prototype.key_ = '';


/** @param {string|Array.<string>} value */
anychart.chartEditor2Module.checkbox.Base.prototype.setKey = function(value) {
  this.key_ = value;
};


/** @param {anychart.chartEditor2Module.steps.Base.Model} model */
anychart.chartEditor2Module.checkbox.Base.prototype.update = function(model) {
  var value = anychart.chartEditor2Module.Controller.getset(model, goog.isArray(this.key_) ? this.key_[0] : this.key_);
  this.setChecked(value == this.checkedValue_);
};


/** @override */
anychart.chartEditor2Module.checkbox.Base.prototype.createDom = function() {
  anychart.chartEditor2Module.checkbox.Base.base(this, 'createDom');
};


/** @override */
anychart.chartEditor2Module.checkbox.Base.prototype.enterDocument = function() {
  anychart.chartEditor2Module.checkbox.Base.base(this, 'enterDocument');
  goog.events.listen(this, goog.ui.Component.EventType.CHANGE, this.onChange_, false, this);
};


/** @inheritDoc */
anychart.chartEditor2Module.checkbox.Base.prototype.exitDocument = function() {
  goog.events.unlisten(this, goog.ui.Component.EventType.CHANGE, this.onChange_, false, this);
  anychart.chartEditor2Module.checkbox.Base.base(this, 'exitDocument');
};


/**
 * @param {goog.events.Event} evt
 * @private
 */
anychart.chartEditor2Module.checkbox.Base.prototype.onChange_ = function(evt) {
  evt.stopPropagation();

  var keys = goog.isArray(this.key_) ? this.key_ : [this.key_];
  for (var i = 0, count = keys.length; i < count; i++) {
    this.dispatchEvent({
      type: anychart.chartEditor2Module.events.EventType.CHANGE_MODEL,
      key: keys[i],
      value: this.isChecked() ?
          this.checkedValue_ :
          this.normalValue_
    });
  }
  this.dispatchEvent(anychart.chartEditor2Module.events.EventType.UPDATE_EDITOR);
};
