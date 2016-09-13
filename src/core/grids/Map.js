//region --- Requiring and Providing
goog.provide('anychart.core.grids.Map');

goog.require('acgraph');
goog.require('anychart.color');
goog.require('anychart.core.VisualBase');
goog.require('anychart.core.reporting');
goog.require('anychart.core.utils.Padding');
goog.require('anychart.enums');
//endregion



/**
 * Map axes settings.
 * @extends {anychart.core.VisualBase}
 * @constructor
 */
anychart.core.grids.Map = function() {
  anychart.core.grids.Map.base(this, 'constructor');

  /**
   * @type {acgraph.vector.Path}
   * @private
   */
  this.oddFillElement_ = null;

  /**
   * @type {acgraph.vector.Path}
   * @private
   */
  this.evenFillElement_ = null;

  /**
   * @type {acgraph.vector.Path}
   * @protected
   */
  this.lineElementInternal = null;

  /**
   * @type {string|acgraph.vector.Fill}
   * @private
   */
  this.oddFill_;

  /**
   * @type {string|acgraph.vector.Fill}
   * @private
   */
  this.evenFill_;

  /**
   * @type {string|acgraph.vector.Stroke}
   * @private
   */
  this.stroke_;

  /**
   * @type {anychart.scales.Base}
   * @private
   */
  this.scale_ = null;

  /**
   * @type {anychart.enums.Layout}
   * @private
   */
  this.layout_;

  /**
   * @type {boolean}
   * @private
   */
  this.drawFirstLine_;

  /**
   * @type {boolean}
   * @private
   */
  this.drawLastLine_;
};
goog.inherits(anychart.core.grids.Map, anychart.core.VisualBase);


//region --- Internal properties
/**
 * Supported signals.
 * @type {number}
 */
anychart.core.grids.Map.prototype.SUPPORTED_SIGNALS =
    anychart.core.VisualBase.prototype.SUPPORTED_SIGNALS |
        anychart.Signal.BOUNDS_CHANGED;


/**
 * Supported consistency states.
 * @type {number}
 */
anychart.core.grids.Map.prototype.SUPPORTED_CONSISTENCY_STATES =
    anychart.core.VisualBase.prototype.SUPPORTED_CONSISTENCY_STATES |
        anychart.ConsistencyState.APPEARANCE |
        anychart.ConsistencyState.GRIDS_POSITION;


//endregion
//region --- Settings
/**
 * Get/set grid layout.
 * @param {anychart.enums.Layout=} opt_value Grid layout.
 * @return {anychart.enums.Layout|anychart.core.grids.Map} Layout or this.
 */
anychart.core.grids.Map.prototype.layout = function(opt_value) {
  if (goog.isDef(opt_value)) {
    this.layout_ = opt_value;
    return this;
  } else {
    return this.layout_;
  }
};


/**
 * Setter for scale.
 * @param {anychart.scales.Geo} value Scale.
 * @return {anychart.core.grids.Map} .
 */
