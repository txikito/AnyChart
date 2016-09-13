goog.provide('anychart.scales.Geo');

goog.require('anychart.core.Base');
goog.require('anychart.enums');
goog.require('anychart.scales.GeoTicks');



/**
 * @constructor
 * @extends {anychart.core.Base}
 */
anychart.scales.Geo = function() {
  goog.base(this);
  /**
   * Scale input domain minimum.
   * @type {number}
   * @protected
   */
  this.dataRangeMinX = Number.MAX_VALUE;

  /**
   * Scale input domain maximum.
   * @type {number}
   * @protected
   */
  this.dataRangeMaxX = -Number.MAX_VALUE;

  /**
   * Scale input domain minimum.
   * @type {number}
   * @protected
   */
  this.dataRangeMinY = Number.MAX_VALUE;

  /**
   * Scale input domain maximum.
   * @type {number}
   * @protected
   */
  this.dataRangeMaxY = -Number.MAX_VALUE;

  /**
   * Scale input domain minimum.
   * @type {number}
   * @protected
   */
  this.dataRangeMinLong = Number.MAX_VALUE;

  /**
   * Scale input domain maximum.
   * @type {number}
   * @protected
   */
  this.dataRangeMaxLong = -Number.MAX_VALUE;

  /**
   * Scale input domain minimum.
   * @type {number}
   * @protected
   */
  this.dataRangeMinLat = Number.MAX_VALUE;

  /**
   * Scale input domain maximum.
   * @type {number}
   * @protected
   */
  this.dataRangeMaxLat = -Number.MAX_VALUE;

  /**
   * @type {boolean}
   * @protected
   */
  this.minimumLongModeAuto = true;

  /**
   * @type {boolean}
   * @protected
   */
  this.minimumLatModeAuto = true;

  /**
   * @type {boolean}
   * @protected
   */
  this.maximumLongModeAuto = true;

  /**
   * @type {boolean}
   * @protected
   */
  this.maximumLatModeAuto = true;

  /**
   * @type {number}
   * @protected
   */
  this.rangeBasedGap = 0;

  /**
   * @type {number}
   * @protected
   */
  this.minX = NaN;

  /**
   * @type {number}
   * @protected
   */
  this.maxX = NaN;

  /**
   * @type {number}
   * @protected
   */
  this.minY = NaN;

  /**
   * @type {number}
   * @protected
   */
  this.maxY = NaN;

  /**
   * @type {number}
   * @protected
   */
  this.rangeX = 1;

  /**
   * @type {number}
   * @protected
   */
  this.rangeY = 1;

  /**
   * If the scale is consistent. We can't use consistency states management due to the same behaviour for all scales.
   * @type {boolean}
   * @protected
   */
  this.consistent = false;

  /**
   * The number of current calculation sessions. Each chart starts a calculation session in its calculate() method and
   * finishes it in its draw() method beginning.
   * @type {number}
   * @private
   */
  this.autoCalcs_ = 0;

  /**
   * If the X scale is inverted.
   * @type {boolean}
   * @protected
   */
  this.isInvertedX = false;

  /**
   * If the Y scale is inverted.
   * @type {boolean}
   * @protected
   */
  this.isInvertedY = false;

  /**
   * Scale bounds.
   * @type {anychart.math.Rect}
   * @private
   */
  this.bounds_ = null;
};
goog.inherits(anychart.scales.Geo, anychart.core.Base);


//region --- Class properties
/**
 * Supported signals mask.
 * @type {number}
 */
anychart.scales.Geo.prototype.SUPPORTED_SIGNALS =
    anychart.Signal.NEEDS_REAPPLICATION |
    anychart.Signal.NEEDS_RECALCULATION;


/**
 * @type {number}
 */
anychart.scales.Geo.LIMIT_MINIMUM_LONG = -180;


/**
 * @type {number}
 */
anychart.scales.Geo.LIMIT_MAXIMUM_LONG = 180;


/**
 * @type {number}
 */
anychart.scales.Geo.LIMIT_MINIMUM_LAT = -90;


/**
 * @type {number}
 */
anychart.scales.Geo.LIMIT_MAXIMUM_LAT = 90;


//endregion
//region --- Internal settings


/**
 * Returns pixel bounds.
 * @return {anychart.math.Rect} .
 */
anychart.scales.Geo.prototype.getBounds = function() {
  return this.bounds_ ? this.bounds_.clone() : anychart.math.rect(0, 0, 0, 0);
};


/**
 * @param {anychart.math.Rect} value Bounds.
 * @return {anychart.scales.Geo} .
 */
anychart.scales.Geo.prototype.setBounds = function(value) {
  this.bounds_ = value;
  this.consistent = false;
  return this;
};


/**
 * Returns space limited scale extremes.
 * @return {acgraph.vector.Path}
 */
