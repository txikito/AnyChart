//region --- Requiring and Providing
goog.provide('anychart.core.axes.Map');
goog.require('anychart.core.VisualBase');
goog.require('anychart.core.axes.MapTicks');
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
 * Whether an axis is horizontal.
 * @return {boolean} If the axis is horizontal.
 */
anychart.core.axes.Map.prototype.isHorizontal = function() {
  var orientation = this.orientation();
  return orientation == anychart.enums.Orientation.TOP ||
      orientation == anychart.enums.Orientation.BOTTOM;
};


/**
 * Getter/setter for scale.
 * @param {anychart.scales.Geo=} opt_value Scale.
 * @return {anychart.scales.Geo|!anychart.core.axes.Map} Axis scale or itself for method chaining.
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
//region --- Labels calculation
/**
 * Returns an object with indexes of labels to draw.
 * @param {anychart.math.Rect=} opt_bounds Parent bounds.
 * @return {boolean|Object.<string, Array.<boolean>>} Object with indexes of labels to draw.
 * or Boolean when there are no labels.
 * @private
 */
anychart.core.axes.Map.prototype.getOverlappedLabels_ = function(opt_bounds) {
  if (!this.overlappedLabels_ || this.hasInvalidationState(anychart.ConsistencyState.AXIS_OVERLAP)) {
    if (this.overlapMode_ == anychart.enums.LabelsOverlapMode.ALLOW_OVERLAP) {
      return false;
    } else {
      var scale = /** @type {anychart.scales.ScatterBase|anychart.scales.Ordinal} */(this.scale());
      var labels = [];
      var minorLabels = [];

      if (scale) {
        var i, j;

        /**
         * Index of previous major label which is displayed.
         * @type {number}
         */
        var prevDrawableLabel = -1;
        /**
         * Index of the next label, which we should display and it doesn't overlap previous major label and the
         * very last if it is on.
         * @type {number}
         */
        var nextDrawableLabel = -1;
        /**
         * Index of previous minor label which is displayed.
         * @type {number}
         */
        var prevDrawableMinorLabel = -1;

        var scaleTicksArr = scale.ticks().get();
        var ticksArrLen = scaleTicksArr.length;
        var tickVal, ratio, bounds1, bounds2, bounds3, bounds4;
        var tempRatio;
        var k = -1;
        var isLabels = this.labels().enabled();


        var scaleMinorTicksArr = scale.minorTicks().get();
        i = 0;
        j = 0;
        var minorTicksArrLen = scaleMinorTicksArr.length;
        var minorTickVal, minorRatio;
        var isMinorLabels = this.minorLabels().enabled();

        while (i < ticksArrLen || j < minorTicksArrLen) {
          tickVal = scaleTicksArr[i];
          minorTickVal = scaleMinorTicksArr[j];
          ratio = scale.transform(tickVal);
          minorRatio = scale.transform(minorTickVal);
          bounds1 = bounds2 = bounds3 = bounds4 = null;

          if (nextDrawableLabel == -1 && isLabels) {
            k = i;
            while (nextDrawableLabel == -1 && k < ticksArrLen) {
              if ((k == 0 && this.drawFirstLabel()) || (k == ticksArrLen - 1 && this.drawLastLabel()) || (k != 0 && k != ticksArrLen - 1))
                bounds1 = this.getLabelBounds_(k, true, scaleTicksArr, opt_bounds);
              else
                bounds1 = null;

              if (prevDrawableLabel != -1)
                bounds2 = this.getLabelBounds_(prevDrawableLabel, true, scaleTicksArr, opt_bounds);
              else
                bounds2 = null;

              if (k != ticksArrLen - 1 && this.drawLastLabel())
                bounds3 = this.getLabelBounds_(ticksArrLen - 1, true, scaleTicksArr, opt_bounds);
              else
                bounds3 = null;

              if (bounds1 && !(anychart.math.checkRectIntersection(bounds1, bounds2) ||
                  anychart.math.checkRectIntersection(bounds1, bounds3))) {
                tempRatio = scale.transform(scaleTicksArr[k]);
                if ((tempRatio <= 0 && this.drawFirstLabel()) || (tempRatio >= 1 && this.drawLastLabel()))
                  nextDrawableLabel = k;
                else if (tempRatio > 0 && tempRatio < 1)
                  nextDrawableLabel = k;
              }
              k++;
            }
          }

          if (((ratio <= minorRatio && i < ticksArrLen) || j == minorTicksArrLen)) {
            if (isLabels && i == nextDrawableLabel) {
              prevDrawableLabel = i;
              nextDrawableLabel = -1;
              labels.push(true);
            } else {
              labels.push(false);
            }
            i++;
            if (ratio == minorRatio && (this.labels().enabled() || this.ticks().enabled())) {
              minorLabels.push(false);
              j++;
            }
          } else {
            if (isMinorLabels) {
              bounds1 = this.getLabelBounds_(j, false, scaleMinorTicksArr, opt_bounds);

              if (prevDrawableLabel != -1)
                bounds2 = this.getLabelBounds_(prevDrawableLabel, true, scaleTicksArr, opt_bounds);

              if (nextDrawableLabel != -1)
                bounds3 = this.getLabelBounds_(nextDrawableLabel, true, scaleTicksArr, opt_bounds);

              if (prevDrawableMinorLabel != -1)
                bounds4 = this.getLabelBounds_(prevDrawableMinorLabel, false, scaleMinorTicksArr, opt_bounds);

              var label = this.minorLabels().getLabel(j);
              var isLabelEnabled = label ?
                  goog.isDef(label.enabled()) ?
                      label.enabled() :
                      true :
                  true;

              if (!(anychart.math.checkRectIntersection(bounds1, bounds2) ||
                  anychart.math.checkRectIntersection(bounds1, bounds3) ||
                  anychart.math.checkRectIntersection(bounds1, bounds4)) && isLabelEnabled) {

                tempRatio = scale.transform(scaleMinorTicksArr[j]);
                if ((tempRatio <= 0 && this.drawFirstLabel()) || (tempRatio >= 1 && this.drawLastLabel())) {
                  prevDrawableMinorLabel = j;
                  minorLabels.push(true);
                } else if (tempRatio > 0 && tempRatio < 1) {
                  prevDrawableMinorLabel = j;
                  minorLabels.push(true);
                } else {
                  minorLabels.push(false);
                }

              } else {
                minorLabels.push(false);
              }
            } else {
              minorLabels.push(false);
            }
            j++;
          }
        }
        if (!isMinorLabels) minorLabels = false;
      }
      if (!isLabels) labels = false;
      this.overlappedLabels_ = {labels: labels, minorLabels: minorLabels};
    }
    this.markConsistent(anychart.ConsistencyState.AXIS_OVERLAP);
  }
  return this.overlappedLabels_;
};