anychart.core.grids.Map.prototype.setScale = function(value) {
  if (this.scale_ != value) {
    this.scale_ = value;
    this.scale_.listenSignals(this.scaleInvalidated_, this);
    this.invalidate(anychart.ConsistencyState.GRIDS_POSITION | anychart.ConsistencyState.BOUNDS,
        anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
  }
  return this;
};


/**
 * Internal scale invalidation handler.
 * @param {anychart.SignalEvent} event Event object.
 * @private
 */
anychart.core.grids.Map.prototype.scaleInvalidated_ = function(event) {
  var signal = 0;
  if (event.hasSignal(anychart.Signal.NEEDS_RECALCULATION))
    signal |= anychart.Signal.NEEDS_RECALCULATION;
  if (event.hasSignal(anychart.Signal.NEEDS_REAPPLICATION))
    signal |= anychart.Signal.NEEDS_REDRAW;

  signal |= anychart.Signal.BOUNDS_CHANGED;

  var state = anychart.ConsistencyState.BOUNDS |
      anychart.ConsistencyState.APPEARANCE;

  this.invalidate(state, signal);
};


/**
 * Get/set grid odd fill settings.
 * @param {(!acgraph.vector.Fill|!Array.<(acgraph.vector.GradientKey|string)>|null)=} opt_fillOrColorOrKeys .
 * @param {number=} opt_opacityOrAngleOrCx .
 * @param {(number|boolean|!anychart.math.Rect|!{left:number,top:number,width:number,height:number})=} opt_modeOrCy .
 * @param {(number|!anychart.math.Rect|!{left:number,top:number,width:number,height:number}|null)=} opt_opacityOrMode .
 * @param {number=} opt_opacity .
 * @param {number=} opt_fx .
 * @param {number=} opt_fy .
 * @return {!(acgraph.vector.Fill|anychart.core.grids.Map)} Grid odd fill settings or Grid instance for method chaining.
 */
anychart.core.grids.Map.prototype.oddFill = function(opt_fillOrColorOrKeys, opt_opacityOrAngleOrCx, opt_modeOrCy, opt_opacityOrMode, opt_opacity, opt_fx, opt_fy) {
  if (goog.isDef(opt_fillOrColorOrKeys)) {
    var val = acgraph.vector.normalizeFill.apply(null, arguments);
    if (!anychart.color.equals(/** @type {acgraph.vector.Fill} */ (this.oddFill_), val)) {
      this.oddFill_ = val;
      this.invalidate(anychart.ConsistencyState.APPEARANCE, anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  }
  return this.oddFill_;
};


/**
 * Get/set grid even fill settings.
 * @param {(!acgraph.vector.Fill|!Array.<(acgraph.vector.GradientKey|string)>|null)=} opt_fillOrColorOrKeys .
 * @param {number=} opt_opacityOrAngleOrCx .
 * @param {(number|boolean|!anychart.math.Rect|!{left:number,top:number,width:number,height:number})=} opt_modeOrCy .
 * @param {(number|!anychart.math.Rect|!{left:number,top:number,width:number,height:number}|null)=} opt_opacityOrMode .
 * @param {number=} opt_opacity .
 * @param {number=} opt_fx .
 * @param {number=} opt_fy .
 * @return {!(acgraph.vector.Fill|anychart.core.grids.Map)} Grid even fill settings or Grid instance for method chaining.
 */
anychart.core.grids.Map.prototype.evenFill = function(opt_fillOrColorOrKeys, opt_opacityOrAngleOrCx, opt_modeOrCy, opt_opacityOrMode, opt_opacity, opt_fx, opt_fy) {
  if (goog.isDef(opt_fillOrColorOrKeys)) {
    var val = acgraph.vector.normalizeFill.apply(null, arguments);
    if (!anychart.color.equals(/** @type {acgraph.vector.Fill} */ (this.evenFill_), val)) {
      this.evenFill_ = val;
      this.invalidate(anychart.ConsistencyState.APPEARANCE, anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  }
  return this.evenFill_;
};


/**
 * Get/set grid stroke line.
 * @param {(acgraph.vector.Stroke|acgraph.vector.ColoredFill|string|null)=} opt_strokeOrFill Fill settings
 *    or stroke settings.
 * @param {number=} opt_thickness [1] Line thickness.
 * @param {string=} opt_dashpattern Controls the pattern of dashes and gaps used to stroke paths.
 * @param {acgraph.vector.StrokeLineJoin=} opt_lineJoin Line joint style.
 * @param {acgraph.vector.StrokeLineCap=} opt_lineCap Line cap style.
 * @return {!(anychart.core.grids.Map|acgraph.vector.Stroke)} Grid stroke line settings or Grid instance for method chaining.
 */
anychart.core.grids.Map.prototype.stroke = function(opt_strokeOrFill, opt_thickness, opt_dashpattern, opt_lineJoin, opt_lineCap) {
  if (goog.isDef(opt_strokeOrFill)) {
    var stroke = acgraph.vector.normalizeStroke.apply(null, arguments);
    if (this.stroke_ != stroke) {
      var oldThickness = this.stroke_ ? acgraph.vector.getThickness(/** @type {acgraph.vector.Stroke} */(this.stroke_)) : 0;
      this.stroke_ = stroke;
      var newThickness = this.stroke_ ? acgraph.vector.getThickness(/** @type {acgraph.vector.Stroke} */(this.stroke_)) : 0;
      var state = anychart.ConsistencyState.APPEARANCE;
      var signal = anychart.Signal.NEEDS_REDRAW;
      if (oldThickness != newThickness) {
        state |= anychart.ConsistencyState.GRIDS_POSITION | anychart.ConsistencyState.BOUNDS;
        signal |= anychart.Signal.BOUNDS_CHANGED;
      }
      this.invalidate(state, signal);
    }
    return this;
  } else {
    return this.stroke_;
  }
};


/**
 * Get/set minor grid stroke line.
 * @param {(acgraph.vector.Stroke|acgraph.vector.ColoredFill|string|null)=} opt_strokeOrFill Fill settings
 *    or stroke settings.
 * @param {number=} opt_thickness [1] Line thickness.
 * @param {string=} opt_dashpattern Controls the pattern of dashes and gaps used to stroke paths.
 * @param {acgraph.vector.StrokeLineJoin=} opt_lineJoin Line joint style.
 * @param {acgraph.vector.StrokeLineCap=} opt_lineCap Line cap style.
 * @return {!(anychart.core.grids.Map|acgraph.vector.Stroke)} Grid stroke line settings or Grid instance for method chaining.
 */
anychart.core.grids.Map.prototype.minorStroke = function(opt_strokeOrFill, opt_thickness, opt_dashpattern, opt_lineJoin, opt_lineCap) {
  if (goog.isDef(opt_strokeOrFill)) {
    var stroke = acgraph.vector.normalizeStroke.apply(null, arguments);
    if (this.minorStroke_ != stroke) {
      var oldThickness = this.minorStroke_ ? acgraph.vector.getThickness(/** @type {acgraph.vector.Stroke} */(this.stroke_)) : 0;
      this.minorStroke_ = stroke;
      var newThickness = this.minorStroke_ ? acgraph.vector.getThickness(/** @type {acgraph.vector.Stroke} */(this.stroke_)) : 0;
      var state = anychart.ConsistencyState.APPEARANCE;
      var signal = anychart.Signal.NEEDS_REDRAW;

      if (oldThickness != newThickness) {
        state |= anychart.ConsistencyState.GRIDS_POSITION | anychart.ConsistencyState.BOUNDS;
        signal |= anychart.Signal.BOUNDS_CHANGED;
      }
      this.invalidate(state, signal);
    }
    return this;
  } else {
    return this.minorStroke_;
  }
};


/**
 * Whether to draw the first line.
 * @param {boolean=} opt_value Whether grid should draw first line.
 * @return {boolean|anychart.core.grids.Map} Whether grid should draw first line or Grid instance for method chaining.
 */
anychart.core.grids.Map.prototype.drawFirstLine = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.drawFirstLine_ != opt_value) {
      this.drawFirstLine_ = opt_value;
      this.invalidate(anychart.ConsistencyState.GRIDS_POSITION,
          anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    }
    return this;
  } else {
    return this.drawFirstLine_;
  }
};


/**
 * Whether to draw the last line.
 * @param {boolean=} opt_value Whether grid should draw last line.
 * @return {boolean|anychart.core.grids.Map} Whether grid should draw first line or Grid instance for method chaining.
 */
anychart.core.grids.Map.prototype.drawLastLine = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.drawLastLine_ != opt_value) {
      this.drawLastLine_ = opt_value;
      this.invalidate(anychart.ConsistencyState.GRIDS_POSITION,
          anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    }
    return this;
  } else {
    return this.drawLastLine_;
  }
};


/**
 *
 * @param {(number|string)=} opt_value
 * @return {string|number|anychart.core.grids.Map}
 */
anychart.core.grids.Map.prototype.precision = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.precision_ != opt_value) {
      this.precision_ = opt_value;
      this.invalidate(anychart.ConsistencyState.GRIDS_POSITION,
          anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    }
    return this;
  } else {
    return this.precision_;
  }
};


