goog.provide('anychart.ui.Editor2');
goog.provide('anychart.ui.Editor2.Dialog');

goog.require('anychart.ui.Component');
goog.require('anychart.ui.Preloader');
goog.require('anychart.ui.chartEditor2.DataModel');
goog.require('anychart.ui.chartEditor2.events');
goog.require('anychart.ui.chartEditor2.steps.PrepareData');
goog.require('anychart.ui.chartEditor2.steps.SetupChart');
goog.require('goog.fx.AnimationSerialQueue');
goog.require('goog.fx.Transition.EventType');
goog.require('goog.fx.dom');
goog.require('goog.net.ImageLoader');
goog.require('goog.ui.Dialog');



/**
 * Chart Editor Component Class.
 * @constructor
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper; see {@link goog.ui.Component} for semantics.
 * @extends {anychart.ui.Component}
 */
anychart.ui.Editor2 = function(opt_domHelper) {
  anychart.ui.Editor2.base(this, 'constructor', opt_domHelper);

  /**
   * @type {?goog.ui.Dialog}
   * @private
   */
  this.dialog_ = null;

  /**
   * @type {Element}
   * @private
   */
  this.progressEl_ = null;

  /**
   * Current step.
   * @type {anychart.ui.chartEditor2.steps.Base}
   * @private
   */
  this.currentStep_ = null;

  /**
   * @type {Array<anychart.ui.chartEditor2.steps.Base>}
   * @private
   */
  this.steps_ = [];
  
  this.dataModel_ = new anychart.ui.chartEditor2.DataModel();

  //this.editorModel_ = null;

  //this.controller_ = new anychart.ui.chartEditor.Controller(this);

  this.imagesLoaded_ = true;
  this.preloader_ = new anychart.ui.Preloader();
  // var imageLoader = new goog.net.ImageLoader();
  // this.registerDisposable(imageLoader);
  // goog.events.listen(imageLoader, goog.net.EventType.COMPLETE, function() {
  //   this.imagesLoaded_ = true;
  //   this.preloader_.visible(false);
  // }, false, this);
  // goog.array.forEach(this.sharedModel_.presetsList, function(category) {
  //   goog.array.forEach(category.list, function(chart) {
  //     imageLoader.addImage(chart.type, 'https://cdn.anychart.com/images/chartopedia/' + chart.image);
  //   });
  // });
  //imageLoader.start();

  goog.events.listen(this, anychart.enums.EventType.COMPLETE, this.onComplete_, false, this);
  this.listen(anychart.ui.chartEditor2.events.EventType.ADD_DATA, this.onAddData_);
  this.listen(anychart.ui.chartEditor2.events.EventType.REMOVE_DATA, this.onRemoveData_);
};
goog.inherits(anychart.ui.Editor2, anychart.ui.Component);


/**
 * CSS class name.
 * @type {string}
 */
anychart.ui.Editor2.CSS_CLASS = goog.getCssName('anychart-chart-editor');


/** @inheritDoc */
anychart.ui.Editor2.prototype.render = function(opt_parentElement) {
  anychart.ui.Editor2.base(this, 'render', opt_parentElement);
  this.showPreloader_();
};


/** @inheritDoc */
anychart.ui.Editor2.prototype.decorate = function(element) {
  anychart.ui.Editor2.base(this, 'decorate', element);
  this.showPreloader_();
};


/**
 * Renders the Chart Editor as modal dialog.
 * @param {string=} opt_class CSS class name for the dialog element, also used
 *     as a class name prefix for related elements; defaults to modal-dialog.
 *     This should be a single, valid CSS class name.
 * @param {boolean=} opt_useIframeMask Work around windowed controls z-index
 *     issue by using an iframe instead of a div for bg element.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper; see {@link goog.ui.Component} for semantics.
 */
anychart.ui.Editor2.prototype.renderAsDialog = function(opt_class, opt_useIframeMask, opt_domHelper) {
  this.dialog_ = new anychart.ui.Editor2.Dialog(opt_class, opt_useIframeMask, opt_domHelper);
  this.dialog_.addChild(this, true);
};


/**
 * Sets the visibility of the dialog box and moves focus to the
 * default button. Lazily renders the component if needed.
 * @param {boolean=} opt_value Whether the dialog should be visible.
 * @return {boolean|!anychart.ui.Editor2}
 */
anychart.ui.Editor2.prototype.visible = function(opt_value) {
  if (!this.dialog_) return true;

  if (goog.isDef(opt_value)) {
    this.dialog_.setVisible(opt_value);
    this.showPreloader_();
    return this;
  }

  return this.dialog_.isVisible();
};


