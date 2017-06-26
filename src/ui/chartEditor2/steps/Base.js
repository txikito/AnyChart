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
 * Step index attribute.
 * @private
 */
anychart.ui.chartEditor2.steps.Base.STEP_DATA_ATTRIBUTE_ = 'data-index';


/**
 * @return {string}
 */
anychart.ui.chartEditor2.steps.Base.prototype.getName = function() {
  return this.name_;
};


/**
 * @param {string} value
 */
anychart.ui.chartEditor2.steps.Base.prototype.setName = function(value) {
  this.name_ = value;
};


/**
 * @return {string}
 */
anychart.ui.chartEditor2.steps.Base.prototype.getTitle = function() {
  return this.title_;
};


/**
 * @returns {number}
 */
anychart.ui.chartEditor2.steps.Base.prototype.getIndex = function() {
  return this.index_;
};


/**
 * @param {string} value
 */
anychart.ui.chartEditor2.steps.Base.prototype.setTitle = function(value) {
  this.title_ = value;
};


/**
 * Enable transition to next step.
 * @param {boolean} value
 */
anychart.ui.chartEditor2.steps.Base.prototype.enableNextStep = function(value) {
  this.enableNextStep_ = value;

  if (this.isInDocument()) {
    this.nextBtn_.setEnabled(this.enableNextStep_);
  }
};


/**
 * Returns the content element.
 * @return {Element}
 */
anychart.ui.chartEditor2.steps.Base.prototype.getContentElement = function() {
  return this.contentEl_;
};


/**
 * Returns the progress element.
 * @return {Element}
 */
anychart.ui.chartEditor2.steps.Base.prototype.getProgressElement = function() {
  return this.progressEl_;
};


/** @override */
anychart.ui.chartEditor2.steps.Base.prototype.createDom = function() {
  anychart.ui.chartEditor2.steps.Base.base(this, 'createDom');
  var element = /** @type {Element} */(this.getElement());
  var dom = this.getDomHelper();

  var className = anychart.ui.chartEditor2.steps.Base.CSS_CLASS;
  goog.dom.classlist.add(element, className);

  var nextBtnClass = goog.getCssName(className, 'next-button');
  var previousBtnClass = goog.getCssName(className, 'previous-button');
  var progressItemListClass = goog.getCssName(className, 'progress-item-list');

  // this.progressEl_ = dom.createDom(
  //     goog.dom.TagName.DIV,
  //     goog.getCssName(className, 'progress'),
  //     this.progressListEl_ = dom.createDom(
  //         goog.dom.TagName.DIV,
  //         progressItemListClass));
  // goog.a11y.aria.setRole(this.progressListEl_, goog.a11y.aria.Role.LIST);

  // this.nextBtn_ = new anychart.ui.button.Primary();
  // this.nextBtn_.addClassName(nextBtnClass);
  // // if (this.sharedModel_.currentStep.isLastStep) {
  // //   this.nextBtn_.setCaption('Complete');
  // // } else {
  //   this.nextBtn_.setCaption('Next');
  // // }
  // this.nextBtn_.render(this.progressEl_);
  //
  // this.prevBtn_ = new anychart.ui.button.Secondary();
  // this.prevBtn_.addClassName(previousBtnClass);
  // this.prevBtn_.setCaption('Previous');
  // // if (!this.sharedModel_.currentStep.index) {
  // //   this.prevBtn_.setState(goog.ui.Component.State.DISABLED, true);
  // // }
  // this.prevBtn_.render(this.progressEl_);
  //
  // this.contentWrapperEl_ = dom.createDom(
  //     goog.dom.TagName.DIV,
  //     goog.getCssName(className, 'content-wrapper'),
  //     this.contentEl_ = dom.createDom(
  //         goog.dom.TagName.DIV, goog.getCssName(className, 'content')),
  //     this.progressEl_);
  //
  // element.appendChild(this.contentWrapperEl_);
};


/**
 * Update step view.
 */
anychart.ui.chartEditor2.steps.Base.prototype.update = function() {};


/**
 * Change step.
 * @param {!goog.events.Event} e
 * @private
 */
anychart.ui.chartEditor2.steps.Base.prototype.stepListClickHandler_ = function(e) {
  var className = anychart.ui.chartEditor2.steps.Base.CSS_CLASS;
  var contentClass = goog.getCssName(className, 'progress-item-content');
  var element = /** @type {Element} */(e.target);
  var parentElement = goog.dom.getParentElement(element);

  if (goog.dom.classlist.contains(element, contentClass)) {
    if (goog.dom.classlist.contains(parentElement, goog.getCssName('anychart-disabled'))) return;

    var newStepIndex = Number(element.getAttribute(anychart.ui.chartEditor2.steps.Base.STEP_DATA_ATTRIBUTE_));
    var newStepDescriptor = this.sharedModel_.steps[newStepIndex];
    var currentStepIndex = this.sharedModel_.currentStep.index;

    if (newStepIndex < currentStepIndex ||
        newStepIndex == currentStepIndex + 1 ||
        newStepDescriptor.isVisited) {

      // If we transition from first step to third step (through one).
      if (newStepDescriptor.isVisited && newStepIndex == currentStepIndex + 2) {
        this.updateSharedDataMappings();
        if (!this.sharedModel_.dataMappings.length) return;
      }

      this.dispatchEvent({
        type: anychart.ui.chartEditor2.events.EventType.CHANGE_STEP,
        stepIndex: newStepIndex
      });
    }
  }
};


/** @override */
anychart.ui.chartEditor2.steps.Base.prototype.enterDocument = function() {
  anychart.ui.chartEditor2.steps.Base.base(this, 'enterDocument');

  var handler = this.getHandler();
  // handler.listen(this.asideEl_, goog.events.EventType.WHEEL, this.handleWheel);

  //this.nextBtn_.setEnabled(this.enableNextStep_);

  //handler.listen(this.progressListEl_, goog.events.EventType.CLICK, this.stepListClickHandler_);
  // handler.listen(this.nextBtn_,
  //     goog.ui.Component.EventType.ACTION,
  //     function() {
  //       if (this.sharedModel_.currentStep.isLastStep) {
  //         this.dispatchEvent(anychart.enums.EventType.COMPLETE);
  //       } else {
  //         this.dispatchEvent({
  //           type: anychart.ui.chartEditor2.events.EventType.CHANGE_STEP,
  //           stepIndex: this.sharedModel_.currentStep.index + 1
  //         });
  //       }
  //     });
  // handler.listen(this.prevBtn_,
  //     goog.ui.Component.EventType.ACTION,
  //     function() {
  //       if (this.sharedModel_.currentStep.index > 0) {
  //         this.dispatchEvent({
  //           type: anychart.ui.chartEditor2.events.EventType.CHANGE_STEP,
  //           stepIndex: this.sharedModel_.currentStep.index - 1
  //         });
  //       }
  //     });
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
anychart.ui.chartEditor2.steps.Base.prototype.handleWheel = function(e) {
  var element = e.currentTarget;
  var originalEvent = e.getBrowserEvent();
  var delta = originalEvent.deltaY || originalEvent.detail || originalEvent.wheelDelta;

  if (delta < 0 && !element.scrollTop) {
    e.preventDefault();
  }

  if (delta > 0 && element.scrollHeight - element.clientHeight - element.scrollTop <= 1) {
    e.preventDefault();
  }
};
