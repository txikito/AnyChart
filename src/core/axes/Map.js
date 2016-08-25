//region --- Requiring and Providing
goog.provide('anychart.core.axes.Map');
goog.require('anychart.core.VisualBase');
//endregion



/**
 * @constructor
 * @extends {anychart.core.VisualBase}
 */
anychart.core.axes.Map = function() {
  anychart.core.axes.Map.base(this, 'constructor');

  this.labelsBounds_ = [];
  this.minorLabelsBounds_ = [];

  /**
   * @type {acgraph.vector.Element}
   * @protected
   */
  this.line;

  /**
   * Constant to save space.
   * @type {number}
   * @protected
   */
  this.ALL_VISUAL_STATES = anychart.ConsistencyState.APPEARANCE |
      anychart.ConsistencyState.AXIS_TITLE |
      anychart.ConsistencyState.AXIS_LABELS |
      anychart.ConsistencyState.AXIS_TICKS |
      anychart.ConsistencyState.BOUNDS |
      anychart.ConsistencyState.AXIS_OVERLAP;
};
goog.inherits(anychart.core.axes.Map, anychart.core.VisualBase);


//region --- Internal properties
/**
 * Supported consistency states.
 * @type {number}
 */
anychart.core.axes.Map.prototype.SUPPORTED_CONSISTENCY_STATES =
    anychart.core.VisualBase.prototype.SUPPORTED_CONSISTENCY_STATES |
    anychart.ConsistencyState.APPEARANCE |
    anychart.ConsistencyState.AXIS_TITLE |
    anychart.ConsistencyState.AXIS_LABELS |
    anychart.ConsistencyState.AXIS_TICKS |
    anychart.ConsistencyState.AXIS_OVERLAP;


/**
 * Supported consistency states.
 * @type {number}
 */
anychart.core.axes.Map.prototype.SUPPORTED_SIGNALS = anychart.core.VisualBase.prototype.SUPPORTED_SIGNALS;


/**
 * @type {anychart.enums.LabelsOverlapMode}
 * @private
 */
anychart.core.axes.Map.prototype.overlapMode_ = anychart.enums.LabelsOverlapMode.NO_OVERLAP;


/**
 * @type {acgraph.vector.Circle}
 * @protected
 */
anychart.core.axes.Map.prototype.line = null;


/**
 * @type {string}
 * @private
 */
anychart.core.axes.Map.prototype.name_ = 'axis';


/**
 * @type {anychart.core.ui.LabelsFactory}
 * @private
 */
anychart.core.axes.Map.prototype.labels_ = null;


/**
 * @type {anychart.core.axes.RadialTicks}
 * @private
 */
anychart.core.axes.Map.prototype.ticks_ = null;


/**
 * @type {anychart.core.ui.LabelsFactory}
 * @private
 */
anychart.core.axes.Map.prototype.minorLabels_ = null;


/**
 * @type {anychart.core.axes.RadialTicks}
 * @private
 */
anychart.core.axes.Map.prototype.minorTicks_ = null;


/**
 * @type {string|acgraph.vector.Stroke}
 * @private
 */
anychart.core.axes.Map.prototype.stroke_;


/**
 * @type {anychart.scales.ScatterBase}
 * @private
 */
anychart.core.axes.Map.prototype.scale_ = null;


/**
 * @type {anychart.core.utils.Bounds}
 * @private
 */
anychart.core.axes.Map.prototype.pixelBounds_ = null;


/**
 * @type {Array.<anychart.math.Rect>}
 * @private
 */
anychart.core.axes.Map.prototype.labelsBounds_ = null;


/**
 * @type {Array.<anychart.math.Rect>}
 * @private
 */
anychart.core.axes.Map.prototype.minorLabelsBounds_ = null;


//endregion
//region --- Settings
/**
 * Getter/setter for title.
 * @param {(null|boolean|Object|string)=} opt_value Axis title.
 * @return {!(anychart.core.ui.Title|anychart.core.axes.Map)} Axis title or itself for method chaining.
 */
anychart.core.axes.Map.prototype.title = function(opt_value) {
  if (!this.title_) {
    this.title_ = new anychart.core.ui.Title();
    this.title_.setParentEventTarget(this);
    this.title_.listenSignals(this.titleInvalidated_, this);
    this.registerDisposable(this.title_);
  }

  if (goog.isDef(opt_value)) {
    this.title_.setup(opt_value);
    return this;
  }
  return this.title_;
};


/**
 * Internal title invalidation handler.
 * @param {anychart.SignalEvent} event Event object.
 * @private
 */