/**
 * Check if images are not fully loaded and shows preloader if need.
 * @private
 */
anychart.ui.Editor2.prototype.showPreloader_ = function() {
  if (!this.imagesLoaded_) {
    var element = this.getContentElement();
    this.preloader_.render(element);
    this.preloader_.visible(true);
  }
};


/**
 * Close dialog (if exists) on complete button press.
 * @private
 */
anychart.ui.Editor2.prototype.onComplete_ = function() {
  if (this.dialog_)
    this.dialog_.setVisible(false);
};


/** @override */
anychart.ui.Editor2.prototype.createDom = function() {
  if(!this.element_) anychart.ui.Editor2.base(this, 'createDom');

  var dom = this.getDomHelper();
  goog.dom.classlist.add(this.element_, anychart.ui.Editor2.CSS_CLASS);

  // Create progress element
  this.breadcrumbsEl_ = dom.createDom(goog.dom.TagName.DIV, 'breadcrumbs');
  this.progressEl_ = dom.createDom(goog.dom.TagName.DIV, 'progress', this.breadcrumbsEl_);
  goog.a11y.aria.setRole(this.breadcrumbsEl_, goog.a11y.aria.Role.LIST);

  this.nextBtn_ = new anychart.ui.button.Primary();
  this.nextBtn_.addClassName('next-button');
  this.nextBtn_.render(this.progressEl_);

  this.prevBtn_ = new anychart.ui.button.Secondary();
  this.prevBtn_.addClassName('previous-button');
  this.prevBtn_.setCaption('Previous');
  this.prevBtn_.render(this.progressEl_);

  this.element_.appendChild(this.progressEl_);

  // Add steps
  this.steps_.push(new anychart.ui.chartEditor2.steps.PrepareData(0));
  this.steps_.push(new anychart.ui.chartEditor2.steps.SetupChart(1));
  for (var i = 0; i < this.steps_.length; i++) {
    this.addChildAt(this.steps_[i], i);
  }
};


/** @override */
anychart.ui.Editor2.prototype.enterDocument = function() {
  if(!this.breadcrumbsEl_) this.createDom();

  anychart.ui.Editor2.base(this, 'enterDocument');
  var handler = this.getHandler();
  handler.listen(this.breadcrumbsEl_, goog.events.EventType.CLICK, this.breadcrumbsClickHandler_);
  handler.listen(this.nextBtn_, goog.ui.Component.EventType.ACTION, this.nextBtnClickHandler_);
  handler.listen(this.prevBtn_, goog.ui.Component.EventType.ACTION, this.prevBtnClickHandler_);

  this.setCurrentStepByIndex_(0, false);
};



/**
 * Render progress list.
 * @private
 */
anychart.ui.Editor2.prototype.updateProgress_ = function() {
  var dom = this.getDomHelper();

  if(this.breadcrumbsEl_)
    dom.removeChildren(this.breadcrumbsEl_);

  // Building breadcrumbs elements
  var step;
  for (var i = 0; i < this.steps_.length; i++) {
    step = this.steps_[i];

    var progressContentEl = dom.createDom(goog.dom.TagName.DIV, 'item-content', step.name());
    goog.dom.setFocusableTabIndex(progressContentEl, true);
    goog.a11y.aria.setRole(progressContentEl, goog.a11y.aria.Role.LINK);
    goog.a11y.aria.setLabel(progressContentEl, step.name());
    progressContentEl.setAttribute('data-step-index', String(step.getIndex()));

    var progressArrowEl = null;
    if(i < this.steps_.length - 1) {
      progressArrowEl = dom.createDom(goog.dom.TagName.DIV, 'item-arrow');
      progressArrowEl.innerHTML = '&rarr;';
    }

    var itemEl = dom.createDom(goog.dom.TagName.DIV, 'item', progressContentEl, progressArrowEl);
    goog.a11y.aria.setRole(itemEl, goog.a11y.aria.Role.LISTITEM);

    // Set state class.
    if (step == this.currentStep_) {
      goog.dom.classlist.add(itemEl, goog.getCssName('active'));

    } else if (step.getIndex() < this.currentStep_.getIndex()) {
      goog.dom.classlist.add(itemEl, goog.getCssName('item', 'passed'));

    }/* else if (step.getIndex() > this.sharedModel_.currentStep.index + 1 && !step.isVisited) {
      goog.dom.classlist.add(itemEl, goog.getCssName('disabled'));
    }*/

    // if (!this.enableNextStep_ && step.index == this.sharedModel_.currentStep.index + 1) {
    //   goog.dom.classlist.enable(itemEl, goog.getCssName('disabled'), !this.enableNextStep_);
    // }

    this.breadcrumbsEl_.appendChild(itemEl);
  }

  this.nextBtn_.setCaption(this.isLastStep_() ? 'Complete' : 'Next');

  if (this.currentStep_.getIndex() == 0) {
    this.prevBtn_.setState(goog.ui.Component.State.DISABLED, true);
  } else {
    this.prevBtn_.setState(goog.ui.Component.State.DISABLED, false);
  }
};


