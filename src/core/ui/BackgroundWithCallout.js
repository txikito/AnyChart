goog.provide('anychart.core.ui.BackgroundWithCallout');
goog.require('acgraph');
goog.require('anychart.core.ui.Background');



/**
 * Background with callout element class.
 * Used for tooltip.
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

  /**
   * We add a default here, because too many backgrounds are created in too many places to put this default there.
   * @type {anychart.enums.BackgroundCornersType}
   * @private
   */
  this.cornerType_ = anychart.enums.BackgroundCornersType.ROUND;

  /**
   * @type {!Array}
   * @private
   */
  this.corners_ = [0];

  /**
   *
   * @type {Array.<(acgraph.vector.Rect.CornerType|undefined)>}
   * @private
   */
  this.cornerTypes_ = [];

  /**
   *
   * @type {Array.<(number)>}
   * @private
   */
  this.cornerSizes_ = [0, 0, 0, 0];

  /**
   * Fill settings.
   * @type {acgraph.vector.Fill}
   * @private
   */
  this.fill_ = 'none';

  /**
   * Stroke settings.
   * @type {acgraph.vector.Stroke}
   * @private
   */
  this.stroke_ = 'none';

  /**
   * Width in pixels or a percentage of the total width of the background.
   * @type {number|string}
   * @private
   */
  this.calloutWidth_ = 15;//0; todo: to defaults 15

  /**
   * Height in pixels or a percentage of the total width of the background.
   * @type {number|string}
   * @private
   */
  this.calloutHeight_ = 8;//0; todo: to defaults 8

  /**
   *
   * @type {anychart.enums.Orientation|false}
   * @private
   */
  this.calloutOrientation_ = anychart.enums.Orientation.BOTTOM;//null; todo: to defaults BOTTOM

  this.calloutShift_ = '50%';//null; todo: to defaults '50%'

  /**
   * Pointer events.
   * @type {boolean}
   * @private
   */
  this.disablePointerEvents_ = false;

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
 * @param {(number|string|Array.<number|string>)=} opt_value
 * @return {(Array.<number|string>|!anychart.core.ui.Background)}
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
 * Sets corner type and radius.
 * @param {acgraph.vector.Rect.CornerType} type Corner type.
 * @param {...(number|string)} var_args Set of radii. Can be set with one value,
 * four values, or string with four numbers. If radius is zero - corner looks usual.
 * @private
 */
anychart.core.ui.BackgroundWithCallout.prototype.setCornerSettings_ = function(type, var_args) {
  var topLeft, topRight, bottomRight, bottomLeft, radiusArr;
  var args = goog.array.slice(arguments, 1);
  var arg1 = args[0];

  if (goog.isString(arg1)) radiusArr = goog.string.splitLimit(arg1, ' ', 4);
  else radiusArr = args;

  if (radiusArr.length < 4) {
    bottomLeft = bottomRight = topRight = topLeft = parseFloat(radiusArr[0]);
  } else {
    topLeft = parseFloat(radiusArr[0]);
    topRight = parseFloat(radiusArr[1]);
    bottomRight = parseFloat(radiusArr[2]);
    bottomLeft = parseFloat(radiusArr[3]);
  }

  this.cornerSizes_[0] = topLeft ? topLeft : 0;
  this.cornerTypes_[0] = topLeft ? type : undefined;

  this.cornerSizes_[1] = topRight ? topRight : 0;
  this.cornerTypes_[1] = topRight ? type : undefined;

  this.cornerSizes_[2] = bottomRight ? bottomRight : 0;
  this.cornerTypes_[2] = bottomRight ? type : undefined;

  this.cornerSizes_[3] = bottomLeft ? bottomLeft : 0;
  this.cornerTypes_[3] = bottomLeft ? type : undefined;
};


/**
 * Returns current fill.
 * @param {(!acgraph.vector.Fill|!Array.<(acgraph.vector.GradientKey|string)>|null)=} opt_fillOrColorOrKeys
 * @param {number=} opt_opacityOrAngleOrCx
 * @param {(number|boolean|!acgraph.math.Rect|!{left:number,top:number,width:number,height:number})=} opt_modeOrCy
 * @param {(number|!acgraph.math.Rect|!{left:number,top:number,width:number,height:number}|null)=} opt_opacityOrMode
 * @param {number=} opt_opacity
 * @param {number=} opt_fx
 * @param {number=} opt_fy
 * @return {!(acgraph.vector.Fill|anychart.core.ui.Background)}
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
 * @param {(acgraph.vector.Stroke|acgraph.vector.ColoredFill|string|null)=} opt_strokeOrFill
 * @param {number=} opt_thickness
 * @param {string=} opt_dashpattern
 * @param {acgraph.vector.StrokeLineJoin=} opt_lineJoin
 * @param {acgraph.vector.StrokeLineCap=} opt_lineCap
 * @return {(!anychart.core.ui.Background|acgraph.vector.Stroke)}
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


/**
 * Getter/setter for the callout width.
 * @param {(number|string)=} opt_value
 * @return {number|string|!anychart.core.ui.BackgroundWithCallout}
 */
