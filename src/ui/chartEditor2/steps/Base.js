goog.provide('anychart.ui.chartEditor2.steps.Base');

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
 * @constructor
 * @param {number} index Step index
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @extends {anychart.ui.Component}
 */
anychart.ui.chartEditor2.steps.Base = function(index, opt_domHelper) {
  anychart.ui.chartEditor2.steps.Base.base(this, 'constructor', opt_domHelper);

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
   * @type {Element}
   * @private
   */
  this.contentEl_ = null;

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
goog.inherits(anychart.ui.chartEditor2.steps.Base, anychart.ui.Component);


/**
 * CSS class name.
 * @type {string}
 */
anychart.ui.chartEditor2.steps.Base.CSS_CLASS = goog.getCssName('anychart-chart-editor-step');


/**
 * Getter/setter for step name.
 * @param {string=} opt_value
 * @return {string|anychart.ui.chartEditor2.steps.Base}
 */
anychart.ui.chartEditor2.steps.Base.prototype.name = function(opt_value) {
  if (opt_value) {
    this.name_ = opt_value;
    return this;
  }
  return this.name_;
};


/**
 * Getter/setter for step title.
 * @param {string=} opt_value
 * @return {string|anychart.ui.chartEditor2.steps.Base}
 */
anychart.ui.chartEditor2.steps.Base.prototype.title = function(opt_value) {
  if (opt_value) {
    this.title_ = opt_value;
    return this;
  }
  return this.title_;
};


/**
 * @returns {number}
 */
anychart.ui.chartEditor2.steps.Base.prototype.getIndex = function() {
  return this.index_;
};


/**
 * Returns the content element.
 * @return {Element}
 */
anychart.ui.chartEditor2.steps.Base.prototype.getContentElement = function() {
  return this.contentEl_;
};


/** @override */
anychart.ui.chartEditor2.steps.Base.prototype.createDom = function() {
  anychart.ui.chartEditor2.steps.Base.base(this, 'createDom');
  var element = /** @type {Element} */(this.getElement());
  var dom = this.getDomHelper();

  var className = anychart.ui.chartEditor2.steps.Base.CSS_CLASS;
  goog.dom.classlist.add(element, className);

  var stepTitle = dom.createDom(goog.dom.TagName.H1, goog.getCssName('step-title'), this.name_);
  this.element_.appendChild(stepTitle);

  // this.contentEl_ = dom.createDom(goog.dom.TagName.DIV, goog.getCssName(className, 'content'));
  // element.appendChild(this.contentEl_);
};


/** @override */
anychart.ui.chartEditor2.steps.Base.prototype.enterDocument = function() {
  anychart.ui.chartEditor2.steps.Base.base(this, 'enterDocument');
};


/** @override */
anychart.ui.chartEditor2.steps.Base.prototype.exitDocument = function() {
  anychart.ui.chartEditor2.steps.Base.base(this, 'exitDocument');
};


/** @override */
anychart.ui.chartEditor2.steps.Base.prototype.disposeInternal = function() {
  anychart.ui.chartEditor2.steps.Base.base(this, 'disposeInternal');
};


/**
 * Wheel event, which is stopped.
 * @param {goog.events.BrowserEvent} e
 * @protected
 */
/*anychart.ui.chartEditor2.steps.Base.prototype.handleWheel = function(e) {
  var element = e.currentTarget;
  var originalEvent = e.getBrowserEvent();
  var delta = originalEvent.deltaY || originalEvent.detail || originalEvent.wheelDelta;

  if (delta < 0 && !element.scrollTop) {
    e.preventDefault();
  }

  if (delta > 0 && element.scrollHeight - element.clientHeight - element.scrollTop <= 1) {
    e.preventDefault();
  }
};*/

/**
 * Update step view.
 */
anychart.ui.chartEditor2.steps.Base.prototype.update = function() {};