anychart.scales.Geo.prototype.getViewSpace = function() {
  if (!this.viewSpace)
    this.viewSpace = acgraph.path();

  var minLong = this.minimumX();
  var maxLong = this.maximumX();
  var minLat = this.minimumY();
  var maxLat = this.maximumY();

  this.viewSpace.clear();
  var xy = this.transform(minLong, minLat, null);

  this.viewSpace.moveTo(xy[0], xy[1]);
  var currLat = minLat;
  while (currLat < maxLat) {
    xy = this.transform(minLong, currLat, null);
    this.viewSpace.lineTo(xy[0], xy[1]);
    currLat += 1;
  }
  xy = this.transform(minLong, maxLat, null);
  this.viewSpace.lineTo(xy[0], xy[1]);

  currLong = minLong;
  while (currLong < maxLong) {
    xy = this.transform(currLong, maxLat, null);
    this.viewSpace.lineTo(xy[0], xy[1]);
    currLong += 1;
  }
  xy = this.transform(maxLong, maxLat, null);
  this.viewSpace.lineTo(xy[0], xy[1]);

  currLat = maxLat;
  while (currLat > minLat) {
    xy = this.transform(maxLong, currLat), null;
    this.viewSpace.lineTo(xy[0], xy[1]);
    currLat -= 1;
  }
  xy = this.transform(maxLong, minLat, null);
  this.viewSpace.lineTo(xy[0], xy[1]);

  var currLong = maxLong;
  while (currLong > minLong) {
    xy = this.transform(currLong, minLat, null);
    this.viewSpace.lineTo(xy[0], xy[1]);
    currLong -= 1;
  }
  xy = this.transform(minLong, minLat, null);
  this.viewSpace.lineTo(xy[0], xy[1]);
  this.viewSpace.close();

  var viewSpace = acgraph.path();
  viewSpace.deserialize(this.viewSpace.serialize());
  return viewSpace;
};


/**
 * Sets transformation map
 * @param {Object} value tx map.
 */
anychart.scales.Geo.prototype.setTxMap = function(value) {
  this.tx = value;
  this.consistent = false;
};


/**
 * Sets transformation map
 * @param {number} value tx map.
 */
anychart.scales.Geo.prototype.setMapZoom = function(value) {
  this.zoom = value;
  this.consistent = false;
};


/**
 * @param {number} dx tx map.
 * @param {number} dy tx map.
 */
anychart.scales.Geo.prototype.setOffsetFocusPoint = function(dx, dy) {
  this.dx_ = dx;
  this.dy_ = dy;
  this.consistent = false;
};


/**
 * Returns scale type.
 * @return {string}
 */
anychart.scales.Geo.prototype.getType = function() {
  return anychart.enums.MapsScaleTypes.GEO;
};


/**
 * Checks if previous data range differs from the current, dispatches a REAPPLICATION signal and returns the result.
 * @param {boolean} silently If set, the signal is not dispatched.
 * @return {boolean} If the scale was changed and it needs to be reapplied.
 * @protected
 */
anychart.scales.Geo.prototype.checkScaleChanged = function(silently) {
  var res = (this.oldDataRangeMinX != this.dataRangeMinX) || (this.oldDataRangeMaxX != this.dataRangeMaxX) ||
      (this.oldDataRangeMinY != this.dataRangeMinY) || (this.oldDataRangeMaxY != this.dataRangeMaxY);
  if (res) {
    this.consistent = false;
    if (!silently)
      this.dispatchSignal(anychart.Signal.NEEDS_REAPPLICATION);
  }
  return res;
};


//endregion
//region --- Ticks
/**
 * @param {} opt_value
 */
anychart.scales.Geo.prototype.xTicks = function(opt_value) {
  if (!this.xTicks_) {
    this.xTicks_ = this.createTicks();
    this.xTicks_.setOrientation(anychart.enums.Layout.HORIZONTAL);
  }
  if (goog.isDef(opt_value)) {
    this.xTicks_.setup(opt_value);
    return this;
  }
  return this.xTicks_;
};


/**
 * @param {} opt_value
 */
anychart.scales.Geo.prototype.xMinorTicks = function(opt_value) {
  if (!this.xMinorTicks_) {
    this.xMinorTicks_ = this.createTicks();
    this.xMinorTicks_.setOrientation(anychart.enums.Layout.HORIZONTAL);
  }
  if (goog.isDef(opt_value)) {
    this.xMinorTicks_.setup(opt_value);
    return this;
  }
  return this.xMinorTicks_;
};


/**
 * @param {} opt_value
 */
anychart.scales.Geo.prototype.yTicks = function(opt_value) {
  if (!this.yTicks_) {
    this.yTicks_ = this.createTicks();
    this.yTicks_.setOrientation(anychart.enums.Layout.VERTICAL);
  }
  if (goog.isDef(opt_value)) {
    this.yTicks_.setup(opt_value);
    return this;
  }
  return this.yTicks_;
};


/**
 * @param {} opt_value
 */
anychart.scales.Geo.prototype.yMinorTicks = function(opt_value) {
  if (!this.yMinorTicks_) {
    this.yMinorTicks_ = this.createTicks();
    this.yMinorTicks_.setOrientation(anychart.enums.Layout.VERTICAL);
  }
  if (goog.isDef(opt_value)) {
    this.yMinorTicks_.setup(opt_value);
    return this;
  }
  return this.yMinorTicks_;
};


/**
 * Ticks invalidation handler.
 * @param {anychart.SignalEvent} event Event object.
 * @private
 */
anychart.scales.Geo.prototype.ticksInvalidated_ = function(event) {
  if (event.hasSignal(anychart.Signal.NEEDS_REAPPLICATION)) {
    this.consistent = false;
    this.dispatchSignal(anychart.Signal.NEEDS_REAPPLICATION);
  }
};


/**
 * Create scale ticks.
 * @return {!anychart.scales.GeoTicks}
 * @protected
 */
anychart.scales.Geo.prototype.createTicks = function() {
  var ticks = new anychart.scales.GeoTicks(this);
  this.registerDisposable(ticks);
  ticks.listenSignals(this.ticksInvalidated_, this);
  return ticks;
};


//endregion
//region --- Scale settings
/**
 * Getter/setter for gap.
 * @param {number=} opt_value Value to set.
 * @return {number|anychart.scales.Geo} .
 */
anychart.scales.Geo.prototype.gap = function(opt_value) {
  if (goog.isDef(opt_value)) {
    opt_value = +opt_value || 0;
    if (this.rangeBasedGap != opt_value) {
      this.rangeBasedGap = opt_value;
      if (this.minimumModeAuto) {
        this.consistent = false;
        this.dispatchSignal(anychart.Signal.NEEDS_REAPPLICATION);
      }
    }
    return this;
  }
  return this.rangeBasedGap;
};