anychart.core.axes.Map.prototype.titleInvalidated_ = function(event) {
  var state = 0;
  var signal = 0;
  if (event.hasSignal(anychart.Signal.BOUNDS_CHANGED)) {
    state = this.ALL_VISUAL_STATES;
    signal = anychart.Signal.BOUNDS_CHANGED | anychart.Signal.NEEDS_REDRAW;
  } else if (event.hasSignal(anychart.Signal.NEEDS_REDRAW)) {
    state = anychart.ConsistencyState.AXIS_TITLE;
    signal = anychart.Signal.NEEDS_REDRAW;
  }
  this.invalidate(state, signal);
};


/**
 * Getter/setter for labels.
 * @param {(Object|boolean|null)=} opt_value Axis labels.
 * @return {!(anychart.core.ui.LabelsFactory|anychart.core.axes.Map)} Axis labels of itself for method chaining.
 */
anychart.core.axes.Map.prototype.labels = function(opt_value) {
  if (!this.labels_) {
    this.labels_ = new anychart.core.ui.LabelsFactory();
    this.labels_.setParentEventTarget(this);
    this.labels_.listenSignals(this.labelsInvalidated_, this);
    this.registerDisposable(this.labels_);
  }

  if (goog.isDef(opt_value)) {
    if (goog.isObject(opt_value) && !('enabled' in opt_value))
      opt_value['enabled'] = true;
    this.labels_.setup(opt_value);
    return this;
  }
  return this.labels_;
};


/**
 * Internal label invalidation handler.
 * @param {anychart.SignalEvent} event Event object.
 * @private
 */
anychart.core.axes.Map.prototype.labelsInvalidated_ = function(event) {
  var state = 0;
  var signal = 0;
  if (event.hasSignal(anychart.Signal.BOUNDS_CHANGED)) {
    state = this.ALL_VISUAL_STATES;
    signal = anychart.Signal.BOUNDS_CHANGED | anychart.Signal.NEEDS_REDRAW;
  } else if (event.hasSignal(anychart.Signal.NEEDS_REDRAW)) {
    state = anychart.ConsistencyState.AXIS_LABELS | anychart.ConsistencyState.AXIS_TICKS;
    signal = anychart.Signal.NEEDS_REDRAW;
  }
  this.dropStaggeredLabelsCache_();
  this.dropBoundsCache();
  this.invalidate(state, signal);
};


/**
 * Getter/setter for minorLabels.
 * @param {(Object|boolean|null)=} opt_value Axis labels.
 * @return {!(anychart.core.ui.LabelsFactory|anychart.core.axes.Map)} Axis labels of itself for method chaining.
 */
anychart.core.axes.Map.prototype.minorLabels = function(opt_value) {
  if (!this.minorLabels_) {
    this.minorLabels_ = new anychart.core.ui.LabelsFactory();
    this.minorLabels_.setParentEventTarget(this);
    this.isHorizontal() ? this.minorLabels_.rotation(0) : this.minorLabels_.rotation(-90);
    this.minorLabels_.listenSignals(this.minorLabelsInvalidated_, this);
    this.registerDisposable(this.minorLabels_);
  }

  if (goog.isDef(opt_value)) {
    if (goog.isObject(opt_value) && !('enabled' in opt_value))
      opt_value['enabled'] = true;
    this.minorLabels_.setup(opt_value);
    return this;
  }
  return this.minorLabels_;
};


/**
 * Internal minor label invalidation handler.
 * @param {anychart.SignalEvent} event Event object.
 * @private
 */
anychart.core.axes.Map.prototype.minorLabelsInvalidated_ = function(event) {
  var state = 0;
  var signal = 0;
  if (event.hasSignal(anychart.Signal.BOUNDS_CHANGED)) {
    state = this.ALL_VISUAL_STATES;
    signal = anychart.Signal.BOUNDS_CHANGED | anychart.Signal.NEEDS_REDRAW;
  } else if (event.hasSignal(anychart.Signal.NEEDS_REDRAW)) {
    state = anychart.ConsistencyState.AXIS_LABELS;
    signal = anychart.Signal.NEEDS_REDRAW;
  }
  this.dropBoundsCache();
  this.invalidate(state, signal);
};


/**
 * Create new ticks instance.
 * @return {anychart.core.axes.MapTicks}
 * @protected
 */
anychart.core.axes.Map.prototype.createTicks = function() {
  return new anychart.core.axes.MapTicks();
};


/**
 * Getter/setter for ticks.
 * @param {(Object|boolean|null)=} opt_value Axis ticks.
 * @return {!(anychart.core.axes.MapTicks|anychart.core.axes.Map)} Axis ticks or itself for method chaining.
 */
