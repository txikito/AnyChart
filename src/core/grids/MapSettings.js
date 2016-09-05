//region --- Requiring and Providing
goog.provide('anychart.core.grids.MapSettings');
//endregion



/**
 * Map axes settings.
 * @param {!anychart.charts.Map} map .
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
   * All axes.
   * @private
   * @type {Array.<anychart.core.axes.Map>}
   */
  this.axes_ = [];
};


//region --- Grids
anychart.core.grids.MapSettings.prototype.vertical = function() {

};


anychart.core.grids.MapSettings.prototype.horizontal = function() {

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