anychart.core.ui.BackgroundWithCallout.prototype.calloutWidth = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.calloutWidth_ != opt_value) {
      this.calloutWidth_ = opt_value;
      this.invalidate(anychart.ConsistencyState.BOUNDS,
          anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    }
    return this;
  }
  return this.calloutWidth_;
};


/**
 * Getter/setter for the callout height.
 * @param {(number|string)=} opt_value
 * @return {number|string|!anychart.core.ui.BackgroundWithCallout}
 */
anychart.core.ui.BackgroundWithCallout.prototype.calloutHeight = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.calloutHeight_ != opt_value) {
      this.calloutHeight_ = opt_value;
      this.invalidate(anychart.ConsistencyState.BOUNDS,
          anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    }
    return this;
  }
  return this.calloutHeight_;
};


/**
 * Getter/setter for the callout orientation.
 * @param {string|false=} opt_value
 * @return {string|false|!anychart.core.ui.BackgroundWithCallout}
 */
anychart.core.ui.BackgroundWithCallout.prototype.calloutOrientation = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.calloutOrientation_ != opt_value) {
      if (goog.isString(opt_value)) opt_value = anychart.enums.normalizeOrientation(opt_value);
      this.calloutOrientation_ = opt_value;
      this.invalidate(anychart.ConsistencyState.BOUNDS,
          anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    }
    return this;
  }
  return this.calloutOrientation_;
};


/**
 * Getter/setter for the callout height.
 * @param {(number|string)=} opt_value
 * @return {number|string|!anychart.core.ui.BackgroundWithCallout}
 */
anychart.core.ui.BackgroundWithCallout.prototype.calloutShift = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.calloutShift_ != opt_value) {
      this.calloutShift_ = opt_value;
      this.invalidate(anychart.ConsistencyState.BOUNDS,
          anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    }
    return this;
  }
  return this.calloutShift_;
};


/**
 * Applies callout size to a rect, creating a new tighten rectangle.
 * @param {!anychart.math.Rect} boundsRect Rectangle to apply callout size to.
 * @return {!anychart.math.Rect} New rectangle with applied callout size.
 */
anychart.core.ui.BackgroundWithCallout.prototype.widenBounds = function(boundsRect) {
  if ((!this.calloutHeight() && !this.calloutWidth()) || !this.calloutOrientation_) return boundsRect;

  this.calculate_();
  switch (this.calloutOrientation_) {
    case anychart.enums.Orientation.LEFT:
      return new anychart.math.Rect(
          boundsRect.left,
          boundsRect.top,
          boundsRect.width + this.calloutHeightValue_,
          boundsRect.height
      );

    case anychart.enums.Orientation.TOP:
      return new anychart.math.Rect(
          boundsRect.left,
          boundsRect.top,
          boundsRect.width,
          boundsRect.height + this.calloutHeightValue_
      );

    case anychart.enums.Orientation.RIGHT:
      return new anychart.math.Rect(
          boundsRect.left - this.calloutHeightValue_,
          boundsRect.top,
          boundsRect.width + this.calloutHeightValue_,
          boundsRect.height
      );

    case anychart.enums.Orientation.BOTTOM:
      return new anychart.math.Rect(
          boundsRect.left,
          boundsRect.top - this.calloutHeightValue_,
          boundsRect.width,
          boundsRect.height + this.calloutHeightValue_
      );
  }
};


