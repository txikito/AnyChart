goog.provide('anychart.chartEditor2Module.Editor');
goog.provide('anychart.chartEditor2Module.Editor.Dialog');

goog.require('anychart.ui.Component');
goog.require('anychart.ui.Preloader');
goog.require('anychart.ui.button.Primary');
goog.require('anychart.ui.button.Secondary');
goog.require('anychart.chartEditor2Module.DataModel');
goog.require('anychart.chartEditor2Module.EditorModel');
goog.require('anychart.chartEditor2Module.events');
goog.require('anychart.chartEditor2Module.steps.PrepareData');
goog.require('anychart.chartEditor2Module.steps.SetupChart');
goog.require('goog.fx.AnimationSerialQueue');
goog.require('goog.fx.Transition.EventType');
goog.require('goog.fx.dom');
goog.require('goog.net.ImageLoader');
goog.require('goog.ui.Dialog');



/**
 * Chart Editor application Component Class.
 * @constructor
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper; see {@link goog.ui.Component} for semantics.
 * @extends {anychart.ui.Component}
 */
anychart.chartEditor2Module.Editor = function(opt_domHelper) {
  anychart.chartEditor2Module.Editor.base(this, 'constructor', opt_domHelper);

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
   * @type {anychart.chartEditor2Module.steps.Base}
   * @private
   */
  this.currentStep_ = null;

  /**
   * @type {Array<anychart.chartEditor2Module.steps.Base>}
   * @private
   */
  this.steps_ = [];

  this.dataModel_ = new anychart.chartEditor2Module.DataModel();

  this.editorModel_ = new anychart.chartEditor2Module.EditorModel();

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

  this.listen(anychart.chartEditor2Module.events.EventType.DATA_ADD, this.onDataAdd_);
  this.listen(anychart.chartEditor2Module.events.EventType.DATA_REMOVE, this.onDataRemove_);
  this.listen(anychart.chartEditor2Module.events.EventType.DATA_USE, this.onUpdateUsingState_);
};
goog.inherits(anychart.chartEditor2Module.Editor, anychart.ui.Component);


/**
 * CSS class name.
 * @type {string}
 */
anychart.chartEditor2Module.Editor.CSS_CLASS = goog.getCssName('anychart-chart-editor');


/** @inheritDoc */
anychart.chartEditor2Module.Editor.prototype.render = function(opt_parentElement) {
  anychart.chartEditor2Module.Editor.base(this, 'render', opt_parentElement);
  this.showPreloader_();
};