//endregion
//region --- Elements creation
//----------------------------------------------------------------------------------------------------------------------
//
//  Elements creation.
//
//----------------------------------------------------------------------------------------------------------------------
/**
 * @return {!acgraph.vector.Path} Grid line element.
 */
anychart.core.grids.Map.prototype.lineElement = function() {
  this.lineElementInternal = this.lineElementInternal ? this.lineElementInternal : acgraph.path();
  this.registerDisposable(this.lineElementInternal);
  return this.lineElementInternal;
};


/**
 * @return {!acgraph.vector.Path} Grid odd fill element.
 * @protected
 */
anychart.core.grids.Map.prototype.oddFillElement = function() {
  if (!this.oddFillElement_) {
    this.oddFillElement_ = acgraph.path();
    this.oddFillElement_.stroke('none');
    this.registerDisposable(this.oddFillElement_);
  }

  return this.oddFillElement_;
};


/**
 * @return {!acgraph.vector.Path} Grid event fill element.
 * @protected
 */
anychart.core.grids.Map.prototype.evenFillElement = function() {
  if (!this.evenFillElement_) {
    this.evenFillElement_ = acgraph.path();
    this.evenFillElement_.stroke('none');
    this.registerDisposable(this.evenFillElement_);
  }

  return this.evenFillElement_;
};


