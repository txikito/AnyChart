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
   * @type {anychart.enums.Orientation|boolean}
   * @private
   */
  this.calloutOrientation_ = anychart.enums.Orientation.BOTTOM;//null; todo: to defaults BOTTOM

  /**
   * Position in pixels or a percentage of total side size.
   * @type {number|string}
   * @private
   */
  this.calloutPosition_ = '50%';//null; todo: to defaults '50%'

  /**
   *
   * @type {number}
   * @private
   */
  this.calloutShift_ = 0;//null; todo: to defaults 0

  /**
   *
   * @type {boolean}
   * @private
   */
  this.calloutVisible_ = false;

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
 * @param {(anychart.enums.Orientation|boolean)=} opt_value
 * @return {anychart.enums.Orientation|boolean|!anychart.core.ui.BackgroundWithCallout}
 */
anychart.core.ui.BackgroundWithCallout.prototype.calloutOrientation = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.calloutOrientation_ != opt_value) {
      this.calloutOrientation_ = opt_value;
      this.invalidate(anychart.ConsistencyState.BOUNDS,
          anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    }
    return this;
  }
  return this.calloutOrientation_;
};


/**
 * Getter/setter for the callout position.
 * @param {(number|string)=} opt_value
 * @return {number|string|!anychart.core.ui.BackgroundWithCallout}
 */
anychart.core.ui.BackgroundWithCallout.prototype.calloutPosition = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.calloutPosition_ != opt_value) {
      this.calloutPosition_ = opt_value;
      this.invalidate(anychart.ConsistencyState.BOUNDS,
          anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    }
    return this;
  }
  return this.calloutPosition_;
};


/**
 * Getter/setter for the callout shift.
 * @param {number=} opt_value
 * @return {number|!anychart.core.ui.BackgroundWithCallout}
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
 *
 * @param {boolean=} opt_value
 * @return {boolean|!anychart.core.ui.BackgroundWithCallout}
 */
anychart.core.ui.BackgroundWithCallout.prototype.calloutVisible = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.calloutVisible_ != opt_value) {
      this.calloutVisible_ = opt_value;
      this.invalidate(anychart.ConsistencyState.BOUNDS,
          anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    }
    return this;
  }
  return this.calloutVisible_;
};


/**
 * Applies callout size to a rect, creating a new tighten rectangle.
 * @param {!anychart.math.Rect} boundsRect Rectangle to apply callout size to.
 * @return {!anychart.math.Rect} New rectangle with applied callout size.
 */
anychart.core.ui.BackgroundWithCallout.prototype.widenBounds = function(boundsRect) {
  if (!this.calloutVisible_ || (!this.calloutHeight() && !this.calloutWidth()) || !this.calloutOrientation_) return boundsRect;

  this.calculate_();
  var widenBounds = new anychart.math.Rect(0, 0, 0, 0);
  switch (this.calloutOrientation_) {
    case anychart.enums.Orientation.LEFT:
      widenBounds = new anychart.math.Rect(
          boundsRect.left,
          boundsRect.top,
          boundsRect.width + this.calloutHeightValue_,
          boundsRect.height);
      break;
    case anychart.enums.Orientation.TOP:
      widenBounds = new anychart.math.Rect(
          boundsRect.left,
          boundsRect.top,
          boundsRect.width,
          boundsRect.height + this.calloutHeightValue_);
      break;

    case anychart.enums.Orientation.RIGHT:
      widenBounds = new anychart.math.Rect(
          boundsRect.left - this.calloutHeightValue_,
          boundsRect.top,
          boundsRect.width + this.calloutHeightValue_,
          boundsRect.height);
      break;

    case anychart.enums.Orientation.BOTTOM:
      widenBounds = new anychart.math.Rect(
          boundsRect.left,
          boundsRect.top - this.calloutHeightValue_,
          boundsRect.width,
          boundsRect.height + this.calloutHeightValue_);
      break;
  }

  return widenBounds;
};