/**
 * @param {number=} opt_value Value to set.
 * @return {number|anychart.scales.Geo} Scale minimum.
 */
anychart.scales.Geo.prototype.minimumX = function(opt_value) {
  if (goog.isDef(opt_value)) {
    var val = anychart.utils.toNumber(opt_value);
    var auto = isNaN(val);
    if (auto != this.minimumLongModeAuto || (!auto && val != this.minLong)) {
      this.minimumLongModeAuto = auto;
      this.minLong = val;
      this.consistent = false;
      if (auto)
        this.dispatchSignal(anychart.Signal.NEEDS_RECALCULATION);
      else
        this.dispatchSignal(anychart.Signal.NEEDS_REAPPLICATION);
    }
    return this;
  }
  this.calculate();
  return this.minLong;
};


/**
 * @param {number=} opt_value Value to set.
 * @return {number|anychart.scales.Geo} Scale maximum.
 */
anychart.scales.Geo.prototype.maximumX = function(opt_value) {
  if (goog.isDef(opt_value)) {
    var val = anychart.utils.toNumber(opt_value);
    var auto = isNaN(val);
    if (auto != this.maximumLongModeAuto || (!auto && val != this.maxLong)) {
      this.maximumLongModeAuto = auto;
      this.maxLong = val;
      this.consistent = false;
      if (auto)
        this.dispatchSignal(anychart.Signal.NEEDS_RECALCULATION);
      else
        this.dispatchSignal(anychart.Signal.NEEDS_REAPPLICATION);
    }
    return this;
  }
  this.calculate();
  return this.maxLong;
};


/**
 * @param {number=} opt_value Value to set.
 * @return {number|anychart.scales.Geo} Scale minimum.
 */
anychart.scales.Geo.prototype.minimumY = function(opt_value) {
  if (goog.isDef(opt_value)) {
    var val = anychart.utils.toNumber(opt_value);
    var auto = isNaN(val);
    if (auto != this.minimumLatModeAuto || (!auto && val != this.minLat)) {
      this.minimumLatModeAuto = auto;
      this.minLat = val;
      this.consistent = false;
      if (auto)
        this.dispatchSignal(anychart.Signal.NEEDS_RECALCULATION);
      else
        this.dispatchSignal(anychart.Signal.NEEDS_REAPPLICATION);
    }
    return this;
  }
  this.calculate();
  return this.minLat;
};


/**
 * @param {number=} opt_value Value to set.
 * @return {number|anychart.scales.Geo} Scale maximum.
 */
anychart.scales.Geo.prototype.maximumY = function(opt_value) {
  if (goog.isDef(opt_value)) {
    var val = anychart.utils.toNumber(opt_value);
    var auto = isNaN(val);
    if (auto != this.maximumLatModeAuto || (!auto && val != this.maxLat)) {
      this.maximumLatModeAuto = auto;
      this.maxLat = val;
      this.consistent = false;
      if (auto)
        this.dispatchSignal(anychart.Signal.NEEDS_RECALCULATION);
      else
        this.dispatchSignal(anychart.Signal.NEEDS_REAPPLICATION);
    }
    return this;
  }
  this.calculate();
  return this.maxLat;
};


/**
 * Getter and setter for scale inversion.
 * @param {boolean=} opt_invertedX Inverted X state to set.
 * @param {boolean=} opt_invertedY Inverted Y state to set.
 * @return {(!anychart.scales.Geo|Array.<boolean>)} Inverted state or itself for method chaining.
 */
anychart.scales.Geo.prototype.inverted = function(opt_invertedX, opt_invertedY) {
  if (goog.isDef(opt_invertedX) || goog.isDef(opt_invertedX)) {
    var signal = 0;
    if (goog.isDef(opt_invertedX)) {
      opt_invertedX = !!opt_invertedX;
      if (this.isInvertedX != opt_invertedX) {
        this.isInvertedX = opt_invertedX;
        signal = anychart.Signal.NEEDS_REAPPLICATION;
      }
    }

    if (goog.isDef(opt_invertedY)) {
      opt_invertedY = !!opt_invertedY;
      if (this.isInvertedY != opt_invertedY) {
        this.isInvertedY = opt_invertedY;
        signal = anychart.Signal.NEEDS_REAPPLICATION;
      }
    }

    this.dispatchSignal(signal);
    return this;
  }
  return [this.isInvertedX, this.isInvertedY];
};


//endregion
//region --- Calculation
/**
 * Extends the current input domain with the passed values (if such don't exist in the domain).<br/>
 * <b>Note:</b> Attention! {@link anychart.scales.Base#finishAutoCalc} drops all passed values.
 * @param {...*} var_args Values that are supposed to extend the input domain.
 * @return {!anychart.scales.Geo} {@link anychart.scales.Geo} instance for method chaining.
 */