/** @inheritDoc */
anychart.chartEditor2Module.Editor.prototype.decorate = function(element) {
  anychart.chartEditor2Module.Editor.base(this, 'decorate', element);
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
anychart.chartEditor2Module.Editor.prototype.renderAsDialog = function(opt_class, opt_useIframeMask, opt_domHelper) {
  this.dialog_ = new anychart.chartEditor2Module.Editor.Dialog(opt_class, opt_useIframeMask, opt_domHelper);
  this.dialog_.addChild(this, true);
};


/**
 * Sets the visibility of the dialog box and moves focus to the
 * default button. Lazily renders the component if needed.
 * @param {boolean=} opt_value Whether the dialog should be visible.
 * @return {boolean|!anychart.chartEditor2Module.Editor}
 */
anychart.chartEditor2Module.Editor.prototype.visible = function(opt_value) {
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
anychart.chartEditor2Module.Editor.prototype.showPreloader_ = function() {
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
anychart.chartEditor2Module.Editor.prototype.onComplete_ = function() {
  if (this.dialog_)
    this.dialog_.setVisible(false);
};


/** @override */
anychart.chartEditor2Module.Editor.prototype.createDom = function() {
  if(!this.getElement()) anychart.chartEditor2Module.Editor.base(this, 'createDom');

  var dom = this.getDomHelper();
  goog.dom.classlist.add(this.getElement(), anychart.chartEditor2Module.Editor.CSS_CLASS);

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

  this.getElement().appendChild(this.progressEl_);

  // Add steps
  this.steps_.push(new anychart.chartEditor2Module.steps.PrepareData(0));
  this.steps_.push(new anychart.chartEditor2Module.steps.SetupChart(1));
  for (var i = 0; i < this.steps_.length; i++) {
    this.addChildAt(this.steps_[i], i); // not render until this.setCurrentStepByIndex_() call
  }
};


/** @override */
anychart.chartEditor2Module.Editor.prototype.enterDocument = function() {
  if(!this.breadcrumbsEl_) this.createDom();

  anychart.chartEditor2Module.Editor.base(this, 'enterDocument');
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
anychart.chartEditor2Module.Editor.prototype.updateProgress_ = function() {
  var dom = this.getDomHelper();

  if (this.breadcrumbsEl_)
    dom.removeChildren(this.breadcrumbsEl_);

  // Building breadcrumbs elements
  var step;
  for (var i = 0; i < this.steps_.length; i++) {
    step = this.steps_[i];

    var progressContentEl = dom.createDom(goog.dom.TagName.DIV, 'item-content', step.name());
    goog.dom.setFocusableTabIndex(progressContentEl, true);
    goog.a11y.aria.setRole(progressContentEl, goog.a11y.aria.Role.LINK);
    goog.a11y.aria.setLabel(progressContentEl, /** @type {string} */(step.name()));
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
      goog.dom.classlist.add(itemEl, 'item-passed');

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
anychart.chartEditor2Module.Editor.prototype.isLastStep_ = function() {
  return this.currentStep_.getIndex() == this.steps_.length - 1;
};


/**
 * @param {number} stepIndex
 * @private
 */
anychart.chartEditor2Module.Editor.prototype.changeStep_ = function(stepIndex) {
  if (stepIndex != this.currentStep_.getIndex()) {
    this.setCurrentStepByIndex_(stepIndex, true);
    // this.currentStep_.update();
  }
};


/**
 * Remove step from DOM.
 * @param {anychart.chartEditor2Module.steps.Base} step
 * @private
 */
anychart.chartEditor2Module.Editor.prototype.removeStep_ = function(step) {
  // Remove the child component's DOM from the document.  We have to call
  // exitDocument first (see documentation).
  step.exitDocument();
  goog.dom.removeNode(step.getElement());
};


/**
 * Render the given step.
 * @param {anychart.chartEditor2Module.steps.Base} step
 * @param {boolean} doAnimation
 * @private
 */
anychart.chartEditor2Module.Editor.prototype.setCurrentStep_ = function(step, doAnimation) {
  if (!this.isInDocument() || !step || step.isInDocument()) return;

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

  step.render(this.getElement());

  var appearAnimation = new goog.fx.AnimationSerialQueue();
  appearAnimation.add(new goog.fx.dom.FadeIn(step.getElement(), animationSpeed));
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
anychart.chartEditor2Module.Editor.prototype.setCurrentStepByIndex_ = function(index, doAnimation) {
  this.setCurrentStep_(this.steps_[index], doAnimation);
};


/**
 * Enable transition to next step.
 * @param {boolean} value
 */
anychart.chartEditor2Module.Editor.prototype.enableNextStep = function(value) {
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
anychart.chartEditor2Module.Editor.prototype.breadcrumbsClickHandler_ = function(e) {
  var element = /** @type {Element} */(e.target);

  if (goog.dom.classlist.contains(element, 'item-content')) {
    var itemEl = goog.dom.getParentElement(element);
    if (goog.dom.classlist.contains(itemEl, goog.getCssName('disabled'))) return;

    var newStepIndex = Number(element.getAttribute('data-step-index'));
    this.changeStep_(newStepIndex);
  }
};


anychart.chartEditor2Module.Editor.prototype.prevBtnClickHandler_ = function() {
  this.changeStep_(this.currentStep_.getIndex() - 1);
};


anychart.chartEditor2Module.Editor.prototype.nextBtnClickHandler_ = function() {
  if (this.isLastStep_())
    console.log("Complete pressed!");
  else
    this.changeStep_(this.currentStep_.getIndex() + 1);
};


anychart.chartEditor2Module.Editor.prototype.getDataModel = function() {
  return this.dataModel_;
};


anychart.chartEditor2Module.Editor.prototype.getEditorModel = function() {
  return this.editorModel_;
};


anychart.chartEditor2Module.Editor.prototype.onDataAdd_ = function(evt) {
  this.dataModel_.addData(evt['setId'], evt['data'], evt['dataType']);
};


anychart.chartEditor2Module.Editor.prototype.onDataRemove_ = function(evt) {
  this.dataModel_.removeData(evt['setId'], evt['dataType']);
};


anychart.chartEditor2Module.Editor.prototype.onUpdateUsingState_ = function(evt) {
  this.dataModel_.currentId(evt.setFullId);
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
anychart.chartEditor2Module.Editor.Dialog = function(opt_class, opt_useIframeMask, opt_domHelper) {
  anychart.chartEditor2Module.Editor.Dialog.base(this, 'constructor', opt_class || goog.getCssName('anychart-chart-editor-dialog'), opt_useIframeMask, opt_domHelper);

  /**
   * Element for the logo of the title bar.
   * @type {Element}
   * @private
   */
  this.titleLogoEl_ = null;

  this.setTitle('Chart Editor');
  this.setButtonSet(null);
};
goog.inherits(anychart.chartEditor2Module.Editor.Dialog, goog.ui.Dialog);


/** @override */
anychart.chartEditor2Module.Editor.Dialog.prototype.createDom = function() {
  anychart.chartEditor2Module.Editor.Dialog.base(this, 'createDom');
  this.initTitleElements_();
};


/** @override */
anychart.chartEditor2Module.Editor.Dialog.prototype.decorateInternal = function(element) {
  anychart.chartEditor2Module.Editor.Dialog.base(this, 'decorateInternal', element);
  this.initTitleElements_();
};


/** @private */
anychart.chartEditor2Module.Editor.Dialog.prototype.initTitleElements_ = function() {
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
anychart.chartEditor2Module.Editor.Dialog.prototype.enterDocument = function() {
  anychart.chartEditor2Module.Editor.Dialog.base(this, 'enterDocument');
  var bgEl = this.getBackgroundElement();
  if (bgEl)
    this.getHandler().listen(bgEl, goog.events.EventType.CLICK, this.onBackgroundClick_);
};


/** @override */
anychart.chartEditor2Module.Editor.Dialog.prototype.disposeInternal = function() {
  this.titleLogoEl_ = null;
  anychart.chartEditor2Module.Editor.Dialog.base(this, 'disposeInternal');
};


/** @private */
anychart.chartEditor2Module.Editor.Dialog.prototype.onBackgroundClick_ = function() {
  this.setVisible(false);
};
// endregion


/**
 * Constructor function for Chart Editor.
 * @return {anychart.chartEditor2Module.Editor}
 */
anychart.ui.editor2 = function() {
  return new anychart.chartEditor2Module.Editor();
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