/** @inheritDoc */
anychart.core.ui.BackgroundWithCallout.prototype.getRemainingBounds = function() {
  var remainingBounds = goog.base(this, 'getRemainingBounds');
  if (!this.calloutVisible_ || (!this.calloutHeight() && !this.calloutWidth()) || !this.calloutOrientation_) return remainingBounds;

  this.calculate_();
  var newRemainingBounds = new anychart.math.Rect(0, 0, 0, 0);
  switch (this.calloutOrientation_) {
    case anychart.enums.Orientation.LEFT:
      newRemainingBounds = new anychart.math.Rect(
          remainingBounds.left + this.calloutHeightValue_,
          remainingBounds.top,
          remainingBounds.width - this.calloutHeightValue_,
          remainingBounds.height);
      break;

    case anychart.enums.Orientation.TOP:
      newRemainingBounds = new anychart.math.Rect(
          remainingBounds.left,
          remainingBounds.top + this.calloutHeightValue_,
          remainingBounds.width,
          remainingBounds.height - this.calloutHeightValue_);
      break;

    case anychart.enums.Orientation.RIGHT:
      newRemainingBounds = new anychart.math.Rect(
          remainingBounds.left,
          remainingBounds.top,
          remainingBounds.width - this.calloutHeightValue_,
          remainingBounds.height);
      break;

    case anychart.enums.Orientation.BOTTOM:
      newRemainingBounds = new anychart.math.Rect(
          remainingBounds.left,
          remainingBounds.top,
          remainingBounds.width,
          remainingBounds.height - this.calloutHeightValue_);
      break;
  }

  return newRemainingBounds;
};


/**
 * Draw corner.
 * @param {!anychart.math.Rect} bounds
 * @param {!acgraph.vector.Rect.CornerType|undefined} type
 * @param {number} size
 * @private
 */
anychart.core.ui.BackgroundWithCallout.prototype.drawTopLeftCorner_ = function(bounds, type, size) {
  if (!type) return;

  switch (type) {
    case acgraph.vector.Rect.CornerType.ROUND:
      this.path_.arcToByEndPointInternal(bounds.left + size, bounds.top, size, size, false, true);
      break;
    case acgraph.vector.Rect.CornerType.ROUND_INNER:
      this.path_.arcToByEndPointInternal(bounds.left + size, bounds.top, size, size, false, false);
      break;
  }
};


/**
 * Draw corner.
 * @param {!anychart.math.Rect} bounds
 * @param {!acgraph.vector.Rect.CornerType|undefined} type
 * @param {number} size
 * @private
 */
anychart.core.ui.BackgroundWithCallout.prototype.drawTopRightCorner_ = function(bounds, type, size) {
  if (!type) return;

  switch (type) {
    case acgraph.vector.Rect.CornerType.ROUND:
      this.path_.arcToByEndPointInternal(bounds.left + bounds.width, bounds.top + size, size, size, false, true);
      break;
    case acgraph.vector.Rect.CornerType.ROUND_INNER:
      this.path_.arcToByEndPointInternal(bounds.left + bounds.width, bounds.top + size, size, size, false, false);
      break;
    case acgraph.vector.Rect.CornerType.CUT:
      this.path_.lineToInternal(bounds.left + bounds.width, bounds.top + size);
      break;
  }
};


/**
 * Draw corner.
 * @param {!anychart.math.Rect} bounds
 * @param {!acgraph.vector.Rect.CornerType|undefined} type
 * @param {number} size
 * @private
 */
anychart.core.ui.BackgroundWithCallout.prototype.drawBottomRightCorner_ = function(bounds, type, size) {
  if (!type) return;

  switch (type) {
    case acgraph.vector.Rect.CornerType.ROUND:
      this.path_.arcToByEndPointInternal(bounds.left + bounds.width - size, bounds.top + bounds.height, size, size, false, true);
      break;
    case acgraph.vector.Rect.CornerType.ROUND_INNER:
      this.path_.arcToByEndPointInternal(bounds.left + bounds.width - size, bounds.top + bounds.height, size, size, false, false);
      break;
    case acgraph.vector.Rect.CornerType.CUT:
      this.path_.lineToInternal(bounds.left + bounds.width - size, bounds.top + bounds.height);
      break;
  }
};


/**
 * Draw corner.
 * @param {!anychart.math.Rect} bounds
 * @param {!acgraph.vector.Rect.CornerType|undefined} type
 * @param {number} size
 * @private
 */