anychart.scales.Geo.prototype.extendDataRange = function(var_args) {
  for (var i = 0; i < arguments.length - 1; i = i + 2) {
    var lon = parseFloat(+arguments[i]);
    var lat = parseFloat(+arguments[i + 1]);

    if (isNaN(lon) || isNaN(lat))
      continue;

    if (lon < anychart.scales.Geo.LIMIT_MINIMUM_LONG || lon > anychart.scales.Geo.LIMIT_MAXIMUM_LONG) {
      lon = goog.math.clamp(lon, anychart.scales.Geo.LIMIT_MINIMUM_LONG, anychart.scales.Geo.LIMIT_MAXIMUM_LONG);
    }
    if (lat < anychart.scales.Geo.LIMIT_MINIMUM_LAT || lat > anychart.scales.Geo.LIMIT_MAXIMUM_LAT) {
      lat = goog.math.clamp(lat, anychart.scales.Geo.LIMIT_MINIMUM_LAT, anychart.scales.Geo.LIMIT_MAXIMUM_LAT);
    }

    if (lon < this.dataRangeMinLong) {
      this.dataRangeMinLong = lon;
      this.consistent = false;
    }
    if (lon > this.dataRangeMaxLong) {
      this.dataRangeMaxLong = lon;
      this.consistent = false;
    }

    if (lat < this.dataRangeMinLat) {
      this.dataRangeMinLat = lat;
      this.consistent = false;
    }
    if (lat > this.dataRangeMaxLat) {
      this.dataRangeMaxLat = lat;
      this.consistent = false;
    }
  }

  if (!this.consistent) {
    var auto = this.needsAutoCalc();
    if (auto)
      this.dispatchSignal(anychart.Signal.NEEDS_RECALCULATION);
    else
      this.dispatchSignal(anychart.Signal.NEEDS_REAPPLICATION);
  }

  return this;
};


/**
 * Extends the current input domain with the passed values (if such don't exist in the domain).<br/>
 * <b>Note:</b> Attention! {@link anychart.scales.Base#finishAutoCalc} drops all passed values.
 * @param {...*} var_args Values that are supposed to extend the input domain.
 * @return {!anychart.scales.Geo} {@link anychart.scales.Geo} instance for method chaining.
 */
anychart.scales.Geo.prototype.extendDataRangeInternal = function(var_args) {
  for (var i = 0; i < arguments.length - 1; i = i + 2) {
    var x = +arguments[i];
    var y = +arguments[i + 1];
    if (isNaN(x)) x = parseFloat(arguments[i]);
    if (isNaN(y)) y = parseFloat(arguments[i + 1]);

    var latlon = this.scaleToLatLon(x, y, 'default');
    var lon = latlon[0];
    var lat = latlon[1];
    var scaledLatLon, needCorrect;
    if (lon < anychart.scales.Geo.LIMIT_MINIMUM_LONG || lon > anychart.scales.Geo.LIMIT_MAXIMUM_LONG) {
      needCorrect = true;
      latlon[0] = goog.math.clamp(lon, anychart.scales.Geo.LIMIT_MINIMUM_LONG, anychart.scales.Geo.LIMIT_MAXIMUM_LONG);
    }
    if (lat < anychart.scales.Geo.LIMIT_MINIMUM_LAT || lat > anychart.scales.Geo.LIMIT_MAXIMUM_LAT) {
      needCorrect = true;
      latlon[1] = goog.math.clamp(lat, anychart.scales.Geo.LIMIT_MINIMUM_LAT, anychart.scales.Geo.LIMIT_MAXIMUM_LAT);
    }
    if (needCorrect) {
      scaledLatLon = this.latLonToScale(latlon[0], latlon[1]);
      x = scaledLatLon[0];
      y = scaledLatLon[1];
    }

    this.extendDataRange.apply(this, latlon);

    if (x < this.dataRangeMinX) {
      this.dataRangeMinX = x;
      this.consistent = false;
    }
    if (x > this.dataRangeMaxX) {
      this.dataRangeMaxX = x;
      this.consistent = false;
    }

    if (y < this.dataRangeMinY) {
      this.dataRangeMinY = y;
      this.consistent = false;
    }
    if (y > this.dataRangeMaxY) {
      this.dataRangeMaxY = y;
      this.consistent = false;
    }
  }
  return this;
};


/**
 * Resets scale data range if it needs auto calculation.
 * @return {!anychart.scales.Geo} Itself for chaining.
 * @protected
 */
anychart.scales.Geo.prototype.resetDataRange = function() {
  this.oldDataRangeMinLong = this.dataRangeMinLong;
  this.oldDataRangeMaxLong = this.dataRangeMaxLong;
  this.oldDataRangeMinLat = this.dataRangeMinLat;
  this.oldDataRangeMaxLat = this.dataRangeMaxLat;
  this.dataRangeMinLong = Number.MAX_VALUE;
  this.dataRangeMaxLong = -Number.MAX_VALUE;
  this.dataRangeMinLat = Number.MAX_VALUE;
  this.dataRangeMaxLat = -Number.MAX_VALUE;

  this.oldDataRangeMinX = this.dataRangeMinX;
  this.oldDataRangeMaxX = this.dataRangeMaxX;
  this.oldDataRangeMinY = this.dataRangeMinY;
  this.oldDataRangeMaxY = this.dataRangeMaxY;
  this.dataRangeMinX = Number.MAX_VALUE;
  this.dataRangeMaxX = -Number.MAX_VALUE;
  this.dataRangeMinY = Number.MAX_VALUE;
  this.dataRangeMaxY = -Number.MAX_VALUE;

  this.consistent = false;
  return this;
};


/**
 * @return {boolean} Returns true if the scale needs input domain auto calculations.
 */
anychart.scales.Geo.prototype.needsAutoCalc = function() {
  return this.minimumLongModeAuto || this.minimumLatModeAuto || this.maximumLongModeAuto || this.maximumLatModeAuto;
};


/**
 * Informs scale that an auto range calculation started for the chart, so it should reset its data range on the first
 * call of this method if needed.
 * @return {!anychart.scales.Geo} Chaining.
 */
anychart.scales.Geo.prototype.startAutoCalc = function() {
  if (!this.autoCalcs_)
    this.resetDataRange();
  this.autoCalcs_++;
  return this;
};


