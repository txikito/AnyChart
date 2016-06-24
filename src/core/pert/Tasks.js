goog.provide('anychart.core.pert.Tasks');

goog.require('anychart.core.pert.PertVisualElements');



/**
 * Pert milestones settings collector.
 * @constructor
 * @extends {anychart.core.pert.PertVisualElements}
 */
anychart.core.pert.Tasks = function() {
  anychart.core.pert.Tasks.base(this, 'constructor');

  /**
   * Lower labels.
   * @type {anychart.core.ui.LabelsFactory}
   * @private
   */
  this.lowerLabels_;

  /**
   * Hover lower labels.
   * @type {anychart.core.ui.LabelsFactory}
   * @private
   */
  this.hoverLowerLabels_;

  /**
   * Select labels.
   * @type {anychart.core.ui.LabelsFactory}
   * @private
   */
  this.selectLowerLabels_;
};
goog.inherits(anychart.core.pert.Tasks, anychart.core.pert.PertVisualElements);


/**
 * Supported signals mask.
 * @type {number}
 */
anychart.core.pert.Tasks.prototype.SUPPORTED_SIGNALS =
    anychart.core.pert.PertVisualElements.prototype.SUPPORTED_SIGNALS;


/**
 * Gets or sets lower labels settings.
 * @param {(Object|boolean|null)=} opt_value - Labels settings.
 * @return {!(anychart.core.ui.LabelsFactory|anychart.core.pert.Tasks)} - Labels instance or itself for chaining call.
 */
anychart.core.pert.Tasks.prototype.lowerLabels = function(opt_value) {
  if (!this.lowerLabels_) {
    this.lowerLabels_ = new anychart.core.ui.LabelsFactory();
    this.lowerLabels_.listenSignals(this.labelsInvalidated, this);
    this.registerDisposable(this.lowerLabels_);
  }

  if (goog.isDef(opt_value)) {
    if (goog.isObject(opt_value) && !(anychart.opt.ENABLED in opt_value))
      opt_value[anychart.opt.ENABLED] = true;
    this.lowerLabels_.setup(opt_value);
    return this;
  }
  return this.lowerLabels_;
};


/**
 * Gets or sets select lower labels settings.
 * @param {(Object|boolean|null)=} opt_value - Labels settings.
 * @return {!(anychart.core.ui.LabelsFactory|anychart.core.pert.Tasks)} - Labels instance or itself for chaining call.
 */
anychart.core.pert.Tasks.prototype.selectLowerLabels = function(opt_value) {
  if (!this.selectLowerLabels_) {
    this.selectLowerLabels_ = new anychart.core.ui.LabelsFactory();
    this.selectLowerLabels_.listenSignals(this.labelsInvalidated_, this);
    this.registerDisposable(this.selectLowerLabels_);
  }

  if (goog.isDef(opt_value)) {
    if (goog.isObject(opt_value) && !(anychart.opt.ENABLED in opt_value))
      opt_value[anychart.opt.ENABLED] = true;
    this.selectLowerLabels_.setup(opt_value);
    return this;
  }
  return this.selectLowerLabels_;
};


/**
 * Gets or sets hover lower labels settings.
 * @param {(Object|boolean|null)=} opt_value - Labels settings.
 * @return {!(anychart.core.ui.LabelsFactory|anychart.core.pert.Tasks)} - Labels instance or itself for chaining call.
 */
anychart.core.pert.Tasks.prototype.hoverLowerLabels = function(opt_value) {
  if (!this.hoverLowerLabels_) {
    this.hoverLowerLabels_ = new anychart.core.ui.LabelsFactory();
    this.hoverLowerLabels_.listenSignals(this.labelsInvalidated_, this);
    this.registerDisposable(this.hoverLowerLabels_);
  }

  if (goog.isDef(opt_value)) {
    if (goog.isObject(opt_value) && !(anychart.opt.ENABLED in opt_value))
      opt_value[anychart.opt.ENABLED] = true;
    this.hoverLowerLabels_.setup(opt_value);
    return this;
  }
  return this.hoverLowerLabels_;
};


/**
 * Gets or sets upper labels settings.
 * @param {(Object|boolean|null)=} opt_value - Labels settings.
 * @return {!(anychart.core.ui.LabelsFactory|anychart.core.pert.Tasks)} - Labels instance or itself for chaining call.
 */
anychart.core.pert.Tasks.prototype.upperLabels = function(opt_value) {
  return this.labels(opt_value);
};