//endregion
//region --- Drawing
/**
 * Draw horizontal line.
 * @param {number} value Tick value to draw grid line.
 * @param {number} shift Grid line pixel shift.
 * @param {number} precision Grid precision.
 * @protected
 */
anychart.core.grids.Map.prototype.drawLineHorizontal = function(value, shift, precision) {
  var scale = this.scale_;
  var xy;

  shift = value == scale.maximumX() ? -shift : shift;

  var currLong = scale.minimumX();
  while (currLong < scale.maximumX()) {
    xy = scale.transform(currLong, value, null);
    if (currLong == scale.minimumX()) {
      this.lineElementInternal.moveTo(xy[0], xy[1] + shift);
    } else {
      this.lineElementInternal.lineTo(xy[0], xy[1] + shift);
    }
    currLong += precision;
  }
  xy = scale.transform(scale.maximumX(), value, null);
  this.lineElementInternal.lineTo(xy[0], xy[1] + shift);
};


/**
 * Draw vertical line.
 * @param {number} value Tick value to draw grid line.
 * @param {number} shift Grid line pixel shift.
 * @param {number} precision Grid precision.
 * @protected
 */
anychart.core.grids.Map.prototype.drawLineVertical = function(value, shift, precision) {
  var scale = this.scale_;
  var xy;

  shift = value == scale.maximumY() ? shift : -shift;

  var currLat = scale.minimumY();
  while (currLat < scale.maximumY()) {
    xy = scale.transform(value, currLat, null);
    if (currLat == scale.minimumY()) {
      this.lineElementInternal.moveTo(xy[0], xy[1] + shift);
    } else {
      this.lineElementInternal.lineTo(xy[0], xy[1] + shift);
    }
    currLat += precision;
  }
  xy = scale.transform(value, scale.maximumY(), null);
  this.lineElementInternal.lineTo(xy[0], xy[1]);
};


/**
 * Whether marker is horizontal
 * @return {boolean} If the marker is horizontal.
 */
anychart.core.grids.Map.prototype.isHorizontal = function() {
  return this.layout() == anychart.enums.Layout.HORIZONTAL;
};


/**
 * Draw horizontal line.
 * @param {number} value Tick value to draw grid interlace.
 * @param {number} prevValue Previous tick value to draw grid interlace.
 * @param {string} fillSettings Interlace fill settings.
 * @param {acgraph.vector.Path} path Layer to draw interlace.
 * @param {number} shift Grid line pixel shift.
 * @param {number} precision Grid precision.
 * @protected
 */
anychart.core.grids.Map.prototype.drawInterlaceHorizontal = function(value, prevValue, fillSettings, path, shift, precision) {
  var scale = this.scale_;

  if (isNaN(prevValue) && value != scale.minimumY()) {
    prevValue = scale.minimumY();
  }

  if (!isNaN(prevValue)) {
    var xy, currLong, currLat;

    shift = value == scale.maximumX() ? -shift : shift;
    var prevShift = prevValue == scale.maximumX() ? -shift : shift;

    currLong = scale.minimumX();
    while (currLong < scale.maximumX()) {
      xy = scale.transform(currLong, value, null);
      if (currLong == scale.minimumX()) {
        path.moveTo(xy[0], xy[1] + prevShift);
      } else {
        path.lineTo(xy[0], xy[1] + prevShift);
      }
      currLong += precision;
    }
    xy = scale.transform(scale.maximumX(), value, null);
    path.lineTo(xy[0], xy[1] + shift);


    currLat = value;
    while (currLat > prevValue) {
      xy = scale.transform(scale.maximumX(), currLat, null);
      path.lineTo(xy[0], xy[1] + shift);
      currLat -= precision;
    }
    xy = scale.transform(scale.maximumX(), prevValue, null);
    path.lineTo(xy[0], xy[1]);


    currLong = scale.maximumX();
    while (currLong > scale.minimumX()) {
      xy = scale.transform(currLong, prevValue, null);
      path.lineTo(xy[0], xy[1] + shift);
      currLong -= precision;
    }
    xy = scale.transform(scale.minimumX(), prevValue, null);
    path.lineTo(xy[0], xy[1]);


    currLat = prevValue;
    while (currLat < value) {
      xy = scale.transform(scale.minimumX(), currLat, null);
      path.lineTo(xy[0], xy[1] + shift);
      currLat += precision;
    }
    xy = scale.transform(scale.minimumX(), value, null);
    path.lineTo(xy[0], xy[1]);
    path.close();
  }
};