/**
 * Informs the scale that an auto range calculation started for the chart in past was ended.
 * @param {boolean=} opt_silently If this flag is set, do not dispatch an event if reapplication needed.
 * @return {boolean} If the calculation changed the scale and it needs to be reapplied.
 */
anychart.scales.Geo.prototype.finishAutoCalc = function(opt_silently) {
  this.autoCalcs_ = Math.max(this.autoCalcs_ - 1, 0);
  if (this.autoCalcs_ == 0) {
    return this.checkScaleChanged(!!opt_silently);
  } else
    return true; // todo: additional stuff when calculating shared scales!
};


/**
 * Ensures that ticks are initialized for the scale.
 * NOTE: THIS METHOD IS FOR INTERNAL USE IN THE SCALE AND TICKS ONLY. DO NOT PUBLISH IT.
 */
anychart.scales.Geo.prototype.calculate = function() {
  if (this.consistent || !this.bounds_) return;
  this.consistent = true;
  this.determineScaleMinMax();

  var minPoint = [this.minLong, this.minLat];
  var maxPoint = [this.maxLong, this.maxLat];

  var xSetupResult = this.xTicks().setupAsMajor(minPoint[0], maxPoint[0]);
  var ySetupResult = this.yTicks().setupAsMajor(minPoint[1], maxPoint[1]);

  // console.log(xSetupResult, ySetupResult);
  // console.log(this.minLong, this.maxLong, this.minLat, this.maxLat);

  this.xMinorTicks().setupAsMinor(this.xTicks().getInternal(), xSetupResult[2], xSetupResult[3]);
  this.yMinorTicks().setupAsMinor(this.yTicks().getInternal(), ySetupResult[2], ySetupResult[3]);

  this.rangeX = this.maxX - this.minX;
  this.rangeY = this.maxY - this.minY;

  this.longRange = this.maxLong - this.minLong;
  this.latRange = this.maxLat - this.minLat;

  this.ratio = Math.min(this.bounds_.height / this.rangeY, this.bounds_.width / this.rangeX);
  this.centerOffsetX = (this.bounds_.width - this.rangeX * this.ratio) / 2;
  this.centerOffsetY = (this.bounds_.height - this.rangeY * this.ratio) / 2;

  //apply gap
  var extremesForMinLong = this.getExtremesForDimension(this.minLong, true);
  var extremesForMaxLong = this.getExtremesForDimension(this.maxLong, true);
  var extremesForMinLat = this.getExtremesForDimension(this.minLat, false);
  var extremesForMaxLat = this.getExtremesForDimension(this.maxLat, false);

  this.minX = Math.min(extremesForMinLong.minX, extremesForMaxLong.minX, extremesForMinLat.minX, extremesForMaxLat.minX,
      extremesForMinLong.maxX, extremesForMaxLong.maxX, extremesForMinLat.maxX, extremesForMaxLat.maxX);
  this.maxX = Math.max(extremesForMinLong.minX, extremesForMaxLong.minX, extremesForMinLat.minX, extremesForMaxLat.minX,
      extremesForMinLong.maxX, extremesForMaxLong.maxX, extremesForMinLat.maxX, extremesForMaxLat.maxX);
  this.minY = Math.min(extremesForMinLong.minY, extremesForMaxLong.minY, extremesForMinLat.minY, extremesForMaxLat.minY,
      extremesForMinLong.maxY, extremesForMaxLong.maxY, extremesForMinLat.maxY, extremesForMaxLat.maxY);
  this.maxY = Math.max(extremesForMinLong.minY, extremesForMaxLong.minY, extremesForMinLat.minY, extremesForMaxLat.minY,
      extremesForMinLong.maxY, extremesForMaxLong.maxY, extremesForMinLat.maxY, extremesForMaxLat.maxY);

  this.rangeX = this.maxX - this.minX;
  this.rangeY = this.maxY - this.minY;

  this.longRange = this.maxLong - this.minLong;
  this.latRange = this.maxLat - this.minLat;

  this.ratio = Math.min(this.bounds_.height / this.rangeY, this.bounds_.width / this.rangeX);
  this.centerOffsetX = (this.bounds_.width - this.rangeX * this.ratio) / 2;
  this.centerOffsetY = (this.bounds_.height - this.rangeY * this.ratio) / 2;

  // console.log(this.minLong, this.minLat, this.maxLong, this.maxLat);
};


/**
 * Returns extremes for passed dimension.
 * @param {number} dimensionValue One of values of dimension.
 * @param {boolean} isHorizontal Dimension orientation.
 * @return {Object.<number>}
 */
anychart.scales.Geo.prototype.getExtremesForDimension = function(dimensionValue, isHorizontal) {
  var xy;
  var minX = Number.MAX_VALUE;
  var minY = Number.MAX_VALUE;
  var maxX = -Number.MAX_VALUE;
  var maxY = -Number.MAX_VALUE;
  var currValue;

  if (isHorizontal) {
    currValue = this.minLat;
    while (currValue < this.maxLat) {
      xy = this.transform(dimensionValue, currValue);
      xy = this.pxToScale(xy[0], xy[1]);
      if (xy[0] < minX) minX = xy[0];
      if (xy[0] > maxX) maxX = xy[0];
      if (xy[1] < minY) minY = xy[1];
      if (xy[1] > maxY) maxY = xy[1];
      currValue += .1;
    }
    xy = this.transform(dimensionValue, this.maxLat);
    xy = this.pxToScale(xy[0], xy[1]);
    if (xy[0] < minX) minX = xy[0];
    if (xy[0] > maxX) maxX = xy[0];
    if (xy[1] < minY) minY = xy[1];
    if (xy[1] > maxY) maxY = xy[1];
  } else {
    currValue = this.minLong;
    while (currValue < this.maxLong) {
      xy = this.transform(currValue, dimensionValue);
      xy = this.pxToScale(xy[0], xy[1]);
      if (xy[0] < minX) minX = xy[0];
      if (xy[0] > maxX) maxX = xy[0];
      if (xy[1] < minY) minY = xy[1];
      if (xy[1] > maxY) maxY = xy[1];
      currValue += .1;
    }
    xy = this.transform(this.maxLong, dimensionValue);
    xy = this.pxToScale(xy[0], xy[1]);
    if (xy[0] < minX) minX = xy[0];
    if (xy[0] > maxX) maxX = xy[0];
    if (xy[1] < minY) minY = xy[1];
    if (xy[1] > maxY) maxY = xy[1];
  }

  return {minX: minX, minY: minY, maxX: maxX, maxY: maxY};
};


