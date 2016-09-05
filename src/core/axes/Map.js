//region --- Requiring and Providing
goog.provide('anychart.core.axes.Map');
goog.require('anychart.core.VisualBase');
goog.require('anychart.core.axes.MapTicks');
goog.require('anychart.core.utils.MapAxisLabelsContextProvider');
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
 * @type {anychart.scales.Geo}
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
  return new anychart.core.axes.MapTicks(this.scale_);
};


/**
 * Getter/setter for ticks.
 * @param {(Object|boolean|null)=} opt_value Axis ticks.
 * @return {!(anychart.core.axes.MapTicks|anychart.core.axes.Map)} Axis ticks or itself for method chaining.
 */
anychart.core.axes.Map.prototype.ticks = function(opt_value) {
  if (!this.ticks_) {
    this.ticks_ = this.createTicks();
    this.ticks_.orientation(/** @type {anychart.enums.Orientation} */ (this.orientation()));
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
 * Gets format provider for label.
 * @param {number} index Label index.
 * @param {string|number} value Label value.
 * @return {Object} Labels format provider.
 * @protected
 */
anychart.core.axes.Map.prototype.getLabelsFormatProvider = function(index, value) {
  return new anychart.core.utils.MapAxisLabelsContextProvider(this, index, value);
};


anychart.core.axes.Map.prototype.getLabelRotation_ = function(tickAngle) {
  var angle;
  switch (this.orientation()) {
    case anychart.enums.Orientation.TOP:
      angle = goog.math.toDegrees(tickAngle) + 90;
      break;
    case anychart.enums.Orientation.RIGHT:
      angle = goog.math.toDegrees(tickAngle);
      break;
    case anychart.enums.Orientation.BOTTOM:
      angle = goog.math.toDegrees(tickAngle) - 90;
      break;
    case anychart.enums.Orientation.LEFT:
      angle = goog.math.toDegrees(tickAngle) - 180;
      break;
  }

  return angle;
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
  // if (goog.isDef(boundsCache[index]))
  //   return boundsCache[index];

  // var bounds = goog.isDef(opt_parentBounds) ? opt_parentBounds : this.getPixelBounds();
  // var lineBounds = goog.isDef(opt_parentBounds) ? opt_parentBounds : this.line.getBounds();
  var ticks = isMajor ? this.ticks() : this.minorTicks();
  // var ticksLength = ticks.length();
  // var stroke = this.stroke();
  // var lineThickness = (!goog.isDef(stroke) || anychart.utils.isNone(stroke)) ? 0 : stroke['thickness'] ? parseFloat(this.stroke()['thickness']) : 1;

  var labels = isMajor ? this.labels() : this.minorLabels();

  var x, y;
  var scale = /** @type {anychart.scales.Geo} */(this.scale());

  var value = ticksArray[index];
  // var ratio;
  // if (goog.isArray(value)) {
  //   ratio = (scale.transform(value[0], 0) + scale.transform(value[1], 1)) / 2;
  //   value = value[0];
  // } else {
  //   ratio = scale.transform(value, .5);
  // }

  // var tickCoords;
  // if (this.isHorizontal()) {
  //   tickCoords = scale.transform(value, this.axisGeoLine);
  // } else {
  //   tickCoords = scale.transform(this.axisGeoLine, value);
  // }

  var tickCoords = ticks.calcTick(value);

  x = tickCoords[2];
  y = tickCoords[3];

  var formatProvider = this.getLabelsFormatProvider(index, value);
  var positionProvider = {'value': {'x': x, 'y': y}};

  var settings = labels.getChangedSettings();
  settings['rotation'] = this.getLabelRotation_(tickCoords[4]);

  var labelBounds = labels.measure(formatProvider, positionProvider, settings, index);

  return boundsCache[index] = labelBounds.toCoordinateBox();
};


//endregion
//region --- Bounds
/**
 *
 * @return {anychart.math.Rect}
 */
anychart.core.axes.Map.prototype.getAffectingBounds = function() {
  var bounds, size, i, delta, len;
  var maxLabelSize = 0;
  var maxMinorLabelSize = 0;
  var titleBounds;
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
    titleBounds = title.getContentBounds();
    title.resumeSignalsDispatching(false);
  }

  var scale = /** @type {anychart.scales.Geo} */(this.scale());

  var isLabels = /** @type {boolean} */(labels.enabled() && goog.isDef(scale));
  var isMinorLabels = /** @type {boolean} */(minorLabels.enabled() && goog.isDef(scale));

  scale.setBounds(parentBounds);
  scale.calculate();

  var scaleTicks;
  if (this.isHorizontal()) {
    scaleTicks = this.scale().xTicks();
  } else {
    scaleTicks = this.scale().yTicks();
  }

  // switch (orientation) {
  //   case anychart.enums.Orientation.TOP:
  //     this.axisGeoLine = scale.maximumY();
  //     break;
  //   case anychart.enums.Orientation.RIGHT:
  //     this.axisGeoLine = scale.maximumX();
  //     break;
  //   case anychart.enums.Orientation.BOTTOM:
  //     this.axisGeoLine = scale.minimumY();
  //     break;
  //   case anychart.enums.Orientation.LEFT:
  //     this.axisGeoLine = scale.minimumX();
  //     break;
  // }

  var tempBounds = new anychart.math.Rect(0, 0, 1, 1);

  var ticksArr = scaleTicks.get();
  var axisTicks = this.ticks();
  axisTicks.setScale(scale);

  var tickIndex, ticksBounds, resultBounds;
  for (i = 0, len = ticksArr.length; i < len; i++) {
    // var tickVal = ticksArr[i];
    // var tickBounds = axisTicks.getTickBounds(tickVal);
    // if (!ticksBounds) ticksBounds = tickBounds;
    // else ticksBounds.boundingRect(tickBounds);

    bounds = goog.math.Rect.fromCoordinateBox(this.getLabelBounds_(i, true, ticksArr, tempBounds));

    // if (!this['labelB' + i]) this['labelB' + i] = stage.rect().zIndex(1000);
    // this['labelB' + i].setBounds(bounds);

    if (!resultBounds) {
      resultBounds = bounds;
    } else {
      resultBounds.boundingRect(bounds);
    }
  }

  if (titleBounds)
    resultBounds.boundingRect(titleBounds);

  return resultBounds;
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
    var remainingBounds;

    if (this.scale() && this.enabled()) {
      remainingBounds = this.getAffectingBounds();
    } else {
      remainingBounds = parentBounds.clone();
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
anychart.core.axes.Map.prototype.drawLabel_ = function(value, isMajor, index) {
  var ticks = isMajor ? this.ticks() : this.minorTicks();
  var labels = isMajor ? this.labels() : this.minorLabels();

  var coords = ticks.calcTick(value);
  var x = coords[2];
  var y = coords[3];

  var formatProvider = this.getLabelsFormatProvider(index, value);
  var positionProvider = {'value': {x: x, y: y}};

  var label = labels.add(formatProvider, positionProvider, index);
  label.rotation(this.getLabelRotation_(coords[4]));
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
 * @protected
 */
anychart.core.axes.Map.prototype.drawTopLine = function() {
  var scale = this.scale();
  var xy;

  var currLong = scale.minimumX();
  while (currLong < scale.maximumX()) {
    xy = scale.transform(currLong, scale.maximumY());
    if (currLong == scale.minimumX()) {
      this.line.moveTo(xy[0], xy[1]);
    } else {
      this.line.lineTo(xy[0], xy[1]);
    }
    currLong += 1;
  }
  xy = scale.transform(scale.maximumX(), scale.maximumY());
  this.line.lineTo(xy[0], xy[1]);
};


/**
 * Axis line drawer for right orientation.
 * @protected
 */
anychart.core.axes.Map.prototype.drawRightLine = function() {
  var scale = this.scale();
  var xy;

  var currLat = scale.maximumY();
  while (currLat > scale.minimumY()) {
    xy = scale.transform(scale.maximumX(), currLat);
    if (currLat == scale.maximumY()) {
      this.line.moveTo(xy[0], xy[1]);
    } else {
      this.line.lineTo(xy[0], xy[1]);
    }
    currLat -= 1;
  }
  xy = scale.transform(scale.maximumX(), scale.minimumY());
  this.line.lineTo(xy[0], xy[1]);
};


/**
 * Axis line drawer for bottom orientation.
 * @protected
 */
anychart.core.axes.Map.prototype.drawBottomLine = function() {
  var scale = this.scale();
  var xy;

  var currLong = scale.maximumX();
  while (currLong > scale.minimumX()) {
    xy = scale.transform(currLong, scale.minimumY());
    if (currLong == scale.maximumX()) {
      this.line.moveTo(xy[0], xy[1]);
    } else {
      this.line.lineTo(xy[0], xy[1]);
    }
    currLong -= 1;
  }
  xy = scale.transform(scale.minimumX(), scale.minimumY());
  this.line.lineTo(xy[0], xy[1]);
};


/**
 * Axis line drawer for left orientation.
 * @protected
 */
anychart.core.axes.Map.prototype.drawLeftLine = function() {
  var scale = this.scale();
  var xy = scale.transform(scale.minimumX(), scale.minimumY());

  this.line.moveTo(xy[0], xy[1]);
  var currLat = scale.minimumY();
  while (currLat < scale.maximumY()) {
    xy = scale.transform(scale.minimumX(), currLat);
    if (currLat == scale.minimumY()) {
      this.line.moveTo(xy[0], xy[1]);
    } else {
      this.line.lineTo(xy[0], xy[1]);
    }
    currLat += 1;
  }
  xy = scale.transform(scale.minimumX(), scale.maximumY());
  this.line.lineTo(xy[0], xy[1]);
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

  lineDrawer.call(this);
  this.line.stroke(/** @type {acgraph.vector.Stroke} */(this.stroke()));
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
    ticks = this.ticks();
    ticks.setScale(this.scale());
    ticks.draw();
    ticksDrawer = ticks.getTicksDrawer();

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

  if (goog.isDef(ticksDrawer) || goog.isDef(minorTicksDrawer)) {
    var i, j, overlappedLabels, needDrawLabels, needDrawMinorLabels;


    var scaleTicks;
    if (this.isHorizontal()) {
      scaleTicks = this.scale().xTicks();
    } else {
      scaleTicks = this.scale().yTicks();
    }

    var scaleTicksArr = scaleTicks.get();
    var ticksArrLen = scaleTicksArr.length;
    // var tickThickness = this.ticks().stroke()['thickness'] ? parseFloat(this.ticks_.stroke()['thickness']) : 1;

    var tickVal, ratio, drawLabel, drawTick;
    // var pixelBounds = this.getPixelBounds();
    // var lineBounds = this.line.getBounds();
    // var stroke = this.stroke();
    // lineThickness = anychart.utils.isNone(stroke) ? 0 : stroke['thickness'] ? parseFloat(this.stroke()['thickness']) : 1;

    for (i = 0; i < ticksArrLen; i++) {
      tickVal = scaleTicksArr[i];
      ticksDrawer.call(ticks, tickVal);

      this.drawLabel_(tickVal, true, i);
    }
    this.labels().draw();

    // overlappedLabels = this.calcLabels_();
    //
    // if (goog.isObject(overlappedLabels)) {
    //   needDrawLabels = overlappedLabels.labels;
    //   needDrawMinorLabels = overlappedLabels.minorLabels;
    // } else {
    //   needDrawLabels = !overlappedLabels;
    //   needDrawMinorLabels = !overlappedLabels;
    // }

    // var scaleMinorTicksArr = scale.minorTicks().get();
    // var minorTickThickness = this.minorTicks_.stroke()['thickness'] ? parseFloat(this.minorTicks_.stroke()['thickness']) : 1;
    //
    // i = 0;
    // j = 0;
    // var minorTicksArrLen = scaleMinorTicksArr.length;
    // var minorTickVal, minorRatio, prevMajorRatio;
    //
    // while (i < ticksArrLen || j < minorTicksArrLen) {
    //   tickVal = scaleTicksArr[i];
    //   // minorTickVal = scaleMinorTicksArr[j];
    //   // ratio = scale.transform(tickVal);
    //   // minorRatio = scale.transform(minorTickVal);
    //
    //   if (((ratio <= minorRatio && i < ticksArrLen) || j == minorTicksArrLen)) {
    //     var majorPixelShift = tickThickness % 2 == 0 ? 0 : -.5;
    //     drawLabel = goog.isArray(needDrawLabels) ? needDrawLabels[i] : needDrawLabels;
    //     drawTick = (goog.isArray(needDrawLabels) && needDrawLabels[i]) || goog.isBoolean(needDrawLabels);
    //     if (drawTick && ticksDrawer)
    //       ticksDrawer.call(
    //           ticks,
    //           ratio,
    //           pixelBounds,
    //           lineBounds,
    //           lineThickness,
    //           majorPixelShift);
    //
    //     if (drawLabel)
    //       this.drawLabel_(tickVal, scale.transform(tickVal, .5), i, majorPixelShift, true, scaleTicksArr);
    //     prevMajorRatio = ratio;
    //     i++;
    //   } else {
    //     var minorPixelShift = minorTickThickness % 2 == 0 ? 0 : -.5;
    //     drawLabel = goog.isArray(needDrawMinorLabels) ? needDrawMinorLabels[j] : needDrawMinorLabels;
    //     drawTick = (goog.isArray(needDrawMinorLabels) && needDrawMinorLabels[j]) || goog.isBoolean(needDrawMinorLabels);
    //
    //     if (drawTick && minorTicksDrawer && prevMajorRatio != minorRatio)
    //       minorTicksDrawer.call(
    //           minorTicks,
    //           minorRatio,
    //           pixelBounds,
    //           lineBounds,
    //           lineThickness,
    //           minorPixelShift);
    //
    //     if (drawLabel && prevMajorRatio != minorRatio)
    //       this.drawLabel_(minorTickVal, scale.transform(minorTickVal, .5), j, minorPixelShift, false, scaleMinorTicksArr);
    //     j++;
    //   }
    // }
    // if (needDrawMinorLabels) this.minorLabels().draw();
    //
    //
    // this.labels().draw();
  }

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

  json['enabled'] = this.enabled();
  json['title'] = this.title_.serialize();
  json['stroke'] = anychart.color.serialize(/** @type {acgraph.vector.Stroke} */(this.stroke()));
  json['ticks'] = this.ticks().serialize();
  json['minorTicks'] = this.minorTicks().serialize();
  json['labels'] = this.labels().serialize();
  json['minorLabels'] = this.minorLabels().serialize();
};


/** @inheritDoc */
anychart.core.axes.Map.prototype.disposeInternal = function() {
  anychart.core.axes.Map.base(this, 'disposeInternal');
};


//endregion
//region --- Exports

//exports
// anychart.core.axes.Linear.prototype['staggerMode'] = anychart.core.axes.Linear.prototype.staggerMode;
// anychart.core.axes.Linear.prototype['staggerLines'] = anychart.core.axes.Linear.prototype.staggerLines;
// anychart.core.axes.Linear.prototype['staggerMaxLines'] = anychart.core.axes.Linear.prototype.staggerMaxLines;
anychart.core.axes.Map.prototype['title'] = anychart.core.axes.Map.prototype.title;
anychart.core.axes.Map.prototype['labels'] = anychart.core.axes.Map.prototype.labels;
// anychart.core.axes.Linear.prototype['minorLabels'] = anychart.core.axes.Linear.prototype.minorLabels;
anychart.core.axes.Map.prototype['ticks'] = anychart.core.axes.Map.prototype.ticks;
// anychart.core.axes.Linear.prototype['minorTicks'] = anychart.core.axes.Linear.prototype.minorTicks;
anychart.core.axes.Map.prototype['stroke'] = anychart.core.axes.Map.prototype.stroke;
// anychart.core.axes.Linear.prototype['orientation'] = anychart.core.axes.Linear.prototype.orientation;
// anychart.core.axes.Linear.prototype['scale'] = anychart.core.axes.Linear.prototype.scale;
// anychart.core.axes.Linear.prototype['width'] = anychart.core.axes.Linear.prototype.width;
// anychart.core.axes.Linear.prototype['getRemainingBounds'] = anychart.core.axes.Linear.prototype.getRemainingBounds;
// anychart.core.axes.Linear.prototype['drawFirstLabel'] = anychart.core.axes.Linear.prototype.drawFirstLabel;
// anychart.core.axes.Linear.prototype['drawLastLabel'] = anychart.core.axes.Linear.prototype.drawLastLabel;
// anychart.core.axes.Linear.prototype['overlapMode'] = anychart.core.axes.Linear.prototype.overlapMode;
// anychart.core.axes.Linear.prototype['isHorizontal'] = anychart.core.axes.Linear.prototype.isHorizontal;
//endregion