/**
 * Gets or sets select upper labels settings.
 * @param {(Object|boolean|null)=} opt_value - Labels settings.
 * @return {!(anychart.core.ui.LabelsFactory|anychart.core.pert.Tasks)} - Labels instance or itself for chaining call.
 */
anychart.core.pert.Tasks.prototype.selectUpperLabels = function(opt_value) {
  return this.selectLabels(opt_value);
};


/**
 * Gets or sets hover labels settings.
 * @param {(Object|boolean|null)=} opt_value - Labels settings.
 * @return {!(anychart.core.ui.LabelsFactory|anychart.core.pert.Tasks)} - Labels instance or itself for chaining call.
 */
anychart.core.pert.Tasks.prototype.hoverUpperLabels = function(opt_value) {
  return this.hoverLabels(opt_value);
};


/**
 * @inheritDoc
 */
anychart.core.pert.Tasks.prototype.labelsContainer = function(opt_value) {
  anychart.core.pert.Tasks.base(this, 'labelsContainer', opt_value);
  var container = anychart.core.pert.Tasks.base(this, 'labelsContainer');
  if (container) this.lowerLabels().container(container);
  return container;
};


/**
 * @inheritDoc
 */
anychart.core.pert.Tasks.prototype.clearLabels = function() {
  this.lowerLabels().clear();
  return anychart.core.pert.Tasks.base(this, 'clearLabels');
};


/** @inheritDoc */
anychart.core.pert.Tasks.prototype.serialize = function() {
  var json = anychart.core.pert.Tasks.base(this, 'serialize');

  json['upperLabels'] = goog.object.clone(json['labels']);
  delete json['labels'];

  json['selectUpperLabels'] = goog.object.clone(json['selectLabels']);
  delete json['selectLabels'];

  json['hoverUpperLabels'] = goog.object.clone(json['hoverLabels']);
  delete json['hoverLabels'];

  json['lowerLabels'] = this.lowerLabels().serialize();
  json['hoverLowerLabels'] = this.hoverLowerLabels().serialize();
  json['selectLowerLabels'] = this.selectLowerLabels().serialize();

  return json;
};


/** @inheritDoc */
anychart.core.pert.Tasks.prototype.setupByJSON = function(config) {
  anychart.core.pert.Tasks.base(this, 'setupByJSON', config);
  this.upperLabels(config['upperLabels']);
  this.selectUpperLabels(config['selectUpperLabels']);
  this.hoverUpperLabels(config['hoverUpperLabels']);
  this.lowerLabels(config['lowerLabels']);
  this.hoverLowerLabels(config['hoverLowerLabels']);
  this.selectLowerLabels(config['selectLowerLabels']);
};


//exports
anychart.core.pert.Tasks.prototype['fill'] = anychart.core.pert.Tasks.prototype.fill;
anychart.core.pert.Tasks.prototype['hoverFill'] = anychart.core.pert.Tasks.prototype.hoverFill;
anychart.core.pert.Tasks.prototype['selectFill'] = anychart.core.pert.Tasks.prototype.selectFill;
anychart.core.pert.Tasks.prototype['stroke'] = anychart.core.pert.Tasks.prototype.stroke;
anychart.core.pert.Tasks.prototype['hoverStroke'] = anychart.core.pert.Tasks.prototype.hoverStroke;
anychart.core.pert.Tasks.prototype['selectStroke'] = anychart.core.pert.Tasks.prototype.selectStroke;
anychart.core.pert.Tasks.prototype['upperLabels'] = anychart.core.pert.Tasks.prototype.upperLabels;
anychart.core.pert.Tasks.prototype['selectUpperLabels'] = anychart.core.pert.Tasks.prototype.selectUpperLabels;
anychart.core.pert.Tasks.prototype['hoverUpperLabels'] = anychart.core.pert.Tasks.prototype.hoverUpperLabels;
anychart.core.pert.Tasks.prototype['tooltip'] = anychart.core.pert.Tasks.prototype.tooltip;
anychart.core.pert.Tasks.prototype['lowerLabels'] = anychart.core.pert.Tasks.prototype.lowerLabels;
anychart.core.pert.Tasks.prototype['hoverLowerLabels'] = anychart.core.pert.Tasks.prototype.hoverLowerLabels;
anychart.core.pert.Tasks.prototype['selectLowerLabels'] = anychart.core.pert.Tasks.prototype.selectLowerLabels;