/**
 * Draw horizontal line.
 * @param {number} value Tick value to draw grid interlace.
 * @param {number} prevValue Previous tick value to draw grid interlace.
 * @param {string} fillSettings Interlace fill settings.
 * @param {acgraph.vector.Path} path Layer to draw interlace.
 * @param {number} shift Grid line pixel shift.
 * @param {number} precision Grid precision.
 * @protected
 */
anychart.core.grids.Map.prototype.drawInterlaceVertical = function(value, prevValue, fillSettings, path, shift, precision) {
  var scale = this.scale_;

  if (isNaN(prevValue) && value != scale.minimumX()) {
    prevValue = scale.minimumX();
  }

  if (!isNaN(prevValue)) {
    var xy, currLong, currLat;

    shift = value == scale.maximumY() ? shift : -shift;
    var prevShift = prevValue == scale.maximumY() ? shift : -shift;

    currLong = prevValue;
    while (currLong < value) {
      xy = scale.transform(currLong, scale.minimumY(), null);
      if (currLong == prevValue) {
        path.moveTo(xy[0], xy[1] + prevShift);
      } else {
        path.lineTo(xy[0], xy[1] + prevShift);
      }
      currLong += precision;
    }
    xy = scale.transform(value, scale.minimumY(), null);
    path.lineTo(xy[0], xy[1] + shift);


    currLat = scale.minimumY();
    while (currLat < scale.maximumY()) {
      xy = scale.transform(value, currLat, null);
      path.lineTo(xy[0], xy[1] + shift);
      currLat += precision;
    }
    xy = scale.transform(value, scale.maximumY(), null);
    path.lineTo(xy[0], xy[1]);


    currLong = value;
    while (currLong > prevValue) {
      xy = scale.transform(currLong, scale.maximumY(), null);
      path.lineTo(xy[0], xy[1] + shift);
      currLong -= precision;
    }
    xy = scale.transform(prevValue, scale.maximumY(), null);
    path.lineTo(xy[0], xy[1]);


    currLat = scale.maximumY();
    while (currLat > scale.minimumY()) {
      xy = scale.transform(prevValue, currLat);
      path.lineTo(xy[0], xy[1] + shift);
      currLat -= precision;
    }
    xy = scale.transform(prevValue, scale.minimumY(), null);
    path.lineTo(xy[0], xy[1]);
    path.close();
  }
};


/** @inheritDoc */
anychart.core.grids.Map.prototype.remove = function() {
  this.evenFillElement().parent(null);
  this.oddFillElement().parent(null);
  this.lineElement().parent(null);
};


/**
 * Drawing
 */