/**
 * Determines this.min, this.max and this.range.
 * @protected
 */
anychart.scales.Geo.prototype.determineScaleMinMax = function() {
  var maxLong = this.maximumLongModeAuto ?
      this.dataRangeMaxLong :
      this.maxLong;
  var minLong = this.minimumLongModeAuto ?
      this.dataRangeMinLong :
      this.minLong;

  var maxLat = this.maximumLatModeAuto ?
      this.dataRangeMaxLat :
      this.maxLat;
  var minLat = this.minimumLatModeAuto ?
      this.dataRangeMinLat :
      this.minLat;

  // console.log('>>>', minLong, maxLong, minLat, maxLat);

  var rangeLong = maxLong - minLong;
  var rangeLat = maxLat - minLat;

  if (this.minimumLongModeAuto)
    this.minLong = Math.floor(goog.math.clamp(
        this.dataRangeMinLong - rangeLong * this.rangeBasedGap,
        anychart.scales.Geo.LIMIT_MINIMUM_LONG,
        anychart.scales.Geo.LIMIT_MAXIMUM_LONG));
  if (this.maximumLongModeAuto)
    this.maxLong = Math.ceil(goog.math.clamp(
        this.dataRangeMaxLong + rangeLong * this.rangeBasedGap,
        anychart.scales.Geo.LIMIT_MINIMUM_LONG,
        anychart.scales.Geo.LIMIT_MAXIMUM_LONG));

  if (this.minimumLatModeAuto)
    this.minLat = Math.floor(goog.math.clamp(
        this.dataRangeMinLat - rangeLat * this.rangeBasedGap,
        anychart.scales.Geo.LIMIT_MINIMUM_LAT,
        anychart.scales.Geo.LIMIT_MAXIMUM_LAT));
  if (this.maximumLatModeAuto)
    this.maxLat = Math.ceil(goog.math.clamp(
        this.dataRangeMaxLat + rangeLat * this.rangeBasedGap,
        anychart.scales.Geo.LIMIT_MINIMUM_LAT,
        anychart.scales.Geo.LIMIT_MAXIMUM_LAT));

  this.minX = this.dataRangeMinX;
  this.minY = this.dataRangeMinY;
  this.maxX = this.dataRangeMaxX;
  this.maxY = this.dataRangeMaxY;
};


//endregion
//region --- Translation
/**
 * @param {number} x X value to transform in input scope.
 * @param {number} y Y value to transform in input scope.
 * @return {Array.<number>} Transformed value adjust bounds.
 */
anychart.scales.Geo.prototype.scaleToPx = function(x, y) {
  this.calculate();

  if (!this.bounds_)
    return [NaN, NaN];

  x = anychart.utils.toNumber(x);
  y = anychart.utils.toNumber(y);

  var transformX = (x - this.minX) * this.ratio;
  var transformY = (this.maxY - y) * this.ratio;

  var resultX = this.isInvertedX ?
      this.bounds_.getRight() - this.centerOffsetX - transformX :
      this.bounds_.left + this.centerOffsetX + transformX;

  var resultY = this.isInvertedY ?
      this.bounds_.getBottom() - this.centerOffsetY - transformY :
      this.bounds_.top + this.centerOffsetY + transformY;

  return [resultX, resultY];
};


/**
 * @param {*} x X value to transform in input scope.
 * @param {*} y Y value to transform in input scope.
 * @return {Array.<number>} Transformed value adjust bounds.
 */
anychart.scales.Geo.prototype.pxToScale = function(x, y) {
  this.calculate();

  if (!this.bounds_)
    return [NaN, NaN];

  x = anychart.utils.toNumber(x);
  y = anychart.utils.toNumber(y);

  var transformX = this.isInvertedX ?
      this.bounds_.getRight() - this.centerOffsetX - x :
      x - this.bounds_.left - this.centerOffsetX;

  var transformY = this.isInvertedY ?
      this.bounds_.getBottom() - this.centerOffsetY - y :
      y - this.bounds_.top - this.centerOffsetY;

  var resultX = +(/** @type {number} */(transformX)) / this.ratio + this.minX;
  var resultY = -(/** @type {number} */(transformY)) / this.ratio + this.maxY;

  return [resultX, resultY];
};


/**
 * Returns tx object for passed coords.
 * @param {number} lon Longitude in degrees.
 * @param {number} lat Latitude in degrees.
 * @return {Object}
 */
anychart.scales.Geo.prototype.pickTx = function(lon, lat) {
  var defaultTx = this.tx['default'];

  var txName = goog.object.findKey(this.tx, function(value, key) {
    if (key != 'default' && value.heatZone) {

      var proj = value.curProj || defaultTx.curProj;
      var projected = proj.forward(lon, lat);

      var x = projected[0] * (value.scale || defaultTx.scale);
      var y = projected[1] * (value.scale || defaultTx.scale);

      x += value.xoffset || 0;
      y += value.yoffset || 0;

      var heatZone = value.heatZone;

      return x >= heatZone.left &&
          x <= heatZone.left + heatZone.width &&
          y <= heatZone.top &&
          y >= heatZone.top - heatZone.height;
    }

    return false;
  }) || 'default';

  return this.tx[txName];
};


