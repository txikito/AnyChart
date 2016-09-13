//region --- Requiring and Providing
goog.provide('anychart.core.axes.MapTicks');
goog.require('acgraph');
goog.require('anychart.color');
goog.require('anychart.core.VisualBase');
goog.require('anychart.enums');
goog.require('anychart.utils');
//endregion



/**
 * @constructor
 * @extends {anychart.core.VisualBase}
 */
anychart.core.axes.MapTicks = function() {
  anychart.core.axes.MapTicks.base(this, 'constructor');

  /**
   * Ticks length.
   * @type {number}
   * @private
   */
  this.length_;

  /**
   * Ticks stroke.
   * @type {acgraph.vector.Stroke|string}
   * @private
   */
  this.stroke_;

  /**
   * Ticks position.
   * @type {anychart.enums.SidePosition}
   * @private
   */
  this.position_;

  /**
   * Ticks enabled.
   * @type {anychart.enums.Orientation}
   * @private
   */
  this.orientation_;

  /**
   * Path with ticks.
   * @type {!acgraph.vector.Path}
   * @protected
   */
  this.path = acgraph.path();
  this.bindHandlersToGraphics(this.path);
  this.registerDisposable(this.path);
};
goog.inherits(anychart.core.axes.MapTicks, anychart.core.VisualBase);


//region --- Class properties
/**
 * Supported consistency states.
 * @type {number}
 */
anychart.core.axes.MapTicks.prototype.SUPPORTED_SIGNALS = anychart.core.VisualBase.prototype.SUPPORTED_SIGNALS;


/**
 * Supported consistency states.
 * @type {number}
 */
anychart.core.axes.MapTicks.prototype.SUPPORTED_CONSISTENCY_STATES = anychart.core.VisualBase.prototype.SUPPORTED_CONSISTENCY_STATES; // ENABLED CONTAINER Z_INDEX


//endregion
//region --- Settings
/**
 * Getter/setter for length.
 * @param {(number|string)=} opt_value .
 * @return {(number|!anychart.core.axes.MapTicks)} .
 */