/**
 * @return {boolean}
 * @private
 */
anychart.ui.Editor2.prototype.isLastStep_ = function() {
  return this.currentStep_.getIndex() == this.steps_.length - 1;
};


/**
 * @param {number} stepIndex
 * @private
 */
anychart.ui.Editor2.prototype.changeStep_ = function(stepIndex) {
  if (stepIndex != this.currentStep_.getIndex()) {
    this.setCurrentStepByIndex_(stepIndex, true);
    // this.currentStep_.update();
  }
};


/**
 * Remove step from DOM.
 * @param {anychart.ui.chartEditor.steps.Base} step
 * @private
 */
anychart.ui.Editor2.prototype.removeStep_ = function(step) {
  // Remove the child component's DOM from the document.  We have to call
  // exitDocument first (see documentation).
  step.exitDocument();
  goog.dom.removeNode(step.getElement());
};


/**
 * Render the given step.
 * @param {anychart.ui.chartEditor2.steps.Base} step
 * @param {boolean} doAnimation
 * @private
 */
anychart.ui.Editor2.prototype.setCurrentStep_ = function(step, doAnimation) {
  if (!this.isInDocument() || !step || step.isInDocument()) return;

  var editor = this;
  var animationSpeed = 150;
  if (this.currentStep_) {
    if (doAnimation) {
      var removeAnimation = new goog.fx.AnimationSerialQueue();
      removeAnimation.add(new goog.fx.dom.FadeOut(this.currentStep_.getElement(), animationSpeed));
      goog.events.listenOnce(
          removeAnimation,
          goog.fx.Transition.EventType.END,
          goog.bind(this.removeStep_, this, this.currentStep_));
      removeAnimation.play();
    } else {
      this.removeStep_(this.currentStep_);
    }
  }

  step.render(this.getContentElement());
  //step.setParentEventTarget(this);

  var appearAnimation = new goog.fx.AnimationSerialQueue();
  appearAnimation.add(new goog.fx.dom.FadeIn(step.getElement(), animationSpeed));
  goog.events.listenOnce(
      appearAnimation,
      goog.fx.Transition.EventType.END,
      function() {
        editor.dispatchEvent({
          type: anychart.ui.chartEditor2.events.EventType.CHANGE_STEP
        });
      });
  appearAnimation.play();

  this.currentStep_ = step;

  this.updateProgress_();
};


/**
 * Render the step at the given index.
 * @param {number} index Index of the step to render (-1 to render none).
 * @param {boolean} doAnimation
 * @private
 */
anychart.ui.Editor2.prototype.setCurrentStepByIndex_ = function(index, doAnimation) {
  this.setCurrentStep_(this.steps_[index], doAnimation);
};


/**
 * Enable transition to next step.
 * @param {boolean} value
 */
anychart.ui.Editor2.prototype.enableNextStep = function(value) {
  this.enableNextStep_ = value;

  if (this.isInDocument()) {
    this.nextBtn_.setEnabled(this.enableNextStep_);
  }
};


/**
 * Change step.
 * @param {!goog.events.Event} e
 * @private
 */
anychart.ui.Editor2.prototype.breadcrumbsClickHandler_ = function(e) {
  var element = /** @type {Element} */(e.target);

  if (goog.dom.classlist.contains(element, 'item-content')) {
    var itemEl = goog.dom.getParentElement(element);
    if (goog.dom.classlist.contains(itemEl, goog.getCssName('disabled'))) return;

    var newStepIndex = Number(element.getAttribute('data-step-index'));
    this.changeStep_(newStepIndex);
  }
};


anychart.ui.Editor2.prototype.prevBtnClickHandler_ = function() {
  this.changeStep_(this.currentStep_.getIndex() - 1);
};


anychart.ui.Editor2.prototype.nextBtnClickHandler_ = function() {
  if (this.isLastStep_())
    console.log("Complete pressed!");
  else
    this.changeStep_(this.currentStep_.getIndex() + 1);
};


anychart.ui.Editor2.prototype.getDataModel = function() {
  return this.dataModel_;
};


anychart.ui.Editor2.prototype.onAddData_ = function(evt) {
  this.dataModel_.addData(evt['setId'], evt['data'], evt['isGeo']);
};