/**
 * Transform coords in lat/lon to pixel values.
 * @param {number} lon Longitude in degrees.
 * @param {number} lat Latitude in degrees.
 * @return {Array.<number>} Transformed value adjust bounds [x, y].
 */
anychart.scales.Geo.prototype.transformWithoutTx = function(lon, lat, opt_txName) {
  this.calculate();

  var latlon = this.latLonToScale(lon, lat, opt_txName);
  lon = latlon[0];
  lat = latlon[1];

  if (!this.bounds_ || isNaN(lon) || isNaN(lat))
    return [NaN, NaN];

  var transformX = (+(/** @type {number} */(lon)) - this.minX) * this.ratio;
  var transformY = (-(/** @type {number} */(lat)) + this.maxY) * this.ratio;

  var resultX = this.isInvertedX ?
      this.bounds_.getRight() - this.centerOffsetX - transformX :
      this.bounds_.left + this.centerOffsetX + transformX;

  // var minPx = this.bounds_.left + this.centerOffsetX;
  // var maxPx = minPx + this.rangeX * this.ratio;

  // if (resultX < minPx) {
  //   resultX = maxPx + (resultX - minPx);
  // } else if (resultX > maxPx) {
  //   resultX = minPx + (resultX - maxPx);
  // }

  var resultY = this.isInvertedY ?
      this.bounds_.getBottom() - this.centerOffsetY - transformY :
      this.bounds_.top + this.centerOffsetY + transformY;

  return [resultX, resultY];
};


/**
 * Transform lat/lon coords to pixel values.
 * @param {number} lon Longitude in degrees.
 * @param {number} lat Latitude in degrees.
 * @return {Array.<number>} Transformed value adjust bounds [x, y].
 */
anychart.scales.Geo.prototype.transform = function(lon, lat, opt_txName) {
  var coords = this.transformWithoutTx(lon, lat, opt_txName);

  coords[0] = coords[0] * this.zoom + this.dx_;
  coords[1] = coords[1] * this.zoom + this.dy_;

  return coords;
};


/**
 * Transform coords in pixel value to degrees values (lon/lat).
 * @param {number} x X value to transform.
 * @param {number} y Y value to transform.
 * @return {Array.<number>} Transformed value adjust bounds.
 */
anychart.scales.Geo.prototype.inverseTransform = function(x, y) {
  this.calculate();

  if (!this.bounds_ || isNaN(x) || isNaN(y))
    return [NaN, NaN];

  x = anychart.utils.toNumber(x);
  y = anychart.utils.toNumber(y);

  x = (x - this.dx_) / this.zoom;
  y = (y - this.dy_) / this.zoom;

  var transformX = this.isInvertedX ?
      this.bounds_.getRight() - this.centerOffsetX - x : x - this.bounds_.left - this.centerOffsetX;

  var transformY = this.isInvertedY ?
      this.bounds_.getBottom() - this.centerOffsetY - y : y - this.bounds_.top - this.centerOffsetY;

  var resultX = +(/** @type {number} */(transformX)) / this.ratio + this.minX;
  var resultY = -(/** @type {number} */(transformY)) / this.ratio + this.maxY;

  return this.scaleToLatLon(resultX, resultY);
};


/**
 * Returns tick position ratio by its name.<br/>
 * @param {*} value Value to transform in input scope.
 * @return {number} Value transformed to scope [0, 1].
 */
anychart.scales.Geo.prototype.transformX = function(value) {
  this.calculate();
  value = anychart.utils.toNumber(value);
  var result = (value - this.minLong) / this.longRange;

  return this.isInvertedX ? 1 - result : result;
};


/**
 * Returns tick position ratio by its name.<br/>
 * @param {*} value Value to transform in input scope.
 * @return {number} Value transformed to scope [0, 1].
 */
anychart.scales.Geo.prototype.transformY = function(value) {
  this.calculate();
  value = anychart.utils.toNumber(value);
  var result = (value - this.minLat) / this.latRange;

  return this.isInvertedY ? 1 - result : result;
};


/**
 *
 * @param {number} x .
 * @param {number} y .
 * @param {string=} opt_txName .
 * @return {Array.<number>} .
 */
anychart.scales.Geo.prototype.scaleToLatLon = function(x, y, opt_txName) {
  var defaultTx = this.tx['default'];

  var txName;
  if (goog.isDef(opt_txName)) {
    txName = opt_txName in this.tx ? opt_txName : 'default';
  } else {
    txName = goog.object.findKey(this.tx, function(value, key) {
      if (key != 'default' && value.heatZone) {
        var heatZone = value.heatZone;

        return x >= heatZone.left &&
            x <= heatZone.left + heatZone.width &&
            y <= heatZone.top &&
            y >= heatZone.top - heatZone.height;
      }
      return false;
    }) || 'default';
  }

  // var txName__ = goog.object.findKey(this.tx, function(value, key) {
  //       if (key != 'default' && value.heatZone) {
  //         var heatZone = value.heatZone;
  //
  //         return x >= heatZone.left &&
  //             x <= heatZone.left + heatZone.width &&
  //             y <= heatZone.top &&
  //             y >= heatZone.top - heatZone.height;
  //       }
  //       return false;
  //     }) || 'default';

  var tx = this.tx[txName];
  // var tx_ = this.tx[txName__];

  if (txName != 'default') console.log(txName);

  // if (!goog.isDef(opt_txName)) {
    x -= tx.xoffset || defaultTx.xoffset || 0;
    y -= tx.yoffset || defaultTx.yoffset || 0;
  // }

  var scale = tx.scale || defaultTx.scale;
  var crs = tx.crs || defaultTx.crs;
  var proj = tx.curProj || defaultTx.curProj;

  var projected = crs ?
      proj.invert(x / scale, y / scale) :
      [x / scale, y / scale];

  // if (txName__ != 'default')
  //   console.log(projected);

  return [projected[0], projected[1]];
};