anychart.core.grids.Map.prototype.draw = function() {
  var scale = /** @type {anychart.scales.Geo} */(this.scale_);

  if (!scale) {
    anychart.core.reporting.error(anychart.enums.ErrorCode.SCALE_NOT_SET);
    return this;
  }

  if (!this.checkDrawingNeeded())
    return this;

  if (this.hasInvalidationState(anychart.ConsistencyState.Z_INDEX)) {
    var zIndex = /** @type {number} */(this.zIndex());
    this.evenFillElement().zIndex(zIndex);
    this.oddFillElement().zIndex(zIndex);
    this.lineElement().zIndex(zIndex);
    this.markConsistent(anychart.ConsistencyState.Z_INDEX);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.CONTAINER)) {
    var container = /** @type {acgraph.vector.ILayer} */(this.container());
    this.evenFillElement().parent(container);
    this.oddFillElement().parent(container);
    this.lineElement().parent(container);
    this.markConsistent(anychart.ConsistencyState.CONTAINER);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.APPEARANCE)) {
    this.lineElement().stroke(/** @type {acgraph.vector.Stroke} */(this.stroke()));
    this.oddFillElement().fill(/** @type {acgraph.vector.Fill} */(this.oddFill()));
    this.evenFillElement().fill(/** @type {acgraph.vector.Fill} */(this.evenFill()));
    this.markConsistent(anychart.ConsistencyState.APPEARANCE);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.GRIDS_POSITION) ||
      this.hasInvalidationState(anychart.ConsistencyState.BOUNDS)) {
    var layout, fill, path, ticks, minorTicks, tickVal, precision;
    var prevTickVal = NaN;

    if (this.isHorizontal()) {
      ticks = scale.yTicks();
      minorTicks = scale.yMinorTicks();
      precision = anychart.utils.normalizeSize(this.precision(), scale.longRange);
      layout = [this.drawLineHorizontal, this.drawInterlaceHorizontal];
    } else {
      ticks = scale.xTicks();
      minorTicks = scale.xMinorTicks();
      precision = anychart.utils.normalizeSize(this.precision(), scale.latRange);
      layout = [this.drawLineVertical, this.drawInterlaceVertical];
    }

    var ticksArray = ticks.get();

    this.evenFillElement().clear();
    this.oddFillElement().clear();
    this.lineElement().clear();

    var clip = scale.getViewSpace();

    this.evenFillElement().clip(clip);
    this.oddFillElement().clip(clip);
    this.lineElement().clip(clip);

    var drawLine = layout[0];
    var drawInterlace = layout[1];

    var pixelShift = -this.lineElement().strokeThickness() % 2 / 2;

    for (var i = 0, count = ticksArray.length; i < count; i++) {
      tickVal = ticksArray[i];

      if (i % 2 == 0) {
        fill = this.evenFill_;
        path = this.evenFillElement_;
      } else {
        fill = this.oddFill_;
        path = this.oddFillElement_;
      }

      if (fill != 'none') {
        drawInterlace.call(this, tickVal, prevTickVal, fill, path, pixelShift, precision);
      }

      if (i == 0) {
        if (this.drawFirstLine_)
          drawLine.call(this, tickVal, pixelShift, precision);
      } else if (i == count - 1) {
        if (this.drawLastLine_)
          drawLine.call(this, tickVal, pixelShift, precision);
      } else {
        drawLine.call(this, tickVal, pixelShift, precision);
      }

      prevTickVal = tickVal;
    }

    var scaleMaximum = this.isHorizontal() ? scale.maximumY() : scale.maximumX();
    if (tickVal != scaleMaximum) {
      //draw last interlace if last scale tick is not scale maximum
      if (i % 2 == 0) {
        fill = this.evenFill_;
        path = this.evenFillElement_;
      } else {
        fill = this.oddFill_;
        path = this.oddFillElement_;
      }

      drawInterlace.call(this, scaleMaximum, prevTickVal, fill, path, pixelShift);
    }

    this.markConsistent(anychart.ConsistencyState.GRIDS_POSITION);
    this.markConsistent(anychart.ConsistencyState.BOUNDS);
  }

  return this;
};


//endregion
//region --- Exports
//exports
anychart.core.grids.Map.prototype['stroke'] = anychart.core.grids.Map.prototype.stroke;
anychart.core.grids.Map.prototype['minorStroke'] = anychart.core.grids.Map.prototype.minorStroke;
anychart.core.grids.Map.prototype['precision'] = anychart.core.grids.Map.prototype.precision;
anychart.core.grids.Map.prototype['drawFirstLine'] = anychart.core.grids.Map.prototype.drawFirstLine;
anychart.core.grids.Map.prototype['drawLastLine'] = anychart.core.grids.Map.prototype.drawLastLine;
anychart.core.grids.Map.prototype['oddFill'] = anychart.core.grids.Map.prototype.oddFill;
anychart.core.grids.Map.prototype['evenFill'] = anychart.core.grids.Map.prototype.evenFill;
//endregion
