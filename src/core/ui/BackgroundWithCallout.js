goog.provide('anychart.core.ui.BackgroundWithCallout');
goog.require('acgraph');
goog.require('anychart.core.ui.Background');



/**
 * Background with callout element class.
 * @extends {anychart.core.ui.Background}
 * @constructor
 */
anychart.core.ui.BackgroundWithCallout = function() {
  this.suspendSignalsDispatching();
  goog.base(this);

  /**
   * Graphics element that represents background path.
   * @type {acgraph.vector.Path}
   * @private
   */
  this.path_ = null;

  this.callout_ = {
    side: 'top',
    offset: 125,
    width: 50,
    height: 20
  };

  this.resumeSignalsDispatching(false);
};
goog.inherits(anychart.core.ui.BackgroundWithCallout, anychart.core.ui.Background);


/**
 * Supported signals.
 * @type {number}
 */
anychart.core.ui.BackgroundWithCallout.prototype.SUPPORTED_SIGNALS =
    anychart.core.ui.Background.prototype.SUPPORTED_SIGNALS;


/**
 * Supported consistency states.
 * @type {number}
 */
anychart.core.ui.BackgroundWithCallout.prototype.SUPPORTED_CONSISTENCY_STATES =
    anychart.core.ui.Background.prototype.SUPPORTED_CONSISTENCY_STATES;


//----------------------------------------------------------------------------------------------------------------------
//
//  Corners.
//
//----------------------------------------------------------------------------------------------------------------------
/**
 * Getter for current corner radius.
 * @param {(number|string|Array.<number|string>)=} opt_value .
 * @return {(Array.<number|string>|!anychart.core.ui.Background)} .
 */
