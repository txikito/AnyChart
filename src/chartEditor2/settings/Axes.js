goog.provide('anychart.chartEditor2Module.settings.Axes');

goog.require('anychart.chartEditor2Module.settings.Axis');

goog.require('goog.ui.Component');



/**
 * @constructor
 * @extends {goog.ui.Component}
 */
anychart.chartEditor2Module.settings.Axes = function() {
  anychart.chartEditor2Module.settings.Axes.base(this, 'constructor');

  this.enabled_ = true;
};
goog.inherits(anychart.chartEditor2Module.settings.Axes, goog.ui.Component);


/** @enum {string} */
anychart.chartEditor2Module.settings.Axes.CssClass = {};


/**
 * Container for enabled button.
 * @type {Element}
 * @private
 */
anychart.chartEditor2Module.settings.Axes.prototype.enabledButtonContainer_ = null;


/**
 * Set container for enabled button.
 * @param {Element} enabledButtonContainer
 */
anychart.chartEditor2Module.settings.Axes.prototype.setEnabledButtonContainer = function(enabledButtonContainer) {
  this.enabledButtonContainer_ = enabledButtonContainer;
};


/**
 * @type {string}
 * @private
 */
anychart.chartEditor2Module.settings.Axes.prototype.name_ = 'Axis';


/** @param {string} value */
anychart.chartEditor2Module.settings.Axes.prototype.setName = function(value) {
  this.name_ = value;
};


/**
 * @type {boolean}
 * @private
 */
anychart.chartEditor2Module.settings.Axes.prototype.showName_ = true;


/** @param {boolean} value */
anychart.chartEditor2Module.settings.Axes.prototype.showName = function(value) {
  this.showName_ = value;
};


/**
 * @type {string}
 * @private
 */
anychart.chartEditor2Module.settings.Axes.prototype.key_ = 'axis';


/** @param {string} value */
anychart.chartEditor2Module.settings.Axes.prototype.setKey = function(value) {
  if (value != this.key_) {
    this.key_ = value;
  }
};


/**
 * @type {string}
 * @private
 */
anychart.chartEditor2Module.settings.Axes.prototype.countKey_ = 'chart.getAxisCount()';


/** @param {string} value */
anychart.chartEditor2Module.settings.Axes.prototype.setCountKey = function(value) {
  this.countKey_ = value;
};


/**
 * Enables/Disables the Axes settings.
 * @param {boolean} enabled Whether to enable (true) or disable (false) the
 *     Axes settings.
 */
anychart.chartEditor2Module.settings.Axes.prototype.setEnabled = function(enabled) {
  if (enabled) {
    this.enabled_ = enabled;
  }

  this.forEachChild(function(child) {
    child.setEnabled(enabled);
  });

  if (!enabled) {
    this.enabled_ = enabled;
  }
};


/**
 * @return {boolean} Whether the Axes settings is enabled.
 */
anychart.chartEditor2Module.settings.Axes.prototype.isEnabled = function() {
  return this.enabled_;
};


/** @override */
anychart.chartEditor2Module.settings.Axes.prototype.disposeInternal = function() {
  anychart.chartEditor2Module.settings.Axes.base(this, 'disposeInternal');
};


/** @override */
anychart.chartEditor2Module.settings.Axes.prototype.createDom = function() {
  anychart.chartEditor2Module.settings.Axes.base(this, 'createDom');
};


/**
 * Update controls.
 * @param {anychart.chartEditor2Module.steps.Base.Model} model
 */
anychart.chartEditor2Module.settings.Axes.prototype.update = function(model) {
  var axesCount = anychart.chartEditor2Module.Controller.getset(model, this.countKey_);
  var count = Math.max(this.getChildCount(), Number(axesCount));

  for (var i = 0; i < count; i++) {
    var child = this.getChildAt(i);
    if (i < axesCount) {
      if (!child) {
        child = new anychart.chartEditor2Module.settings.Axis();
        child.setName(this.name_);
        child.showName(this.showName_);
        this.addChildAt(child, i, true);
      }
      child.setKey(this.key_);
      child.setIndex(i);
      child.update(model);
      goog.style.setElementShown(child.getElement(), true);
    } else {
      if (child) goog.style.setElementShown(child.getElement(), false);
    }
  }
};