anychart.core.ui.BackgroundWithCallout.prototype.drawBottomLeftCorner_ = function(bounds, type, size) {
  if (!type) return;

  switch (type) {
    case acgraph.vector.Rect.CornerType.ROUND:
      this.path_.arcToByEndPointInternal(bounds.left, bounds.top + bounds.height - size, size, size, false, true);
      break;
    case acgraph.vector.Rect.CornerType.ROUND_INNER:
      this.path_.arcToByEndPointInternal(bounds.left, bounds.top + bounds.height - size, size, size, false, false);
      break;
    case acgraph.vector.Rect.CornerType.CUT:
      this.path_.lineToInternal(bounds.left, bounds.top + bounds.height - size);
      break;
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

    if (goog.isObject(this.fill()) && ('keys' in this.fill() || 'src' in this.fill())) {
      this.invalidate(anychart.ConsistencyState.APPEARANCE);
    }
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.APPEARANCE)) {
    this.path_.fill(/** @type {!acgraph.vector.Fill} */(this.fill()));
    this.path_.stroke(/** @type {!acgraph.vector.Stroke} */(this.stroke()));

    var corners;
    switch (this.cornerType()) {
      case anychart.enums.BackgroundCornersType.ROUND:
        corners = /** @type {Array.<number|string>} */(this.corners());
        corners.unshift(acgraph.vector.Rect.CornerType.ROUND);
        this.setCornerSettings_.apply(this, corners);
        break;
      case anychart.enums.BackgroundCornersType.CUT:
        corners = /** @type {Array.<number|string>} */(this.corners());
        corners.unshift(acgraph.vector.Rect.CornerType.CUT);
        this.setCornerSettings_.apply(this, corners);
        break;
      case anychart.enums.BackgroundCornersType.ROUND_INNER:
        corners = /** @type {Array.<number|string>} */(this.corners());
        corners.unshift(acgraph.vector.Rect.CornerType.ROUND_INNER);
        this.setCornerSettings_.apply(this, corners);
        break;
      default:
        corners = [0];
        corners.unshift(acgraph.vector.Rect.CornerType.CUT);
        this.setCornerSettings_.apply(this, corners);
        break;
    }

    this.markConsistent(anychart.ConsistencyState.APPEARANCE);
  }

  var calloutHalfWidth = this.calloutWidthValue_ / 2;
  //var calloutHalfHeight = this.calloutHeightValue_ / 2;
  //var remainingWidth = bounds.left + bounds.right - this.calloutWidthValue_;
  //var remainingHeight = bounds.top + bounds.height - this.calloutHeightValue_;
  var boundsForCorners = bounds.clone();

  this.path_.clearInternal();

  if (!this.calloutVisible_) {
    this.drawRect_(bounds, boundsForCorners);

  } else {
    switch (this.calloutOrientation_) {
      case false:
        this.drawRect_(bounds, boundsForCorners);
        break;

      case anychart.enums.Orientation.LEFT:
        this.path_.moveToInternal(bounds.left + this.calloutHeightValue_ + this.cornerSizes_[0], bounds.top);
        boundsForCorners.left += this.calloutHeightValue_;
        boundsForCorners.width -= this.calloutHeightValue_;

        this.path_.lineToInternal(bounds.left + bounds.width - this.cornerSizes_[1], bounds.top);
        this.drawTopRightCorner_(boundsForCorners, this.cornerTypes_[1], this.cornerSizes_[1]);

        this.path_.lineToInternal(bounds.left + bounds.width, bounds.top + bounds.height - this.cornerSizes_[2]);
        this.drawBottomRightCorner_(boundsForCorners, this.cornerTypes_[2], this.cornerSizes_[2]);

        this.path_.lineToInternal(bounds.left + this.calloutHeightValue_ + this.cornerSizes_[3], bounds.top + bounds.height);
        this.drawBottomLeftCorner_(boundsForCorners, this.cornerTypes_[3], this.cornerSizes_[3]);

        this.path_.lineToInternal(bounds.left + this.calloutHeightValue_, bounds.top + this.calloutPositionValue_ + calloutHalfWidth);
        this.path_.lineToInternal(bounds.left, bounds.top + this.calloutPositionValue_);
        this.path_.lineToInternal(bounds.left + this.calloutHeightValue_, bounds.top + this.calloutPositionValue_ - calloutHalfWidth);

        this.path_.lineToInternal(bounds.left + this.calloutHeightValue_, bounds.top + this.cornerSizes_[0]);
        this.drawTopLeftCorner_(boundsForCorners, this.cornerTypes_[0], this.cornerSizes_[0]);
        break;

      case anychart.enums.Orientation.TOP:
        this.path_.moveToInternal(bounds.left + this.cornerSizes_[0], bounds.top + this.calloutHeightValue_);
        boundsForCorners.top += this.calloutHeightValue_;
        boundsForCorners.height -= this.calloutHeightValue_;

        this.path_.lineToInternal(bounds.left + this.calloutPositionValue_ - calloutHalfWidth, bounds.top + this.calloutHeightValue_);
        this.path_.lineToInternal(bounds.left + this.calloutPositionValue_, bounds.top);
        this.path_.lineToInternal(bounds.left + this.calloutPositionValue_ + calloutHalfWidth, bounds.top + this.calloutHeightValue_);
        this.path_.lineToInternal(bounds.left + bounds.width - this.cornerSizes_[1], bounds.top + this.calloutHeightValue_);
        this.drawTopRightCorner_(boundsForCorners, this.cornerTypes_[1], this.cornerSizes_[1]);

        this.path_.lineToInternal(bounds.left + bounds.width, bounds.top + bounds.height - this.cornerSizes_[2]);
        this.drawBottomRightCorner_(boundsForCorners, this.cornerTypes_[2], this.cornerSizes_[2]);

        this.path_.lineToInternal(bounds.left + this.cornerSizes_[3], bounds.top + bounds.height);
        this.drawBottomLeftCorner_(boundsForCorners, this.cornerTypes_[3], this.cornerSizes_[3]);

        this.path_.lineToInternal(bounds.left, bounds.top + this.calloutHeightValue_ + this.cornerSizes_[0]);
        this.drawTopLeftCorner_(boundsForCorners, this.cornerTypes_[0], this.cornerSizes_[0]);
        break;

      case anychart.enums.Orientation.RIGHT:
        this.path_.moveToInternal(bounds.left + this.cornerSizes_[0], bounds.top);
        boundsForCorners.width -= this.calloutHeightValue_;

        this.path_.lineToInternal(bounds.left + bounds.width - this.calloutHeightValue_ - this.cornerSizes_[1], bounds.top);
        this.drawTopRightCorner_(boundsForCorners, this.cornerTypes_[1], this.cornerSizes_[1]);

        this.path_.lineToInternal(bounds.left + bounds.width - this.calloutHeightValue_, bounds.top + this.calloutPositionValue_ - calloutHalfWidth);
        this.path_.lineToInternal(bounds.left + bounds.width, bounds.top + this.calloutPositionValue_);
        this.path_.lineToInternal(bounds.left + bounds.width - this.calloutHeightValue_, bounds.top + this.calloutPositionValue_ + calloutHalfWidth);
        this.path_.lineToInternal(bounds.left + bounds.width - this.calloutHeightValue_, bounds.top + bounds.height - this.cornerSizes_[2]);
        this.drawBottomRightCorner_(boundsForCorners, this.cornerTypes_[2], this.cornerSizes_[2]);

        this.path_.lineToInternal(bounds.left + this.cornerSizes_[3], bounds.top + bounds.height);
        this.drawBottomLeftCorner_(boundsForCorners, this.cornerTypes_[3], this.cornerSizes_[3]);

        this.path_.lineToInternal(bounds.left, bounds.top + this.cornerSizes_[0]);
        this.drawTopLeftCorner_(boundsForCorners, this.cornerTypes_[0], this.cornerSizes_[0]);
        break;

      case anychart.enums.Orientation.BOTTOM:
        this.path_.moveToInternal(bounds.left + this.cornerSizes_[0], bounds.top);
        boundsForCorners.height -= this.calloutHeightValue_;

        this.path_.lineToInternal(bounds.left + bounds.width - this.cornerSizes_[1], bounds.top);
        this.drawTopRightCorner_(boundsForCorners, this.cornerTypes_[1], this.cornerSizes_[1]);

        this.path_.lineToInternal(bounds.left + bounds.width, bounds.top + bounds.height - this.calloutHeightValue_ - this.cornerSizes_[2]);
        this.drawBottomRightCorner_(boundsForCorners, this.cornerTypes_[2], this.cornerSizes_[2]);

        this.path_.lineToInternal(bounds.left + this.calloutPositionValue_ + calloutHalfWidth, bounds.top + bounds.height - this.calloutHeightValue_);
        this.path_.lineToInternal(bounds.left + this.calloutPositionValue_, bounds.top + bounds.height);
        this.path_.lineToInternal(bounds.left + this.calloutPositionValue_ - calloutHalfWidth, bounds.top + bounds.height - this.calloutHeightValue_);
        this.path_.lineToInternal(bounds.left + this.cornerSizes_[3], bounds.top + bounds.height - this.calloutHeightValue_);
        this.drawBottomLeftCorner_(boundsForCorners, this.cornerTypes_[3], this.cornerSizes_[3]);

        this.path_.lineToInternal(bounds.left, bounds.top + this.cornerSizes_[0]);
        this.drawTopLeftCorner_(boundsForCorners, this.cornerTypes_[0], this.cornerSizes_[0]);
        break;
    }
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
 * Draw simple rect background.
 * @param {!anychart.math.Rect} bounds
 * @param {!anychart.math.Rect} boundsForCorners
 * @private
 */
anychart.core.ui.BackgroundWithCallout.prototype.drawRect_ = function(bounds, boundsForCorners) {
  this.path_.moveToInternal(bounds.left + this.cornerSizes_[0], bounds.top);

  this.path_.lineToInternal(bounds.left + bounds.width - this.cornerSizes_[1], bounds.top);
  this.drawTopRightCorner_(boundsForCorners, this.cornerTypes_[1], this.cornerSizes_[1]);

  this.path_.lineToInternal(bounds.left + bounds.width, bounds.top + bounds.height - this.cornerSizes_[2]);
  this.drawBottomRightCorner_(boundsForCorners, this.cornerTypes_[2], this.cornerSizes_[2]);

  this.path_.lineToInternal(bounds.left + this.cornerSizes_[3], bounds.top + bounds.height);
  this.drawBottomLeftCorner_(boundsForCorners, this.cornerTypes_[3], this.cornerSizes_[3]);

  this.path_.lineToInternal(bounds.left, bounds.top + this.cornerSizes_[0]);
  this.drawTopLeftCorner_(boundsForCorners, this.cornerTypes_[0], this.cornerSizes_[0]);
};


/**
 * Calculating common values for a background element.
 * @private
 */
anychart.core.ui.BackgroundWithCallout.prototype.calculate_ = function() {
  var bounds = this.getPixelBounds();

  this.calloutWidthValue_ = anychart.utils.normalizeSize(this.calloutWidth_, bounds.width);
  this.calloutHeightValue_ = anychart.utils.normalizeSize(this.calloutHeight_, bounds.height);

  if (goog.isString(this.calloutOrientation_)) {
    this.calloutPositionValue_ = anychart.utils.isHorizontal(this.calloutOrientation_) ?
        anychart.utils.normalizeSize(this.calloutPosition_, bounds.width) :
        anychart.utils.normalizeSize(this.calloutPosition_, bounds.height);
    this.calloutPositionValue_ += this.calloutShift_;
  }
};


/** @inheritDoc */
anychart.core.ui.BackgroundWithCallout.prototype.remove = function() {
  if (this.path_) this.path_.parent(null);
};


/** @inheritDoc */
anychart.core.ui.BackgroundWithCallout.prototype.disposeInternal = function() {
  if (this.path_) {
    this.path_.parent(null);
    goog.dispose(this.path_);
    this.path_ = null;
  }

  goog.base(this, 'disposeInternal');
};


//exports
anychart.core.ui.BackgroundWithCallout.prototype['calloutWidth'] = anychart.core.ui.BackgroundWithCallout.prototype.calloutWidth;
anychart.core.ui.BackgroundWithCallout.prototype['calloutHeight'] = anychart.core.ui.BackgroundWithCallout.prototype.calloutHeight;
