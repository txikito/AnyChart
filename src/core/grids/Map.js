//region --- Requiring and Providing
goog.provide('anychart.core.grids.Map');
//endregion



/**
 * Map axes settings.
 * @param {!anychart.charts.Map} map .
 * @constructor
 */
anychart.core.grids.Map = function(map) {
  /**
   * Map.
   * @private
   * @type {anychart.charts.Map}
   */
  this.map_ = map;

  /**
   * All axes.
   * @private
   * @type {Array.<anychart.core.grids.Map>}
   */
  this.grids_ = [];
};
goog.inherits(anychart.core.grids.Map, anychart.core.VisualBase);


//region --- Settings
/**
 *
 * @param {} opt_value
 * @return {anychart.core.grids.Map}
 */
anychart.core.grids.Map.prototype.stroke = function(opt_value) {

};


/**
 *
 * @param {} opt_value
 * @return {anychart.core.grids.Map}
 */
anychart.core.grids.Map.prototype.minorStroke = function(opt_value) {

};


/**
 *
 * @param {number=} opt_value
 * @return {anychart.core.grids.Map}
 */
anychart.core.grids.Map.prototype.precision = function(opt_value) {

};


/**
 *
 * @param {boolean=} opt_value
 * @return {anychart.core.grids.Map}
 */
anychart.core.grids.Map.prototype.drawFirstLine = function(opt_value) {

};


/**
 *
 * @param {boolean=} opt_value
 * @return {anychart.core.grids.Map}
 */
anychart.core.grids.Map.prototype.drawLastLine = function(opt_value) {

};


/**
 *
 * @param {} opt_value
 * @return {anychart.core.grids.Map}
 */
anychart.core.grids.Map.prototype.oddFill = function(opt_value) {

};


/**
 *
 * @param {} opt_value
 * @return {anychart.core.grids.Map}
 */
anychart.core.grids.Map.prototype.evenFill = function(opt_value) {

};


//endregion