/** @inheritDoc */
anychart.core.ui.BackgroundWithCallout.prototype.getRemainingBounds = function() {
  var remainingBounds = goog.base(this, 'getRemainingBounds');
  if ((!this.calloutHeight() && !this.calloutWidth()) || !this.calloutOrientation_) return remainingBounds;

  this.calculate_();
  switch (this.calloutOrientation_) {
    case anychart.enums.Orientation.LEFT:
      return new anychart.math.Rect(
          remainingBounds.left + this.calloutHeightValue_,
          remainingBounds.top,
          remainingBounds.width - this.calloutHeightValue_,
          remainingBounds.height
      );

    case anychart.enums.Orientation.TOP:
      return new anychart.math.Rect(
          remainingBounds.left,
          remainingBounds.top + this.calloutHeightValue_,
          remainingBounds.width,
          remainingBounds.height - this.calloutHeightValue_
      );

    case anychart.enums.Orientation.RIGHT:
      return new anychart.math.Rect(
          remainingBounds.left,
          remainingBounds.top,
          remainingBounds.width - this.calloutHeightValue_,
          remainingBounds.height
      );

    case anychart.enums.Orientation.BOTTOM:
      return new anychart.math.Rect(
          remainingBounds.left,
          remainingBounds.top,
          remainingBounds.width,
          remainingBounds.height - this.calloutHeightValue_
      );
  }
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

  if (this.hasInvalidationState(anychart.ConsistencyState.BACKGROUND_POINTER_EVENTS)) {
    //this.path_.disablePointerEvents(this.disablePointerEvents_);
    this.markConsistent(anychart.ConsistencyState.BACKGROUND_POINTER_EVENTS);
  }

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

    this.calculate_();

    this.markConsistent(anychart.ConsistencyState.BOUNDS);

    if (goog.isObject(this.fill_) && ('keys' in this.fill_ || 'src' in this.fill_)) {
      this.invalidate(anychart.ConsistencyState.APPEARANCE);
    }
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.APPEARANCE)) {
    this.path_.fill(this.fill_);
    this.path_.stroke(this.stroke_);

    switch (this.cornerType_) {
      case anychart.enums.BackgroundCornersType.ROUND:
        this.setCornerSettings_(acgraph.vector.Rect.CornerType.ROUND, this.corners_);
        break;
      case anychart.enums.BackgroundCornersType.CUT:
        this.setCornerSettings_(acgraph.vector.Rect.CornerType.CUT, this.corners_);
        break;
      case anychart.enums.BackgroundCornersType.ROUND_INNER:
        this.setCornerSettings_(acgraph.vector.Rect.CornerType.ROUND_INNER, this.corners_);
        break;
      default:
        this.setCornerSettings_(acgraph.vector.Rect.CornerType.CUT, 0);
        break;
    }

    this.markConsistent(anychart.ConsistencyState.APPEARANCE);
  }

  console.log(this.cornerSizes_);
  console.log(this.cornerTypes_);

  var calloutHalfWidth = this.calloutWidthValue_ / 2;
  var calloutHalfHeight = this.calloutHeightValue_ / 2;
  var remainingWidth = bounds.left + bounds.right - this.calloutWidthValue_;
  var remainingHeight = bounds.top + bounds.height - this.calloutHeightValue_;

  this.path_.clearInternal();

  switch (this.calloutOrientation_) {
    case false:
      this.path_.moveToInternal(bounds.left, bounds.top);
      this.path_.lineToInternal(bounds.left + bounds.width, bounds.top);
      this.path_.lineToInternal(bounds.left + bounds.width, bounds.top + bounds.height);
      this.path_.lineToInternal(bounds.left, bounds.top + bounds.height);
      break;

    case anychart.enums.Orientation.LEFT:
      this.path_.moveToInternal(bounds.left + this.calloutHeightValue_, bounds.top);

      this.path_.lineToInternal(bounds.left + bounds.width, bounds.top);
      this.path_.lineToInternal(bounds.left + bounds.width, bounds.top + bounds.height);
      this.path_.lineToInternal(bounds.left + this.calloutHeightValue_, bounds.top + bounds.height);

      this.path_.lineToInternal(bounds.left + this.calloutHeightValue_, bounds.top + this.calloutShiftValue_ + calloutHalfWidth);
      this.path_.lineToInternal(bounds.left, bounds.top + this.calloutShiftValue_);
      this.path_.lineToInternal(bounds.left + this.calloutHeightValue_, bounds.top + this.calloutShiftValue_ - calloutHalfWidth);
      break;

    case anychart.enums.Orientation.TOP:
      this.path_.moveToInternal(bounds.left, bounds.top + this.calloutHeightValue_);

      this.path_.lineToInternal(bounds.left + this.calloutShiftValue_ - calloutHalfWidth, bounds.top + this.calloutHeightValue_);
      this.path_.lineToInternal(bounds.left + this.calloutShiftValue_, bounds.top);
      this.path_.lineToInternal(bounds.left + this.calloutShiftValue_ + calloutHalfWidth, bounds.top + this.calloutHeightValue_);
      this.path_.lineToInternal(bounds.left + bounds.width, bounds.top + this.calloutHeightValue_);

      this.path_.lineToInternal(bounds.left + bounds.width, bounds.top + bounds.height);
      this.path_.lineToInternal(bounds.left, bounds.top + bounds.height);
      break;

    case anychart.enums.Orientation.RIGHT:
      this.path_.moveToInternal(bounds.left, bounds.top);

      this.path_.lineToInternal(bounds.left + bounds.width - this.calloutHeightValue_, bounds.top);

      this.path_.lineToInternal(bounds.left + bounds.width - this.calloutHeightValue_, bounds.top + this.calloutShiftValue_ - calloutHalfWidth);
      this.path_.lineToInternal(bounds.left + bounds.width, bounds.top + this.calloutShiftValue_);
      this.path_.lineToInternal(bounds.left + bounds.width - this.calloutHeightValue_, bounds.top + this.calloutShiftValue_ + calloutHalfWidth);
      this.path_.lineToInternal(bounds.left + bounds.width - this.calloutHeightValue_, bounds.top + bounds.height);

      this.path_.lineToInternal(bounds.left, bounds.top + bounds.height);
      break;

    case anychart.enums.Orientation.BOTTOM:
      this.path_.moveToInternal(bounds.left, bounds.top);

      this.path_.lineToInternal(bounds.left + bounds.width, bounds.top);
      this.path_.lineToInternal(bounds.left + bounds.width, bounds.top + bounds.height - this.calloutHeightValue_);

      this.path_.lineToInternal(bounds.left + this.calloutShiftValue_ + calloutHalfWidth, bounds.top + bounds.height - this.calloutHeightValue_);
      this.path_.lineToInternal(bounds.left + this.calloutShiftValue_, bounds.top + bounds.height);
      this.path_.lineToInternal(bounds.left + this.calloutShiftValue_ - calloutHalfWidth, bounds.top + bounds.height - this.calloutHeightValue_);
      this.path_.lineToInternal(bounds.left, bounds.top + bounds.height - this.calloutHeightValue_);
      break;
  }

  this.path_.closeInternal();

  if (this.hasInvalidationState(anychart.ConsistencyState.Z_INDEX)) {
    this.path_.zIndex(/** @type {number} */(this.zIndex()));
    this.markConsistent(anychart.ConsistencyState.Z_INDEX);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.CONTAINER)) {
    this.path_.parent(/** @type {acgraph.vector.ILayer} */(this.container()));
    this.markConsistent(anychart.ConsistencyState.CONTAINER);
  }

  if (manualSuspend) stage.resume();

  return this;
};