anychart.core.ui.BackgroundWithCallout.prototype.corners = function(opt_value) {
  if (goog.isDef(opt_value)) {
    var val;
    if (goog.isArray(opt_value)) {
      val = opt_value;
    } else if (goog.isObject(opt_value)) {
      val = [
        anychart.utils.toNumber(opt_value['leftTop']) || 0,
        anychart.utils.toNumber(opt_value['rightTop']) || 0,
        anychart.utils.toNumber(opt_value['rightBottom']) || 0,
        anychart.utils.toNumber(opt_value['leftBottom']) || 0
      ];
    } else {
      val = goog.array.slice(arguments, 0);
    }
    if (!goog.array.equals(val, this.corners_)) {
      this.corners_ = val;
      this.invalidate(anychart.ConsistencyState.APPEARANCE, anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  } else {
    return this.corners_;
  }
};


/**
 * Getter for current corner type.
 * @param {(anychart.enums.BackgroundCornersType|string)=} opt_value Corner type.
 * @return {anychart.enums.BackgroundCornersType|!anychart.core.ui.Background} Corners type or self for method chaining.
 */
anychart.core.ui.BackgroundWithCallout.prototype.cornerType = function(opt_value) {
  if (goog.isDef(opt_value)) {
    opt_value = anychart.enums.normalizeBackgroundCornerType(opt_value);
    if (opt_value != this.cornerType_) {
      this.cornerType_ = opt_value;
      this.invalidate(anychart.ConsistencyState.APPEARANCE, anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  } else {
    // that is so easy to fix it like that...
    return this.cornerType_;
  }
};


/**
 * Returns current fill.
 * @param {(!acgraph.vector.Fill|!Array.<(acgraph.vector.GradientKey|string)>|null)=} opt_fillOrColorOrKeys .
 * @param {number=} opt_opacityOrAngleOrCx .
 * @param {(number|boolean|!acgraph.math.Rect|!{left:number,top:number,width:number,height:number})=} opt_modeOrCy .
 * @param {(number|!acgraph.math.Rect|!{left:number,top:number,width:number,height:number}|null)=} opt_opacityOrMode .
 * @param {number=} opt_opacity .
 * @param {number=} opt_fx .
 * @param {number=} opt_fy .
 * @return {!(acgraph.vector.Fill|anychart.core.ui.Background)} .
 */
anychart.core.ui.BackgroundWithCallout.prototype.fill = function(opt_fillOrColorOrKeys, opt_opacityOrAngleOrCx, opt_modeOrCy, opt_opacityOrMode, opt_opacity, opt_fx, opt_fy) {
  if (goog.isDef(opt_fillOrColorOrKeys)) {
    var val = acgraph.vector.normalizeFill.apply(null, arguments);
    if (!anychart.color.equals(this.fill_, val)) {
      this.fill_ = val;
      this.invalidate(anychart.ConsistencyState.APPEARANCE, anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  } else {
    return this.fill_ || 'none';
  }
};


/**
 * Returns current stroke.
 * @param {(acgraph.vector.Stroke|acgraph.vector.ColoredFill|string|null)=} opt_strokeOrFill .
 * @param {number=} opt_thickness .
 * @param {string=} opt_dashpattern .
 * @param {acgraph.vector.StrokeLineJoin=} opt_lineJoin .
 * @param {acgraph.vector.StrokeLineCap=} opt_lineCap .
 * @return {(!anychart.core.ui.Background|acgraph.vector.Stroke)} .
 */
anychart.core.ui.BackgroundWithCallout.prototype.stroke = function(opt_strokeOrFill, opt_thickness, opt_dashpattern, opt_lineJoin, opt_lineCap) {
  if (goog.isDef(opt_strokeOrFill)) {
    var val = acgraph.vector.normalizeStroke.apply(null, arguments);
    if (!anychart.color.equals(val, this.stroke_)) {
      var state = anychart.ConsistencyState.APPEARANCE;
      var signal = anychart.Signal.NEEDS_REDRAW;
      if (acgraph.vector.getThickness(val) != acgraph.vector.getThickness(this.stroke_)) {
        state |= anychart.ConsistencyState.BOUNDS;
        state |= anychart.Signal.BOUNDS_CHANGED;
      }
      this.stroke_ = val;
      this.invalidate(state, signal);
    }
    return this;
  } else {
    return this.stroke_ || 'none';
  }
};


/**
 * Pointer events.
 * @param {boolean=} opt_value
 * @return {!anychart.core.ui.Background|boolean}
 */
anychart.core.ui.BackgroundWithCallout.prototype.disablePointerEvents = function(opt_value) {
  if (goog.isDef(opt_value)) {
    opt_value = !!opt_value;
    if (opt_value != this.disablePointerEvents_) {
      this.disablePointerEvents_ = opt_value;
      this.invalidate(anychart.ConsistencyState.BACKGROUND_POINTER_EVENTS, anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  } else {
    return this.disablePointerEvents_;
  }
};

//calloutWidth
//calloutHeight


/**
 * Applies callout size to a rect, creating a new tighten rectangle.
 * @param {!anychart.math.Rect} boundsRect Rectangle to apply callout size to.
 * @return {!anychart.math.Rect} New rectangle with applied callout size.
 */
anychart.core.ui.BackgroundWithCallout.prototype.widenBounds = function(boundsRect) {
  //todo: учесть ориентацию каллаута

  return new anychart.math.Rect(
      boundsRect.left,
      boundsRect.top,
      boundsRect.width,
      boundsRect.height + this.callout_.height
  );
};


/** @inheritDoc */
anychart.core.ui.BackgroundWithCallout.prototype.getRemainingBounds = function() {
  var remainingBounds = goog.base(this, 'getRemainingBounds');

  //todo: учесть ориентацию каллаута

  return new anychart.math.Rect(
      remainingBounds.left,
      remainingBounds.top + this.callout_.height,
      remainingBounds.width,
      remainingBounds.height - this.callout_.height
  );
};


/**
 * Render background.
 * @return {!anychart.core.ui.Background} {@link anychart.core.ui.Background} instance for method chaining.
 */
anychart.core.ui.BackgroundWithCallout.prototype.draw = function() {
  if (!this.checkDrawingNeeded())
    return this;

  if (!this.path_) {
    this.path_ = acgraph.path();
    this.registerDisposable(this.path_);
  }

  var stage = this.container() ? this.container().getStage() : null;
  var manualSuspend = stage && !stage.isSuspended();
  if (manualSuspend) stage.suspend();

  //if (this.hasInvalidationState(anychart.ConsistencyState.BACKGROUND_POINTER_EVENTS)) {
  //  this.path_.disablePointerEvents(this.disablePointerEvents_);
  //  this.markConsistent(anychart.ConsistencyState.BACKGROUND_POINTER_EVENTS);
  //}

  if (this.hasInvalidationState(anychart.ConsistencyState.BOUNDS)) {
    var bounds = this.getPixelBounds();
    var thicknessHalf = this.path_.strokeThickness() / 2;
    //TODO(Anton Saukh): remove this fix when graphics is fixed.
    if (isNaN(thicknessHalf)) thicknessHalf = .5;
    bounds.left += thicknessHalf;
    bounds.top += thicknessHalf;
    bounds.width -= thicknessHalf + thicknessHalf;
    bounds.height -= thicknessHalf + thicknessHalf;
    //this.path_.setBounds(bounds);
    this.markConsistent(anychart.ConsistencyState.BOUNDS);

    if (goog.isObject(this.fill_) && ('keys' in this.fill_ || 'src' in this.fill_))
      this.invalidate(anychart.ConsistencyState.APPEARANCE);
  }

  var calloutHalfWidth = this.callout_.width / 2;
  var calloutHalfHeight = this.callout_.height / 2;
  var remainingWidth = bounds.left + bounds.right - this.callout_.width;
  var remainingHeight = bounds.top + bounds.height - this.callout_.height;

  console.log(bounds);
  this.path_.moveToInternal(bounds.left, bounds.top + this.callout_.height);

  this.path_.lineToInternal(bounds.left + this.callout_.offset, bounds.top + this.callout_.height);
  this.path_.lineToInternal(bounds.left + this.callout_.offset + calloutHalfWidth, bounds.top);
  this.path_.lineToInternal(bounds.left + this.callout_.offset + this.callout_.width, bounds.top + this.callout_.height);
  this.path_.lineToInternal(bounds.left + bounds.width, bounds.top + this.callout_.height);

  this.path_.lineToInternal(bounds.left + bounds.width, bounds.top + bounds.height);
  this.path_.lineToInternal(bounds.left, bounds.top + bounds.height);
  this.path_.lineToInternal(bounds.left, bounds.top + this.callout_.height);
  this.path_.closeInternal();


  if (this.hasInvalidationState(anychart.ConsistencyState.APPEARANCE)) {
    this.path_.fill(this.fill_);
    this.path_.stroke(this.stroke_);
    //switch (this.cornerType_) {
    //  case anychart.enums.BackgroundCornersType.ROUND:
    //    this.path_.round.apply(this.path_, this.corners_);
    //    break;
    //  case anychart.enums.BackgroundCornersType.CUT:
    //    this.path_.cut.apply(this.path_, this.corners_);
    //    break;
    //  case anychart.enums.BackgroundCornersType.ROUND_INNER:
    //    this.path_.roundInner.apply(this.path_, this.corners_);
    //    break;
    //  default:
    //    this.path_.cut(0);
    //    break;
    //}
    this.markConsistent(anychart.ConsistencyState.APPEARANCE);
  }

  //if (this.hasInvalidationState(anychart.ConsistencyState.Z_INDEX)) {
  //  this.path_.zIndex(/** @type {number} */(this.zIndex()));
  //  this.markConsistent(anychart.ConsistencyState.Z_INDEX);
  //}

  if (this.hasInvalidationState(anychart.ConsistencyState.CONTAINER)) {
    this.path_.parent(/** @type {acgraph.vector.ILayer} */(this.container()));
    this.markConsistent(anychart.ConsistencyState.CONTAINER);
  }

  if (manualSuspend) stage.resume();

  return this;
};


/** @inheritDoc */
anychart.core.ui.BackgroundWithCallout.prototype.remove = function() {
  if (this.path_) this.path_.parent(null);
};


/** @inheritDoc */
anychart.core.ui.BackgroundWithCallout.prototype.serialize = function() {
  var json = goog.base(this, 'serialize');

  if (this.fill_) {
    json['fill'] = anychart.color.serialize(/** @type {acgraph.vector.Fill} */(this.fill()));
  }

  if (this.stroke_) {
    json['stroke'] = anychart.color.serialize(/** @type {acgraph.vector.Stroke} */(this.stroke()));
  }

  json['cornerType'] = this.cornerType();
  var corners = /** @type {Array} */(this.corners());
  if (corners.length >= 4) {
    corners = {
      'leftTop': corners[0],
      'rightTop': corners[1],
      'rightBottom': corners[2],
      'leftBottom': corners[3]
    };
  } else {
    corners = corners[0];
  }
  json['corners'] = corners;
  return json;
};


/** @inheritDoc */
anychart.core.ui.BackgroundWithCallout.prototype.setupSpecial = function(var_args) {
  var args = arguments;
  if (goog.isString(args[0])) {
    this.fill(args[0]);
    this.stroke(null);
    this.enabled(true);
    return true;
  }
  return anychart.core.VisualBaseWithBounds.prototype.setupSpecial.apply(this, arguments);
};


/** @inheritDoc */
anychart.core.ui.BackgroundWithCallout.prototype.setupByJSON = function(config) {
  goog.base(this, 'setupByJSON', config);
  this.fill(config['fill']);
  this.stroke(config['stroke']);
  this.cornerType(config['cornerType']);
  this.corners(config['corners']);
};


//exports
anychart.core.ui.BackgroundWithCallout.prototype['fill'] = anychart.core.ui.BackgroundWithCallout.prototype.fill;//in docs/final
anychart.core.ui.BackgroundWithCallout.prototype['stroke'] = anychart.core.ui.BackgroundWithCallout.prototype.stroke;//in docs/final
anychart.core.ui.BackgroundWithCallout.prototype['cornerType'] = anychart.core.ui.BackgroundWithCallout.prototype.cornerType;//in docs/final
anychart.core.ui.BackgroundWithCallout.prototype['corners'] = anychart.core.ui.BackgroundWithCallout.prototype.corners;//in docs/final