/**
 * @private
 */
anychart.core.axes.Map.prototype.dropStaggeredLabelsCache_ = function() {
  this.staggeredLabels_ = null;
};


/**
 * Calculate label bounds.
 * @param {number} index Label index.
 * @param {boolean} isMajor Major labels or minor.
 * @param {Array} ticksArray Array with ticks.
 * @param {anychart.math.Rect=} opt_parentBounds Parent bounds.
 * @return {Array.<number>} Label bounds.
 * @private
 */
anychart.core.axes.Map.prototype.getLabelBounds_ = function(index, isMajor, ticksArray, opt_parentBounds) {
  // if (!isMajor && this.scale())
  //   return null;

  var boundsCache = isMajor ? this.labelsBounds_ : this.minorLabelsBounds_;
  if (goog.isDef(boundsCache[index]))
    return boundsCache[index];

  var bounds = goog.isDef(opt_parentBounds) ? opt_parentBounds : this.getPixelBounds();
  var lineBounds = goog.isDef(opt_parentBounds) ? opt_parentBounds : this.line.getBounds();
  var ticks = isMajor ? this.ticks() : this.minorTicks();
  var ticksLength = ticks.length();
  var stroke = this.stroke();
  var lineThickness = anychart.utils.isNone(stroke) ? 0 : stroke['thickness'] ? parseFloat(this.stroke()['thickness']) : 1;

  var labels = isMajor ? this.labels() : this.minorLabels();

  var x, y;
  var scale = /** @type {anychart.scales.Geo} */(this.scale());

  var value = ticksArray[index];
  var ratio;
  if (goog.isArray(value)) {
    ratio = (scale.transform(value[0], 0) + scale.transform(value[1], 1)) / 2;
    value = value[0];
  } else {
    ratio = scale.transform(value, .5);
  }

  if (ratio < 0 || ratio > 1) return [0, 0];

  var isEnabled = ticks.enabled();
  var position = ticks.position();

  switch (this.orientation()) {
    case anychart.enums.Orientation.TOP:
      x = Math.round(bounds.left + ratio * bounds.width);
      y = lineBounds.top - lineThickness / 2;
      if (position == anychart.enums.SidePosition.OUTSIDE && isEnabled) {
        y -= ticksLength;
      }
      break;
    case anychart.enums.Orientation.RIGHT:
      x = lineBounds.getRight() + lineThickness / 2;
      y = Math.round(bounds.top + ratio * bounds.height);

      if (position == anychart.enums.SidePosition.OUTSIDE && isEnabled) {
        x += ticksLength;
      }
      break;
    case anychart.enums.Orientation.BOTTOM:
      x = Math.round(bounds.left + ratio * bounds.width);
      y = lineBounds.getBottom() + lineThickness / 2;

      if (position == anychart.enums.SidePosition.OUTSIDE && isEnabled) {
        y += ticksLength;
      }
      break;
    case anychart.enums.Orientation.LEFT:
      x = lineBounds.left - lineThickness / 2;
      y = Math.round(bounds.top + ratio * bounds.height);

      if (position == anychart.enums.SidePosition.OUTSIDE && isEnabled) {
        x -= ticksLength;
      }
      break;
  }

  var formatProvider = this.getLabelsFormatProvider(index, value);
  var positionProvider = {'value': {'x': x, 'y': y}};

  var labelBounds = labels.measure(formatProvider, positionProvider, undefined, index);

  switch (this.orientation()) {
    case anychart.enums.Orientation.TOP:
      labelBounds.top += labelBounds.height / 2;
      break;
    case anychart.enums.Orientation.RIGHT:
      labelBounds.left += labelBounds.width / 2;
      break;
    case anychart.enums.Orientation.BOTTOM:
      labelBounds.top += labelBounds.height / 2;
      break;
    case anychart.enums.Orientation.LEFT:
      labelBounds.left += labelBounds.width / 2;
      break;
  }


  return boundsCache[index] = labelBounds.toCoordinateBox();
};


