goog.provide('anychart.chartEditor2Module.steps.Base');

goog.require('anychart.ui.Component');
goog.require('anychart.ui.button.Primary');
goog.require('anychart.ui.button.Secondary');
goog.require('goog.a11y.aria');
goog.require('goog.a11y.aria.Role');
goog.require('goog.dom');
goog.require('goog.dom.classlist');

goog.forwardDeclare('anychart.data.Mapping');
goog.forwardDeclare('anychart.data.Set');



/**
 * Chart Editor Step Class.
 *
 * @param {number} index Step index
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @constructor
 * @extends {anychart.ui.Component}
 */
anychart.chartEditor2Module.steps.Base = function(index, opt_domHelper) {
  goog.base(this, opt_domHelper);

  /**
   * @type {string}
   * @private
   */
  this.name_ = 'step';

  /**
   * @type {string}
   * @private
   */
  this.title_ = 'Step';

  /**
   * Enabled transition to next step.
   * @type {boolean}
   * @private
   */
  this.enableNextStep_ = true;

  /**
   * @type {number}
   * @private
   */
  this.index_ = index;
};
goog.inherits(anychart.chartEditor2Module.steps.Base, anychart.ui.Component);


/**
 * CSS class name.
 * @type {string}
 */
anychart.chartEditor2Module.steps.Base.CSS_CLASS = goog.getCssName('anychart-chart-editor-step');


/**
 * Getter/setter for step name.
 * @param {string=} opt_value
 * @return {string|anychart.chartEditor2Module.steps.Base}
 */
anychart.chartEditor2Module.steps.Base.prototype.name = function(opt_value) {
  if (opt_value) {
    this.name_ = opt_value;
    return this;
  }
  return this.name_;
};


/**
 * Getter/setter for step title.
 * @param {string=} opt_value
 * @return {string|anychart.chartEditor2Module.steps.Base}
 */
anychart.chartEditor2Module.steps.Base.prototype.title = function(opt_value) {
  if (opt_value) {
    this.title_ = opt_value;
    return this;
  }
  return this.title_;
};


/**
 * @returns {number}
 */
anychart.chartEditor2Module.steps.Base.prototype.getIndex = function() {
  return this.index_;
};


/** @override */
anychart.chartEditor2Module.steps.Base.prototype.createDom = function() {
  goog.base(this, 'createDom');

  var element = /** @type {Element} */(this.getElement());
  goog.dom.classlist.add(element, anychart.chartEditor2Module.steps.Base.CSS_CLASS);
};