anychart.core.axes.MapTicks.prototype.length = function(opt_value) {
  if (goog.isDef(opt_value)) {
    opt_value = anychart.utils.toNumber(opt_value);
    if (this.length_ != opt_value) {
      this.length_ = opt_value;
      this.dispatchSignal(anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    }
    return this;
  } else
    return this.length_;
};


/**
 * Getter/setter for stroke.
 * @param {(acgraph.vector.Stroke|acgraph.vector.ColoredFill|string|null)=} opt_strokeOrFill Fill settings
 *    or stroke settings.
 * @param {number=} opt_thickness [1] Line thickness.
 * @param {string=} opt_dashpattern Controls the pattern of dashes and gaps used to stroke paths.
 * @param {acgraph.vector.StrokeLineJoin=} opt_lineJoin Line joint style.
 * @param {acgraph.vector.StrokeLineCap=} opt_lineCap Line cap style.
 * @return {!(anychart.core.axes.MapTicks|acgraph.vector.Stroke)} .
 */
anychart.core.axes.MapTicks.prototype.stroke = function(opt_strokeOrFill, opt_thickness, opt_dashpattern, opt_lineJoin, opt_lineCap) {
  if (goog.isDef(opt_strokeOrFill)) {
    var stroke = acgraph.vector.normalizeStroke.apply(null, arguments);
    if (this.stroke_ != stroke) {
      this.stroke_ = stroke;
      this.dispatchSignal(anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  } else {
    return this.stroke_;
  }
};


/**
 * Getter/setter for position.
 * @param {(anychart.enums.SidePosition|string)=} opt_value .
 * @return {(anychart.enums.SidePosition|string|!anychart.core.axes.MapTicks)} .
 */
anychart.core.axes.MapTicks.prototype.position = function(opt_value) {
  if (goog.isDef(opt_value)) {
    this.position_ = anychart.enums.normalizeSidePosition(opt_value);
    this.dispatchSignal(anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    return this;
  } else
    return this.position_;
};


/**
 * Whether an tick has horizontal orientation.
 * @return {boolean} If the tick has horizontal orientation.
 */
anychart.core.axes.MapTicks.prototype.isHorizontal = function() {
  var orientation = this.orientation();
  return orientation == anychart.enums.Orientation.TOP ||
      orientation == anychart.enums.Orientation.BOTTOM;
};


/**
 * Internal use.
 * Change orientation and set drawer to null.
 * @param {(string|anychart.enums.Orientation)=} opt_value Orientation.
 * @return {anychart.core.axes.MapTicks|anychart.enums.Orientation} Orientation or self for chaining.
 */
anychart.core.axes.MapTicks.prototype.orientation = function(opt_value) {
  if (goog.isDef(opt_value)) {
    opt_value = anychart.enums.normalizeOrientation(opt_value);
    if (this.orientation_ != opt_value) {
      this.orientation_ = opt_value;
      this.drawer_ = null;
      //TODO:blackart do we need to dispatch anything when orientation is changed?
    }
    return this;
  } else {
    return this.orientation_;
  }
};


/**
 * Setting scale.
 * @param {anychart.scales.Geo} value
 */
anychart.core.axes.MapTicks.prototype.setScale = function(value) {
  /**
   * @type {anychart.scales.Geo}
   * @private
   */
  this.scale_ = value;

  this.calcGeoLine();
};


//endregion
//region --- Calculation
/**
 * Calc geo line.
 */
anychart.core.axes.MapTicks.prototype.calcGeoLine = function() {
  switch (this.orientation()) {
    case anychart.enums.Orientation.TOP:
      this.geoLine = this.scale_.maximumY();
      break;
    case anychart.enums.Orientation.RIGHT:
      this.geoLine = this.scale_.maximumX();
      break;
    case anychart.enums.Orientation.BOTTOM:
      this.geoLine = this.scale_.minimumY();
      break;
    case anychart.enums.Orientation.LEFT:
      this.geoLine = this.scale_.minimumX();
      break;
  }
};


anychart.core.axes.MapTicks.prototype.getTickAngle = function(value) {

};


/**
 * Calculation tick.
 * @param {number} value
 * @return {Array.<number>}
 */
anychart.core.axes.MapTicks.prototype.calcTick = function(value) {
  var nearPos, centerPos, tickCoords;
  var direction = 1;
  if (this.isHorizontal()) {
    centerPos = this.scale_.transform(value, this.geoLine, null);
    nearPos = this.scale_.transform(value + 1, this.geoLine, null);
  } else {
    centerPos = this.scale_.transform(this.geoLine, value, null);
    nearPos = this.scale_.transform(this.geoLine, value + 1, null);
  }

  var a = centerPos[1] - nearPos[1];
  var b = nearPos[0] - centerPos[0];
  var angle = Math.atan(-a / b);
  if (isNaN(angle)) angle = 0;

  var angle_;
  if (this.position_ == anychart.enums.SidePosition.INSIDE) {
    angle_ = angle + direction * 1.5 * Math.PI;

    if (this.orientation() == anychart.enums.Orientation.TOP || this.orientation() == anychart.enums.Orientation.LEFT) {
      if (centerPos[0] < nearPos[0] && (centerPos[1] <= nearPos[1] || centerPos[1] >= nearPos[1])) {
        angle_ = angle + direction * .5 * Math.PI;
      }
    } else {
      if (centerPos[0] > nearPos[0] && (centerPos[1] <= nearPos[1] || centerPos[1] >= nearPos[1])) {
        angle_ = angle + direction * .5 * Math.PI;
      }
    }
  } else if (this.position_ == anychart.enums.SidePosition.CENTER) {
    angle_ = angle + 1.5 * Math.PI;
    centerPos[0] += Math.cos(angle_) * this.length() / 2;
    centerPos[1] += Math.sin(angle_) * this.length() / 2;
    angle_ = angle + Math.PI / 2;
  } else {
    angle_ = angle - direction * Math.PI / 2;

    if (this.orientation() == anychart.enums.Orientation.TOP || this.orientation() == anychart.enums.Orientation.LEFT) {
      if (centerPos[0] > nearPos[0] && (centerPos[1] <= nearPos[1] || centerPos[1] >= nearPos[1])) {
        angle_ = angle - 1.5 * Math.PI;
      }
    } else {
      if (centerPos[0] <= nearPos[0] && (centerPos[1] <= nearPos[1] || centerPos[1] >= nearPos[1])) {
        angle_ = angle - 1.5 * Math.PI;
      }
    }
  }

  var dx = Math.cos(angle_) * this.length();
  var dy = Math.sin(angle_) * this.length();

  tickCoords = [centerPos[0], centerPos[1], centerPos[0] + dx, centerPos[1] + dy, angle_];

  return tickCoords;
};


/**
 * Returns tick bounds.
 * @param {number} value .
 * @return {anychart.math.Rect}
 */
anychart.core.axes.MapTicks.prototype.getTickBounds = function(value) {
  var coords = this.calcTick(value);
  return new anychart.math.Rect(
      Math.min(coords[0], coords[2]),
      Math.min(coords[1], coords[3]),
      Math.abs(coords[0] - coords[2]),
      Math.abs(coords[1] - coords[3]));
};


//endregion
//region --- Drawing
/** @inheritDoc */
anychart.core.axes.MapTicks.prototype.remove = function() {
  if (this.path) this.path.parent(null);
};


/**
 * Renders ticks.
 * @return {!anychart.core.axes.MapTicks} {@link anychart.core.axes.MapTicks} instance for method chaining.
 */
anychart.core.axes.MapTicks.prototype.draw = function() {
  this.calcGeoLine();

  this.path.clear();
  this.path.stroke(this.stroke_);

  if (!this.checkDrawingNeeded())
    return this;

  if (this.hasInvalidationState(anychart.ConsistencyState.Z_INDEX)) {
    this.path.zIndex(/** @type {number} */ (this.zIndex()));
    this.markConsistent(anychart.ConsistencyState.Z_INDEX);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.CONTAINER)) {
    this.path.parent(/** @type {acgraph.vector.ILayer} */ (this.container()));
    this.markConsistent(anychart.ConsistencyState.CONTAINER);
  }

  return this;
};


/**
 * Get drawer depends on orientation
 * @return {Function}
 */
anychart.core.axes.MapTicks.prototype.getTicksDrawer = function() {
  if (!this.drawer_) {
    switch (this.orientation_) {
      case anychart.enums.Orientation.TOP:
        this.drawer_ = this.drawTopTick;
        break;
      case anychart.enums.Orientation.RIGHT:
        this.drawer_ = this.drawRightTick;
        break;
      case anychart.enums.Orientation.BOTTOM:
        this.drawer_ = this.drawBottomTick;
        break;
      case anychart.enums.Orientation.LEFT:
        this.drawer_ = this.drawLeftTick;
        break;
    }
  }
  return this.drawer_;
};


/**
 * Axis ticks drawer for top orientation.
 * @param {number} ratio Scale ratio.
 * @param {anychart.math.Rect} bounds Axis bounds.
 * @param {anychart.math.Rect} lineBounds Axis line bounds.
 * @param {number} lineThickness Axis line thickness.
 * @param {number} pixelShift Pixel shift for a crisp display.
 * @protected
 */
anychart.core.axes.MapTicks.prototype.drawTopTick = function(value) {
  var tickCoords = this.calcTick(value);

  this.path.moveTo(tickCoords[0], tickCoords[1]);
  this.path.lineTo(tickCoords[2], tickCoords[3]);
};


/**
 * Axis ticks drawer for right orientation.
 * @param {number} ratio Scale ratio.
 * @param {anychart.math.Rect} bounds Axis bounds.
 * @param {anychart.math.Rect} lineBounds Axis line bounds.
 * @param {number} lineThickness Axis line thickness.
 * @param {number} pixelShift Pixel shift for a crisp display.
 * @protected
 */
anychart.core.axes.MapTicks.prototype.drawRightTick = function(value) {
  var tickCoords = this.calcTick(value);

  this.path.moveTo(tickCoords[0], tickCoords[1]);
  this.path.lineTo(tickCoords[2], tickCoords[3]);
};


/**
 * Axis ticks drawer for bottom orientation.
 * @param {number} ratio Scale ratio.
 * @param {anychart.math.Rect} bounds Axis bounds.
 * @param {anychart.math.Rect} lineBounds Axis line bounds.
 * @param {number} lineThickness Axis line thickness.
 * @param {number} pixelShift Pixel shift for a crisp display.
 * @protected
 */
anychart.core.axes.MapTicks.prototype.drawBottomTick = function(value) {
  var tickCoords = this.calcTick(value);

  this.path.moveTo(tickCoords[0], tickCoords[1]);
  this.path.lineTo(tickCoords[2], tickCoords[3]);
};


/**
 * Axis ticks drawer for left orientation.
 * @param {number} ratio Scale ratio.
 * @param {anychart.math.Rect} bounds Axis bounds.
 * @param {anychart.math.Rect} lineBounds Axis line bounds.
 * @param {number} lineThickness Axis line thickness.
 * @param {number} pixelShift Pixel shift for a crisp display.
 * @protected
 */
anychart.core.axes.MapTicks.prototype.drawLeftTick = function(value) {
  var tickCoords = this.calcTick(value);

  this.path.moveTo(tickCoords[0], tickCoords[1]);
  this.path.lineTo(tickCoords[2], tickCoords[3]);
};


//endregion
//region --- Setup and Dispose
/** @inheritDoc */
anychart.core.axes.MapTicks.prototype.setupByJSON = function(config) {
  anychart.core.axes.MapTicks.base(this, 'setupByJSON', config);
};


/** @inheritDoc */
anychart.core.axes.MapTicks.prototype.serialize = function() {
  var json = anychart.core.axes.MapTicks.base(this, 'serialize');
};


/** @inheritDoc */
anychart.core.axes.MapTicks.prototype.disposeInternal = function() {
  anychart.core.axes.MapTicks.base(this, 'disposeInternal');
};


//endregion
//region --- Exports
//exports
anychart.core.axes.Ticks.prototype['length'] = anychart.core.axes.Ticks.prototype.length;
anychart.core.axes.Ticks.prototype['stroke'] = anychart.core.axes.Ticks.prototype.stroke;
anychart.core.axes.Ticks.prototype['position'] = anychart.core.axes.Ticks.prototype.position;
//endregion
