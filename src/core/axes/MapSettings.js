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
   * @type {anychart.charts.Map}
   */
  this.map = map;
};


anychart.core.axes.MapSettings.prototype.top = function(opt_value) {
  if (!this.topAxis_) {
    this.topAxis_ = new anychart.core.axes.Map();
    this.topAxis_.listenSignals();
    this.registerDisposable(this.topAxis_);
  }

  if (goog.isDef(opt_value)) {
    this.topAxis_.setup(opt_value);
    return this;
  }
  return this.topAxis_;
};


anychart.core.axes.MapSettings.prototype.right = function(opt_value) {

};


anychart.core.axes.MapSettings.prototype.bottom = function(opt_value) {

};


anychart.core.axes.MapSettings.prototype.left = function(opt_value) {

};


anychart.core.axes.MapSettings.prototype.mapInvalidated_ = function(event) {
  this.map.invalidate(anychart.ConsistencyState.MAP_AXES, anychart.Signal.NEEDS_REDRAW);
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