/**
 * Calculating common values for a background element.
 * @private
 */
anychart.core.ui.BackgroundWithCallout.prototype.calculate_ = function() {
  var bounds = this.getPixelBounds();

  this.calloutWidthValue_ = anychart.utils.normalizeSize(this.calloutWidth_, bounds.width);
  this.calloutHeightValue_ = anychart.utils.normalizeSize(this.calloutHeight_, bounds.height);


  this.calloutShiftValue_ = anychart.utils.isHorizontal(this.calloutOrientation_) ?
      anychart.utils.normalizeSize(this.calloutShift_, bounds.width) :
      anychart.utils.normalizeSize(this.calloutShift_, bounds.height);
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
  console.log(config);
  this.fill(config['fill']);
  this.stroke(config['stroke']);
  this.cornerType(config['cornerType']);
  this.corners(config['corners']);
};


/** @inheritDoc */
anychart.core.ui.BackgroundWithCallout.prototype.disposeInternal = function() {
  if (this.rect_) {
    this.rect_.parent(null);
    goog.dispose(this.rect_);
    this.rect_ = null;
  }

  delete this.fill_;
  delete this.stroke_;
  delete this.cornerType_;
  this.corners_.length = 0;
  delete this.corners_;

  goog.base(this, 'disposeInternal');
};


//exports
anychart.core.ui.BackgroundWithCallout.prototype['fill'] = anychart.core.ui.BackgroundWithCallout.prototype.fill;
anychart.core.ui.BackgroundWithCallout.prototype['stroke'] = anychart.core.ui.BackgroundWithCallout.prototype.stroke;
anychart.core.ui.BackgroundWithCallout.prototype['cornerType'] = anychart.core.ui.BackgroundWithCallout.prototype.cornerType;
anychart.core.ui.BackgroundWithCallout.prototype['corners'] = anychart.core.ui.BackgroundWithCallout.prototype.corners;
anychart.core.ui.BackgroundWithCallout.prototype['calloutWidth'] = anychart.core.ui.BackgroundWithCallout.prototype.calloutWidth;
anychart.core.ui.BackgroundWithCallout.prototype['calloutHeight'] = anychart.core.ui.BackgroundWithCallout.prototype.calloutHeight;