anychart.core.axes.Map.prototype.ticks = function(opt_value) {
  if (!this.ticks_) {
    this.ticks_ = this.createTicks();
    this.ticks_.setParentEventTarget(this);
    this.ticks_.listenSignals(this.ticksInvalidated, this);
    this.registerDisposable(this.ticks_);
  }

  if (goog.isDef(opt_value)) {
    this.ticks_.setup(opt_value);
    return this;
  }
  return this.ticks_;
};


/**
 * Getter/setter for minorTicks.
 * @param {(Object|boolean|null)=} opt_value Axis ticks.
 * @return {!(anychart.core.axes.MapTicks|anychart.core.axes.Map)} Axis ticks or itself for method chaining.
 */
anychart.core.axes.Map.prototype.minorTicks = function(opt_value) {
  if (!this.minorTicks_) {
    this.minorTicks_ = this.createTicks();
    this.minorTicks_.setParentEventTarget(this);
    this.minorTicks_.listenSignals(this.ticksInvalidated, this);
    this.registerDisposable(this.minorTicks_);
  }

  if (goog.isDef(opt_value)) {
    this.minorTicks_.setup(opt_value);
    return this;
  }
  return this.minorTicks_;
};


/**
 * Internal ticks invalidation handler.
 * @param {anychart.SignalEvent} event Event object.
 * @protected
 */
anychart.core.axes.Map.prototype.ticksInvalidated = function(event) {
  var state = 0;
  var signal = 0;
  if (event.hasSignal(anychart.Signal.BOUNDS_CHANGED)) {
    state = this.ALL_VISUAL_STATES;
    signal = anychart.Signal.BOUNDS_CHANGED | anychart.Signal.NEEDS_REDRAW;
  } else if (event.hasSignal(anychart.Signal.NEEDS_REDRAW)) {
    state = anychart.ConsistencyState.AXIS_TICKS;
    signal = anychart.Signal.NEEDS_REDRAW;
  }
  this.invalidate(state, signal);
};


/**
 * Getter/setter for stroke.
 * @param {(acgraph.vector.Stroke|acgraph.vector.ColoredFill|string|null)=} opt_strokeOrFill Fill settings
 *    or stroke settings.
 * @param {number=} opt_thickness [1] Line thickness.
 * @param {string=} opt_dashpattern Controls the pattern of dashes and gaps used to stroke paths.
 * @param {acgraph.vector.StrokeLineJoin=} opt_lineJoin Line joint style.
 * @param {acgraph.vector.StrokeLineCap=} opt_lineCap Line cap style.
 * @return {!(anychart.core.axes.Map|acgraph.vector.Stroke)} .
 */
anychart.core.axes.Map.prototype.stroke = function(opt_strokeOrFill, opt_thickness, opt_dashpattern, opt_lineJoin, opt_lineCap) {
  if (goog.isDef(opt_strokeOrFill)) {
    opt_strokeOrFill = acgraph.vector.normalizeStroke.apply(null, arguments);
    if (this.stroke_ != opt_strokeOrFill) {
      var thicknessOld = goog.isObject(this.stroke_) ? this.stroke_['thickness'] || 1 : 1;
      var thicknessNew = goog.isObject(opt_strokeOrFill) ? opt_strokeOrFill['thickness'] || 1 : 1;
      this.stroke_ = opt_strokeOrFill;
      if (thicknessNew == thicknessOld)
        this.invalidate(anychart.ConsistencyState.APPEARANCE, anychart.Signal.NEEDS_REDRAW);
      else
        this.invalidate(this.ALL_VISUAL_STATES, anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    }
    return this;
  } else {
    return this.stroke_;
  }
};


/**
 * Getter/setter for orientation.
 * @param {(string|anychart.enums.Orientation|null)=} opt_value Axis orientation.
 * @return {anychart.enums.Orientation|!anychart.core.axes.Map} Axis orientation or itself for method chaining.
 */
anychart.core.axes.Map.prototype.orientation = function(opt_value) {
  if (goog.isDef(opt_value)) {
    var orientation = goog.isNull(opt_value) ? null : anychart.enums.normalizeOrientation(opt_value);
    if (this.orientation_ != orientation) {
      this.orientation_ = orientation;
      this.dropStaggeredLabelsCache_();
      this.invalidate(this.ALL_VISUAL_STATES, anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    }
    return this;
  } else {
    return this.orientation_ || this.defaultOrientation_;
  }
};


/**
 * Getter/setter for scale.
 * @param {anychart.scales.Base=} opt_value Scale.
 * @return {anychart.scales.Base|!anychart.core.axes.Map} Axis scale or itself for method chaining.
 */
anychart.core.axes.Map.prototype.scale = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.internalScale != opt_value) {
      if (this.internalScale)
        this.internalScale.unlistenSignals(this.scaleInvalidated_, this);
      this.internalScale = opt_value;
      if (this.internalScale)
        this.internalScale.listenSignals(this.scaleInvalidated_, this);
      this.dropStaggeredLabelsCache_();
      this.dropBoundsCache();
      this.labels().dropCallsCache();
      this.minorLabels().dropCallsCache();
      this.invalidate(this.ALL_VISUAL_STATES, anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    }
    return this;
  } else {
    return this.internalScale;
  }
};