/**
 * Convert lat/lon coords to scale.
 * @param {number} lon .
 * @param {number} lat .
 * @return {Array.<number>} .
 */
anychart.scales.Geo.prototype.latLonToScale = function(lon, lat, opt_txName) {
  this.calculate();

  if (isNaN(lon) || isNaN(lat))
    return [NaN, NaN];

  // lon = goog.math.clamp(anychart.utils.toNumber(lon), anychart.scales.Geo.LIMIT_MINIMUM_LONG, anychart.scales.Geo.LIMIT_MAXIMUM_LONG);
  // lat = goog.math.clamp(anychart.utils.toNumber(lat), anychart.scales.Geo.LIMIT_MINIMUM_LAT, anychart.scales.Geo.LIMIT_MAXIMUM_LAT);

  // console.log(lon, lat);

  var tx;
  if (goog.isDef(opt_txName)) {
    tx = (!goog.isNull(opt_txName) && opt_txName in this.tx) ? this.tx[opt_txName] : this.tx['default'];
  } else {
    tx = this.pickTx(lon, lat);
  }

  var defaultTx = this.tx['default'];
  var proj = tx.curProj || defaultTx.curProj;
  var projected = proj.forward(lon, lat);
  var scale = tx.scale;

  projected[0] = projected[0] * scale + (tx.xoffset || 0);
  projected[1] = projected[1] * scale + (tx.yoffset || 0);

  return [projected[0], projected[1]];
};


//endregion
//region --- Serialization
/** @inheritDoc */
anychart.scales.Geo.prototype.serialize = function() {
  var json = goog.base(this, 'serialize');
  json['type'] = this.getType();
  var inv = this.inverted();
  json['invertedX'] = inv[0];
  json['invertedY'] = inv[1];
  json['maximumX'] = this.maximumLongModeAuto ? null : this.maxLong;
  json['maximumY'] = this.maximumLatModeAuto ? null : this.maxLat;
  json['minimumX'] = this.minimumLongModeAuto ? null : this.minLong;
  json['minimumY'] = this.minimumLatModeAuto ? null : this.minLat;
  json['gap'] = this.gap();
  if (this.bounds_)
    json['bounds'] = this.bounds_;
  return json;
};


/** @inheritDoc */
anychart.scales.Geo.prototype.setupByJSON = function(config) {
  goog.base(this, 'setupByJSON', config);
  this.inverted(config['invertedX'], config['invertedY']);
  this.minimumX(config['minimumX']);
  this.minimumY(config['minimumY']);
  this.maximumX(config['maximumX']);
  this.maximumY(config['maximumY']);
  this.gap(config['gap']);
  if ('bounds' in config)
    this.setBounds(config['bounds']);
};


//endregion
//region --- Exports
//exports
//todo (blackart) Don't export yet.
//anychart.scales.Geo.prototype['setBounds'] = anychart.scales.Geo.prototype.setBounds;
//anychart.scales.Geo.prototype['transform'] = anychart.scales.Geo.prototype.transform;
//anychart.scales.Geo.prototype['inverseTransform'] = anychart.scales.Geo.prototype.inverseTransform;
//anychart.scales.Geo.prototype['minimumX'] = anychart.scales.Geo.prototype.minimumX;
//anychart.scales.Geo.prototype['minimumY'] = anychart.scales.Geo.prototype.minimumY;
//anychart.scales.Geo.prototype['maximumX'] = anychart.scales.Geo.prototype.maximumX;
//anychart.scales.Geo.prototype['maximumY'] = anychart.scales.Geo.prototype.maximumY;
//anychart.scales.Geo.prototype['extendDataRangeX'] = anychart.scales.Geo.prototype.extendDataRangeX;
//anychart.scales.Geo.prototype['extendDataRangeY'] = anychart.scales.Geo.prototype.extendDataRangeY;
//anychart.scales.Geo.prototype['inverted'] = anychart.scales.Geo.prototype.inverted;
//anychart.scales.Geo.prototype['startAutoCalc'] = anychart.scales.Geo.prototype.startAutoCalc;
//anychart.scales.Geo.prototype['finishAutoCalc'] = anychart.scales.Geo.prototype.finishAutoCalc;
anychart.scales.Geo.prototype['gap'] = anychart.scales.Geo.prototype.gap;
anychart.scales.Geo.prototype['xTicks'] = anychart.scales.Geo.prototype.xTicks;
anychart.scales.Geo.prototype['xMinorTicks'] = anychart.scales.Geo.prototype.xMinorTicks;
anychart.scales.Geo.prototype['yTicks'] = anychart.scales.Geo.prototype.yTicks;
anychart.scales.Geo.prototype['yMinorTicks'] = anychart.scales.Geo.prototype.xMinorTicks;
anychart.scales.Geo.prototype['extendDataRange'] = anychart.scales.Geo.prototype.extendDataRange;
anychart.scales.Geo.prototype['minimumX'] = anychart.scales.Geo.prototype.minimumX;
anychart.scales.Geo.prototype['maximumX'] = anychart.scales.Geo.prototype.maximumX;
anychart.scales.Geo.prototype['minimumY'] = anychart.scales.Geo.prototype.minimumY;
anychart.scales.Geo.prototype['maximumY'] = anychart.scales.Geo.prototype.maximumY;
//endregion
