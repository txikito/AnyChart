//region --- Requiring and Providing
goog.provide('anychart.core.grids.MapSettings');
goog.require('anychart.core.grids.Map');
//endregion



/**
 * Map axes settings.
 * @param {!anychart.charts.Map} map .
  * @extends {goog.Disposable}
 * @constructor
 */
anychart.core.grids.MapSettings = function(map) {
  /**
   * Map.
   * @private
   * @type {anychart.charts.Map}
   */
  this.map_ = map;

  /**
   * All grids.
   * @private
   * @type {Array.<anychart.core.grids.Map>}
   */
  this.grids_ = [];
};
goog.inherits(anychart.core.grids.MapSettings, goog.Disposable);


//region --- Grids
/**
 * Return all exist grids.
 * @return {Array.<anychart.core.grids.Map>}
 */
anychart.core.grids.MapSettings.prototype.getItems = function() {
  return this.grids_;
};


/**
 * Vertical grid.
 * @param {(boolean|Object)=} opt_value
 * @return {anychart.core.grids.Map|anychart.core.grids.MapSettings}
 */
anychart.core.grids.MapSettings.prototype.vertical = function(opt_value) {
  if (!this.verticalGrid_) {
    this.verticalGrid_ = new anychart.core.grids.Map();
    this.verticalGrid_.layout(anychart.enums.Layout.VERTICAL);
    this.verticalGrid_.listenSignals(this.mapInvalidated_, this.map_);
    this.grids_.push(this.verticalGrid_);
    this.map_.registerDisposable(this.verticalGrid_);
  }

  if (goog.isDef(opt_value)) {
    this.verticalGrid_.setup(opt_value);
    return this;
  }
  return this.verticalGrid_;
};


/**
 * Horizontal gid.
 * @param {(boolean|Object)=} opt_value
 * @return {anychart.core.grids.Map|anychart.core.grids.MapSettings}
 */
anychart.core.grids.MapSettings.prototype.horizontal = function(opt_value) {
  if (!this.horizontalGrid_) {
    this.horizontalGrid_ = new anychart.core.grids.Map();
    this.horizontalGrid_.layout(anychart.enums.Layout.HORIZONTAL);
    this.horizontalGrid_.listenSignals(this.mapInvalidated_, this.map_);
    this.grids_.push(this.horizontalGrid_);
    this.map_.registerDisposable(this.horizontalGrid_);
  }

  if (goog.isDef(opt_value)) {
    this.horizontalGrid_.setup(opt_value);
    return this;
  }
  return this.horizontalGrid_;
};


/**
 * Internal invalidation handler.
 * @param {anychart.SignalEvent} event Event object.
 * @private
 */
anychart.core.grids.MapSettings.prototype.mapInvalidated_ = function(event) {
  this.invalidate(anychart.ConsistencyState.MAP_GRIDS, anychart.Signal.NEEDS_REDRAW);
};


//endregion
//region --- Settings
/**
 *
 * @param {} opt_value
 * @return {anychart.core.grids.MapSettings}
 */
anychart.core.grids.MapSettings.prototype.stroke = function(opt_value) {

};


/**
 *
 * @param {} opt_value
 * @return {anychart.core.grids.MapSettings}
 */
anychart.core.grids.MapSettings.prototype.minorStroke = function(opt_value) {

};


/**
 *
 * @param {number=} opt_value
 * @return {anychart.core.grids.MapSettings}
 */
anychart.core.grids.MapSettings.prototype.precision = function(opt_value) {

};


/**
 *
 * @param {boolean=} opt_value
 * @return {anychart.core.grids.MapSettings}
 */
anychart.core.grids.MapSettings.prototype.drawFirstLine = function(opt_value) {

};


/**
 *
 * @param {boolean=} opt_value
 * @return {anychart.core.grids.MapSettings}
 */
anychart.core.grids.MapSettings.prototype.drawLastLine = function(opt_value) {

};


/**
 *
 * @param {} opt_value
 * @return {anychart.core.grids.MapSettings}
 */
anychart.core.grids.MapSettings.prototype.oddFill = function(opt_value) {

};


/**
 *
 * @param {} opt_value
 * @return {anychart.core.grids.MapSettings}
 */
anychart.core.grids.MapSettings.prototype.evenFill = function(opt_value) {

};


//endregion
//region --- Exports
//exports
anychart.core.grids.MapSettings.prototype['horizontal'] = anychart.core.grids.MapSettings.prototype.horizontal;
anychart.core.grids.MapSettings.prototype['vertical'] = anychart.core.grids.MapSettings.prototype.vertical;
// anychart.core.axes.MapSettings.prototype['enabled'] = anychart.core.axes.MapSettings.prototype.enabled;
// anychart.core.axes.MapSettings.prototype['title'] = anychart.core.axes.MapSettings.prototype.title;
// anychart.core.axes.MapSettings.prototype['stroke'] = anychart.core.axes.MapSettings.prototype.stroke;
// anychart.core.axes.MapSettings.prototype['ticks'] = anychart.core.axes.MapSettings.prototype.ticks;
// anychart.core.axes.MapSettings.prototype['minorTicks'] = anychart.core.axes.MapSettings.prototype.minorTicks;
// anychart.core.axes.MapSettings.prototype['labels'] = anychart.core.axes.MapSettings.prototype.labels;
// anychart.core.axes.MapSettings.prototype['minorLabels'] = anychart.core.axes.MapSettings.prototype.minorLabels;
//endregion