/**
 * Internal ticks invalidation handler.
 * @param {anychart.SignalEvent} event Event object.
 * @private
 */
anychart.core.axes.Map.prototype.scaleInvalidated_ = function(event) {
  if (event.hasSignal(anychart.Signal.NEEDS_REAPPLICATION)) {
    this.dropStaggeredLabelsCache_();
    this.dropBoundsCache();
    this.labels().dropCallsCache();
    this.minorLabels().dropCallsCache();
    this.invalidate(this.ALL_VISUAL_STATES, anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
  }
};


//endregion
//region --- Bounds
/**
 * Returns remaining parent bounds to use elsewhere.
 * @example <t>simple-h100</t>
 * var axis = anychart.axes.linear();
 * axis
 *     .orientation('left')
 *     .scale(anychart.scales.ordinal().values([1,2,3]))
 *     .container(stage).draw();
 * var label = anychart.ui.label();
 * label
 *     .parentBounds(axis.getRemainingBounds())
 *     .width('100%')
 *     .height('100%')
 *     .padding(15)
 *     .background()
 *       .enabled(true)
 *       .fill('blue 0.2')
 * label.container(stage).draw();
 * @return {!anychart.math.Rect} Parent bounds without the space used by the title.
 */
anychart.core.axes.Map.prototype.getRemainingBounds = function() {
  var parentBounds = this.parentBounds();

  if (parentBounds) {
    var remainingBounds = parentBounds.clone();

    if (this.scale() && this.enabled()) {
      var axisBounds = this.getPixelBounds();
      var padding = this.padding();
      var heightOffset = parentBounds.height - padding.tightenHeight(parentBounds.height) + axisBounds.height;
      var widthOffset = parentBounds.width - padding.tightenWidth(parentBounds.width) + axisBounds.width;

      switch (this.orientation()) {
        case anychart.enums.Orientation.TOP:
          remainingBounds.height -= heightOffset;
          remainingBounds.top += heightOffset;
          break;
        case anychart.enums.Orientation.RIGHT:
          remainingBounds.width -= widthOffset;
          break;
        case anychart.enums.Orientation.BOTTOM:
          remainingBounds.height -= heightOffset;
          break;
        case anychart.enums.Orientation.LEFT:
          remainingBounds.width -= widthOffset;
          remainingBounds.left += widthOffset;
          break;
      }
    }

    return remainingBounds;
  } else
    return new anychart.math.Rect(0, 0, 0, 0);
};


//endregion
//region --- Drawing
//----------------------------------------------------------------------------------------------------------------------
//
//                                                  Axis Line
//
//----------------------------------------------------------------------------------------------------------------------
/**
 * Create line.
 * @return {acgraph.vector.Element}
 * @protected
 */
anychart.core.axes.Linear.prototype.getLine = function() {
  return this.line ? this.line : this.line = /** @type {acgraph.vector.Element} */(acgraph.path());
};


/**
 * Axis line drawer for top orientation.
 * @param {anychart.math.Rect} bounds Bounds.
 * @param {number} pixelShift Pixel shift.
 * @param {number} lineThickness Stroke thickness.
 * @param {number} offset Offset.
 * @param {number} size Size.
 * @protected
 */
anychart.core.axes.Map.prototype.drawTopLine = function(bounds, pixelShift, lineThickness, offset, size) {
  var y = bounds.top + bounds.height + lineThickness / 2;
  this.line
      .moveTo(bounds.left + pixelShift, y)
      .lineTo(bounds.left - pixelShift + bounds.width, y);
};


/**
 * Axis line drawer for right orientation.
 * @param {anychart.math.Rect} bounds Bounds.
 * @param {number} pixelShift Pixel shift.
 * @param {number} lineThickness Stroke thickness.
 * @param {number} offset Offset.
 * @param {number} size Size.
 * @protected
 */
anychart.core.axes.Map.prototype.drawRightLine = function(bounds, pixelShift, lineThickness, offset, size) {
  var x = bounds.left - lineThickness / 2;
  this.line
      .moveTo(x, bounds.top + pixelShift)
      .lineTo(x, bounds.top - pixelShift + bounds.height);
};


/**
 * Axis line drawer for bottom orientation.
 * @param {anychart.math.Rect} bounds Bounds.
 * @param {number} pixelShift Pixel shift.
 * @param {number} lineThickness Stroke thickness.
 * @param {number} offset Offset.
 * @param {number} size Size.
 * @protected
 */
anychart.core.axes.Map.prototype.drawBottomLine = function(bounds, pixelShift, lineThickness, offset, size) {
  var y = bounds.top - lineThickness / 2;
  this.line
      .moveTo(bounds.left + pixelShift, y)
      .lineTo(bounds.left - pixelShift + bounds.width, y);
};


/**
 * Axis line drawer for left orientation.
 * @param {anychart.math.Rect} bounds Bounds.
 * @param {number} pixelShift Pixel shift.
 * @param {number} lineThickness Stroke thickness.
 * @param {number} offset Offset.
 * @param {number} size Size.
 * @protected
 */
anychart.core.axes.Map.prototype.drawLeftLine = function(bounds, pixelShift, lineThickness, offset, size) {
  var x = bounds.left + bounds.width + lineThickness / 2;
  this.line
      .moveTo(x, bounds.top + pixelShift)
      .lineTo(x, bounds.top - pixelShift + bounds.height);
};


/**
 * Draws axis line.
 * @protected
 */
anychart.core.axes.Map.prototype.drawLine = function() {
  this.getLine().clear();

  var orientation = /** @type {anychart.enums.Orientation} */(this.orientation());

  var lineDrawer;
  switch (orientation) {
    case anychart.enums.Orientation.TOP:
      lineDrawer = this.drawTopLine;
      break;
    case anychart.enums.Orientation.RIGHT:
      lineDrawer = this.drawRightLine;
      break;
    case anychart.enums.Orientation.BOTTOM:
      lineDrawer = this.drawBottomLine;
      break;
    case anychart.enums.Orientation.LEFT:
      lineDrawer = this.drawLeftLine;
      break;
  }

  var lineThickness = this.stroke()['thickness'] ? parseFloat(this.stroke()['thickness']) : 1;
  var pixelShift = lineThickness % 2 == 0 ? 0 : 0.5;
  var bounds = this.getPixelBounds();

  lineDrawer.call(this, bounds, pixelShift, lineThickness, 0, 0);

  this.line.stroke(/** @type {acgraph.vector.Stroke} */(this.stroke()));
};


/** @inheritDoc */
anychart.core.axes.Linear.prototype.checkDrawingNeeded = function() {
  if (this.isConsistent())
    return false;

  if (!this.enabled()) {
    if (this.hasInvalidationState(anychart.ConsistencyState.ENABLED)) {
      this.remove();
      this.markConsistent(anychart.ConsistencyState.ENABLED);
      this.title().invalidate(anychart.ConsistencyState.CONTAINER);
      this.ticks().invalidate(anychart.ConsistencyState.CONTAINER);
      this.minorTicks().invalidate(anychart.ConsistencyState.CONTAINER);
      this.labels().invalidate(anychart.ConsistencyState.CONTAINER);
      this.minorLabels().invalidate(anychart.ConsistencyState.CONTAINER);
      this.invalidate(
          anychart.ConsistencyState.CONTAINER |
          anychart.ConsistencyState.AXIS_TITLE |
          anychart.ConsistencyState.AXIS_TICKS |
          anychart.ConsistencyState.AXIS_LABELS
      );
    }
    return false;
  }
  this.markConsistent(anychart.ConsistencyState.ENABLED);
  return true;
};


//endregion
//region --- Setup and Dispose
/** @inheritDoc */
anychart.core.axes.Map.prototype.setupByJSON = function(config) {
  anychart.core.axes.Map.base(this, 'setupByJSON', config);
};


/** @inheritDoc */
anychart.core.axes.Map.prototype.serialize = function() {
  var json = anychart.core.axes.Map.base(this, 'serialize');
};


/** @inheritDoc */
anychart.core.axes.Map.prototype.disposeInternal = function() {
  anychart.core.axes.Map.base(this, 'disposeInternal');
};


//endregion
//region --- Exports

//exports
//endregion