//endregion
//region --- Bounds
/**
 *
 * @return {anychart.math.Rect}
 */
anychart.core.axes.Map.prototype.getAffectingBoundsSize = function() {
  var bounds, size, i, delta, len;
  var maxLabelSize = 0;
  var maxMinorLabelSize = 0;
  var titleSize = 0;
  var parentBounds = this.parentBounds();

  var title = this.title();
  var labels = this.labels();
  var minorLabels = this.minorLabels();
  var orientation = /** @type {anychart.enums.Orientation} */(this.orientation());

  if (title.enabled()) {
    if (!title.container()) title.container(/** @type {acgraph.vector.ILayer} */(this.container()));
    title.suspendSignalsDispatching();
    title.parentBounds(parentBounds);
    title.setDefaultOrientation(orientation);
    titleSize = this.isHorizontal() ? title.getContentBounds().height : title.getContentBounds().width;
    title.resumeSignalsDispatching(false);
  }

  var scale = /** @type {anychart.scales.Geo} */(this.scale());

  var isLabels = /** @type {boolean} */(labels.enabled() && goog.isDef(scale));
  var isMinorLabels = /** @type {boolean} */(minorLabels.enabled() && goog.isDef(scale));

  scale.setBounds(parentBounds);
  scale.calculate();

  var ticks;
  if (this.isHorizontal()) {
    ticks = this.scale().xTicks();
  } else {
    ticks = this.scale().yTicks();
  }

  var axisGeoLine;
  var edgeTickPosition;
  switch (orientation) {
    case anychart.enums.Orientation.TOP:
      axisGeoLine = scale.maximumY();
      edgeTickPosition = Number.MAX_VALUE;
      break;
    case anychart.enums.Orientation.RIGHT:
      axisGeoLine = scale.maximumX();
      edgeTickPosition = -Number.MAX_VALUE;
      break;
    case anychart.enums.Orientation.BOTTOM:
      axisGeoLine = scale.minimumY();
      edgeTickPosition = -Number.MAX_VALUE;
      break;
    case anychart.enums.Orientation.LEFT:
      axisGeoLine = scale.minimumX();
      edgeTickPosition = Number.MAX_VALUE;
      break;
  }

  var ticksValues = ticks.get();

  for (i = 0, len = ticksValues.length; i < len; i++) {
    if (this.isHorizontal()) {
      var y = scale.transform(ticksValues[i], axisGeoLine)[1];
      if (orientation == anychart.enums.Orientation.BOTTOM) {
        edgeTickPosition = Math.max(edgeTickPosition, y);
      } else {
        edgeTickPosition = Math.min(edgeTickPosition, y);
      }

    } else {
      var x = scale.transform(axisGeoLine, ticksValues[i])[0];
      if (orientation == anychart.enums.Orientation.LEFT) {
        edgeTickPosition = Math.min(edgeTickPosition, x);
      } else {
        edgeTickPosition = Math.max(edgeTickPosition, x);
      }
    }
  }

  bounds = goog.math.Rect.fromCoordinateBox(this.getLabelBounds_(i, true, ticksArr, tempBounds));
  size = this.isHorizontal() ? bounds.height : bounds.width;
  if (size > maxLabelSize) maxLabelSize = size;

  console.log(edgeTickPosition);

  return new anychart.math.Rect(0, 0, 0, 0);
};


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
      var axisBounds = this.getAffectingBoundsSize();
      // var padding = this.padding();
      // var heightOffset = parentBounds.height - padding.tightenHeight(parentBounds.height) + axisBounds.height;
      var heightOffset = parentBounds.height - axisBounds.height;
      // var widthOffset = parentBounds.width - padding.tightenWidth(parentBounds.width) + axisBounds.width;
      var widthOffset = parentBounds.width - axisBounds.width;

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