anychart.ui.Editor2.prototype.onRemoveData_ = function(evt) {
  this.dataModel_.removeData(evt['setId'], evt['isGeo']);
};


/** @override */
anychart.ui.Editor2.prototype.disposeInternal = function() {
  this.currentStep_ = null;
  //this.controller_ = null;
  //this.sharedModel_.dataSets.length = 0;
  //this.sharedModel_ = null;
  anychart.ui.Editor2.base(this, 'disposeInternal');
};


// region Editor.Dialog
/**
 * @constructor
 * @param {string=} opt_class CSS class name for the dialog element, also used
 *     as a class name prefix for related elements; defaults to modal-dialog.
 *     This should be a single, valid CSS class name.
 * @param {boolean=} opt_useIframeMask Work around windowed controls z-index
 *     issue by using an iframe instead of a div for bg element.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper; see {@link
 *     goog.ui.Component} for semantics.
 * @extends {goog.ui.Dialog}
 */
anychart.ui.Editor2.Dialog = function(opt_class, opt_useIframeMask, opt_domHelper) {
  anychart.ui.Editor2.Dialog.base(this, 'constructor', opt_class || goog.getCssName('anychart-chart-editor-dialog'), opt_useIframeMask, opt_domHelper);

  /**
   * Element for the logo of the title bar.
   * @type {Element}
   * @private
   */
  this.titleLogoEl_ = null;

  this.setTitle('Chart Editor');
  this.setButtonSet(null);
};
goog.inherits(anychart.ui.Editor2.Dialog, goog.ui.Dialog);


/** @override */
anychart.ui.Editor2.Dialog.prototype.createDom = function() {
  anychart.ui.Editor2.Dialog.base(this, 'createDom');
  this.initTitleElements_();
};


/** @override */
anychart.ui.Editor2.Dialog.prototype.decorateInternal = function(element) {
  anychart.ui.Editor2.Dialog.base(this, 'decorateInternal', element);
  this.initTitleElements_();
};


/** @private */
anychart.ui.Editor2.Dialog.prototype.initTitleElements_ = function() {
  var dom = this.getDomHelper();

  var titleElement = this.getTitleElement();
  this.titleLogoEl_ = dom.createDom(
      goog.dom.TagName.A,
      {'class': goog.getCssName(this.getCssClass(), 'title-logo'), 'href': 'https://anychart.com', 'target': '_blank'});
  goog.dom.insertSiblingBefore(this.titleLogoEl_, goog.dom.getFirstElementChild(titleElement));

  this.setTitle('Chart Editor');

  var close = this.getTitleCloseElement();
  goog.dom.appendChild(close, goog.dom.createDom(goog.dom.TagName.I, ['ac', 'ac-remove']));
};


/** @override */
anychart.ui.Editor2.Dialog.prototype.enterDocument = function() {
  anychart.ui.Editor2.Dialog.base(this, 'enterDocument');
  var bgEl = this.getBackgroundElement();
  if (bgEl)
    this.getHandler().listen(bgEl, goog.events.EventType.CLICK, this.onBackgroundClick_);
};


/** @override */
anychart.ui.Editor2.Dialog.prototype.disposeInternal = function() {
  this.titleLogoEl_ = null;
  anychart.ui.Editor2.Dialog.base(this, 'disposeInternal');
};


/** @private */
anychart.ui.Editor2.Dialog.prototype.onBackgroundClick_ = function() {
  this.setVisible(false);
};
// endregion


/**
 * Constructor function for Chart Editor.
 * @return {anychart.ui.Editor2}
 */
anychart.ui.editor2 = function() {
  return new anychart.ui.Editor2();
};

//exports
(function() {
  // var proto = anychart.ui.Editor.prototype;
  // goog.exportSymbol('anychart.ui.editor', anychart.ui.editor);
  // proto['data'] = proto.data;
  // proto['render'] = proto.render;
  // proto['decorate'] = proto.decorate;
  // proto['renderAsDialog'] = proto.renderAsDialog;
  // proto['visible'] = proto.visible;
  // proto['listen'] = proto.listen;
  // proto['listenOnce'] = proto.listenOnce;
  // proto['unlisten'] = proto.unlisten;
  // proto['unlistenByKey'] = proto.unlistenByKey;
  // proto['removeAllListeners'] = proto.removeAllListeners;
  // proto['dispose'] = proto.dispose;
  // proto['getResultJson'] = proto.getResultJson;
  // proto['getResultXml'] = proto.getResultXml;
  // proto['getResultCode'] = proto.getResultCode;
})();
