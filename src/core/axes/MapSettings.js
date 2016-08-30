//region --- Requiring and Providing
goog.provide('anychart.core.axes.MapSettings');
//endregion



/**
 * Map axes settings.
 * @param {!anychart.charts.Map} map .
 * @constructor
 */
anychart.core.axes.MapSettings = function(map) {
  /**
   * Map.
   * @private
   * @type {anychart.charts.Map}
   */
  this.map_ = map;

  /**
   * All axes.
   * @private
   * @type {Array.<anychart.core.axes.Map>}
   */
  this.axes_ = [];
};


/**
 * Return all exist axes.
 * @return {Array.<anychart.core.axes.Map>}
 */
anychart.core.axes.MapSettings.prototype.getAxes = function() {
  return this.axes_;
};


anychart.core.axes.MapSettings.prototype.top = function(opt_value) {
  if (!this.topAxis_) {
    this.topAxis_ = new anychart.core.axes.Map();
    this.topAxis_.orientation(anychart.enums.Orientation.TOP);
    this.topAxis_.listenSignals(this.mapInvalidated_, this.map_);
    this.axes_.push(this.topAxis_);
    this.map_.registerDisposable(this.topAxis_);
  }

  if (goog.isDef(opt_value)) {
    this.topAxis_.setup(opt_value);
    return this;
  }
  return this.topAxis_;
};


anychart.core.axes.MapSettings.prototype.right = function(opt_value) {
  if (!this.rightAxis_) {
    this.rightAxis_ = new anychart.core.axes.Map();
    this.rightAxis_.orientation(anychart.enums.Orientation.RIGHT);
    this.rightAxis_.listenSignals(this.mapInvalidated_, this.map_);
    this.axes_.push(this.rightAxis_);
    this.map_.registerDisposable(this.rightAxis_);
  }

  if (goog.isDef(opt_value)) {
    this.rightAxis_.setup(opt_value);
    return this;
  }
  return this.rightAxis_;
};


anychart.core.axes.MapSettings.prototype.bottom = function(opt_value) {
  if (!this.bottomAxis_) {
    this.bottomAxis_ = new anychart.core.axes.Map();
    this.bottomAxis_.orientation(anychart.enums.Orientation.BOTTOM);
    this.bottomAxis_.listenSignals(this.mapInvalidated_, this.map_);
    this.axes_.push(this.bottomAxis_);
    this.map_.registerDisposable(this.bottomAxis_);
  }

  if (goog.isDef(opt_value)) {
    this.bottomAxis_.setup(opt_value);
    return this;
  }
  return this.bottomAxis_;
};


anychart.core.axes.MapSettings.prototype.left = function(opt_value) {
  if (!this.leftAxis_) {
    this.leftAxis_ = new anychart.core.axes.Map();
    this.leftAxis_.orientation(anychart.enums.Orientation.LEFT);
    this.leftAxis_.listenSignals(this.mapInvalidated_, this.map_);
    this.axes_.push(this.leftAxis_);
    this.map_.registerDisposable(this.leftAxis_);
  }

  if (goog.isDef(opt_value)) {
    this.leftAxis_.setup(opt_value);
    return this;
  }
  return this.leftAxis_;
};


anychart.core.axes.MapSettings.prototype.mapInvalidated_ = function(event) {
  this.invalidate(anychart.ConsistencyState.MAP_AXES, anychart.Signal.NEEDS_REDRAW);
};


//region --- Setup and Dispose
/** @inheritDoc */
anychart.core.axes.MapSettings.prototype.setupByJSON = function(config) {

};


/** @inheritDoc */
anychart.core.axes.MapSettings.prototype.serialize = function() {
  var json = {};
};


/** @inheritDoc */
anychart.core.axes.MapSettings.prototype.disposeInternal = function() {

};


//endregion
//region --- Exports

//exports
//endregion