/**
 * Drop bounds cache.
 */
anychart.core.axes.Map.prototype.dropBoundsCache = function() {
  if (this.labelsBoundingRects_) this.labelsBoundingRects_.length = 0;
  this.labelsBounds_.length = 0;
  this.minorLabelsBounds_.length = 0;
  this.overlappedLabels_ = null;
};


//endregion
//region --- Drawing
//----------------------------------------------------------------------------------------------------------------------
//
//                                                  Axis Line
//
//----------------------------------------------------------------------------------------------------------------------
/**
 * Axis labels drawer.
 * @param {number|string} value Scale ratio.
 * @param {number} ratio Scale ratio.
 * @param {number} index Scale label index.
 * @param {number} pixelShift Pixel shift for sharp display.
 * @param {boolean} isMajor Is major label.
 * @param {Array} ticksArr
 * @private
 */
anychart.core.axes.Map.prototype.drawLabel_ = function(value, ratio, index, pixelShift, isMajor, ticksArr) {
  var bounds = this.getPixelBounds();
  var lineBounds = this.line.getBounds();

  var labels, ticks;
  if (isMajor) {
    ticks = /** @type {!anychart.core.axes.Ticks} */(this.ticks());
    labels = this.labels();
  } else {
    ticks = /** @type {!anychart.core.axes.Ticks} */(this.minorTicks());
    labels = this.minorLabels();
  }

  var stroke = this.stroke();
  var lineThickness = anychart.utils.isNone(stroke) ? 0 : stroke['thickness'] ? parseFloat(this.stroke()['thickness']) : 1;
  var labelBounds = anychart.math.Rect.fromCoordinateBox(this.getLabelBounds_(index, isMajor, ticksArr));
  var orientation = this.orientation();
  var staggerSize = 0;

  if (isMajor) {
    var incSize = true;
    if (this.currentStageLines_ > 1 && this.staggerMode()) {
      for (var i = 0, len = this.staggerLabelslines_.length; i < len; i++) {
        var line = this.staggerLabelslines_[i];
        for (var j = 0, len_ = line.length; j < len_; j++) {
          if (index == line[j]) {
            incSize = false;
            break;
          }
        }
        if (!incSize) break;
        staggerSize += this.linesSize_[i];
      }
    }
  }

  var x, y;
  var tickLength = this.getAffectBoundsTickLength(ticks, -1);
  switch (orientation) {
    case anychart.enums.Orientation.TOP:
      x = Math.round(bounds.left + ratio * bounds.width) + pixelShift;
      y = lineBounds.top - lineThickness / 2 - labelBounds.height / 2 - staggerSize - tickLength;
      break;
    case anychart.enums.Orientation.RIGHT:
      x = lineBounds.getRight() + lineThickness / 2 + labelBounds.width / 2 + staggerSize + tickLength;
      y = Math.round(bounds.top + bounds.height - ratio * bounds.height) + pixelShift;
      break;
    case anychart.enums.Orientation.BOTTOM:
      x = Math.round(bounds.left + ratio * bounds.width) + pixelShift;
      y = lineBounds.getBottom() + lineThickness / 2 + labelBounds.height / 2 + staggerSize + tickLength;
      break;
    case anychart.enums.Orientation.LEFT:
      x = lineBounds.left - lineThickness / 2 - labelBounds.width / 2 - staggerSize - tickLength;
      y = Math.round(bounds.top + bounds.height - ratio * bounds.height) + pixelShift;
      break;
  }

  var formatProvider = this.getLabelsFormatProvider(index, value);
  var positionProvider = {'value': {x: x, y: y}};

  labels.add(formatProvider, positionProvider, index);
};


/**
 * Create line.
 * @return {acgraph.vector.Element}
 * @protected
 */
anychart.core.axes.Map.prototype.getLine = function() {
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
anychart.core.axes.Map.prototype.drawTopLine = function(bounds, offset, size) {
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
anychart.core.axes.Map.prototype.drawRightLine = function(bounds, offset, size) {
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
anychart.core.axes.Map.prototype.drawBottomLine = function(bounds, offset, size) {
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
anychart.core.axes.Map.prototype.drawLeftLine = function(bounds, offset, size) {
  var x = bounds.left + bounds.width + lineThickness / 2;
  this.line
      .moveTo(x, bounds.top)
      .lineTo(x, bounds.top + bounds.height);
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

  // var bounds = this.getPixelBounds();

  // lineDrawer.call(this, bounds, 0, 0);

  // this.line.stroke(/** @type {acgraph.vector.Stroke} */(this.stroke()));
};


/** @inheritDoc */
anychart.core.axes.Map.prototype.remove = function() {
  if (this.title_) this.title_.remove();
  if (this.line) this.line.parent(null);
  this.ticks().remove();
  this.minorTicks().remove();
  if (this.labels_) this.labels_.remove();
  if (this.minorLabels_) this.minorLabels_.remove();
};


/** @inheritDoc */
anychart.core.axes.Map.prototype.checkDrawingNeeded = function() {
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


/**
 * Axis drawing.
 * @return {anychart.core.axes.Map} An instance of {@link anychart.core.axes.Map} class for method chaining.
 */
anychart.core.axes.Map.prototype.draw = function() {
  var scale = /** @type {anychart.scales.Linear|anychart.scales.Ordinal} */(this.scale());

  if (!scale) {
    anychart.core.reporting.error(anychart.enums.ErrorCode.SCALE_NOT_SET);
    return this;
  }

  if (!this.checkDrawingNeeded())
    return this;

  var ticksDrawer, minorTicksDrawer, pixelShift;
  var minorTicks, ticks;
  var lineThickness;
  var orientation = /** @type {anychart.enums.Orientation} */(this.orientation());

  this.title().suspendSignalsDispatching();
  this.labels().suspendSignalsDispatching();
  this.minorLabels().suspendSignalsDispatching();
  this.ticks().suspendSignalsDispatching();
  this.minorTicks().suspendSignalsDispatching();

  if (this.hasInvalidationState(anychart.ConsistencyState.APPEARANCE)) {
    this.drawLine();
    this.markConsistent(anychart.ConsistencyState.APPEARANCE);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.Z_INDEX)) {
    var zIndex = /** @type {number} */(this.zIndex());
    this.title().zIndex(zIndex);
    this.line.zIndex(zIndex);
    this.ticks().zIndex(zIndex);
    this.minorTicks().zIndex(zIndex);
    this.labels().zIndex(zIndex);
    this.minorLabels().zIndex(zIndex);
    this.markConsistent(anychart.ConsistencyState.Z_INDEX);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.CONTAINER)) {
    var container = /** @type {acgraph.vector.ILayer} */(this.container());
    this.title().container(container);
    this.line.parent(container);
    this.ticks().container(container);
    this.minorTicks().container(container);
    this.labels().container(container);
    this.minorLabels().container(container);
    this.markConsistent(anychart.ConsistencyState.CONTAINER);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.AXIS_TITLE)) {
    var title = this.title();
    // title.parentBounds(this.getPixelBounds());
    // title.setDefaultOrientation(orientation);
    // title.draw();
    this.markConsistent(anychart.ConsistencyState.AXIS_TITLE);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.AXIS_TICKS)) {
    // ticks = this.ticks();
    // ticks.orientation(/** @type {anychart.enums.Orientation} */ (orientation));
    // ticks.draw();
    // ticksDrawer = ticks.getTicksDrawer();
    //
    // minorTicks = this.minorTicks();
    // minorTicks.orientation(/** @type {anychart.enums.Orientation} */ (orientation));
    // minorTicks.draw();
    // minorTicksDrawer = minorTicks.getTicksDrawer();
    //
    // this.markConsistent(anychart.ConsistencyState.AXIS_TICKS);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.AXIS_LABELS)) {
    var labels = this.labels();
    if (!labels.container()) labels.container(/** @type {acgraph.vector.ILayer} */(this.container()));
    labels.parentBounds(/** @type {anychart.math.Rect} */(this.parentBounds()));
    labels.clear();

    var minorLabels = this.minorLabels();
    if (!minorLabels.container()) minorLabels.container(/** @type {acgraph.vector.ILayer} */(this.container()));
    minorLabels.parentBounds(/** @type {anychart.math.Rect} */(this.parentBounds()));
    minorLabels.clear();

    this.markConsistent(anychart.ConsistencyState.AXIS_LABELS);
  }

  // if (goog.isDef(ticksDrawer) || goog.isDef(minorTicksDrawer)) {
  //   var i, j, overlappedLabels, needDrawLabels, needDrawMinorLabels;
  //
  //   var scaleTicksArr = scale.ticks().get();
  //   var ticksArrLen = scaleTicksArr.length;
  //   var tickThickness = this.ticks().stroke()['thickness'] ? parseFloat(this.ticks_.stroke()['thickness']) : 1;
  //
  //   var tickVal, ratio, drawLabel, drawTick;
  //   var pixelBounds = this.getPixelBounds();
  //   var lineBounds = this.line.getBounds();
  //   var stroke = this.stroke();
  //   lineThickness = anychart.utils.isNone(stroke) ? 0 : stroke['thickness'] ? parseFloat(this.stroke()['thickness']) : 1;
  //
  //   if (scale instanceof anychart.scales.ScatterBase) {
  //     overlappedLabels = this.calcLabels_();
  //
  //     if (goog.isObject(overlappedLabels)) {
  //       needDrawLabels = overlappedLabels.labels;
  //       needDrawMinorLabels = overlappedLabels.minorLabels;
  //     } else {
  //       needDrawLabels = !overlappedLabels;
  //       needDrawMinorLabels = !overlappedLabels;
  //     }
  //
  //     var scaleMinorTicksArr = scale.minorTicks().get();
  //     var minorTickThickness = this.minorTicks_.stroke()['thickness'] ? parseFloat(this.minorTicks_.stroke()['thickness']) : 1;
  //
  //     i = 0;
  //     j = 0;
  //     var minorTicksArrLen = scaleMinorTicksArr.length;
  //     var minorTickVal, minorRatio, prevMajorRatio;
  //
  //     while (i < ticksArrLen || j < minorTicksArrLen) {
  //       tickVal = scaleTicksArr[i];
  //       minorTickVal = scaleMinorTicksArr[j];
  //       ratio = scale.transform(tickVal);
  //       minorRatio = scale.transform(minorTickVal);
  //
  //       if (((ratio <= minorRatio && i < ticksArrLen) || j == minorTicksArrLen)) {
  //         var majorPixelShift = tickThickness % 2 == 0 ? 0 : -.5;
  //         drawLabel = goog.isArray(needDrawLabels) ? needDrawLabels[i] : needDrawLabels;
  //         drawTick = (goog.isArray(needDrawLabels) && needDrawLabels[i]) || goog.isBoolean(needDrawLabels);
  //         if (drawTick && ticksDrawer)
  //           ticksDrawer.call(
  //               ticks,
  //               ratio,
  //               pixelBounds,
  //               lineBounds,
  //               lineThickness,
  //               majorPixelShift);
  //
  //         if (drawLabel)
  //           this.drawLabel_(tickVal, scale.transform(tickVal, .5), i, majorPixelShift, true, scaleTicksArr);
  //         prevMajorRatio = ratio;
  //         i++;
  //       } else {
  //         var minorPixelShift = minorTickThickness % 2 == 0 ? 0 : -.5;
  //         drawLabel = goog.isArray(needDrawMinorLabels) ? needDrawMinorLabels[j] : needDrawMinorLabels;
  //         drawTick = (goog.isArray(needDrawMinorLabels) && needDrawMinorLabels[j]) || goog.isBoolean(needDrawMinorLabels);
  //
  //         if (drawTick && minorTicksDrawer && prevMajorRatio != minorRatio)
  //           minorTicksDrawer.call(
  //               minorTicks,
  //               minorRatio,
  //               pixelBounds,
  //               lineBounds,
  //               lineThickness,
  //               minorPixelShift);
  //
  //         if (drawLabel && prevMajorRatio != minorRatio)
  //           this.drawLabel_(minorTickVal, scale.transform(minorTickVal, .5), j, minorPixelShift, false, scaleMinorTicksArr);
  //         j++;
  //       }
  //     }
  //     if (needDrawMinorLabels) this.minorLabels().draw();
  //
  //   }
  //
  //   this.labels().draw();
  // }

  this.title().resumeSignalsDispatching(false);
  this.labels().resumeSignalsDispatching(false);
  this.minorLabels().resumeSignalsDispatching(false);
  this.ticks().resumeSignalsDispatching(false);
  this.minorTicks().resumeSignalsDispatching(false);

  return this;
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
