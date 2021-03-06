goog.provide('anychart.core.drawers.Line');
goog.require('anychart.core.drawers');
goog.require('anychart.core.drawers.Base');
goog.require('anychart.enums');



/**
 * Line drawer.
 * @param {anychart.core.series.Base} series
 * @constructor
 * @extends {anychart.core.drawers.Base}
 */
anychart.core.drawers.Line = function(series) {
  anychart.core.drawers.Line.base(this, 'constructor', series);
};
goog.inherits(anychart.core.drawers.Line, anychart.core.drawers.Base);
anychart.core.drawers.AvailableDrawers[anychart.enums.SeriesDrawerTypes.LINE] = anychart.core.drawers.Line;


/** @inheritDoc */
anychart.core.drawers.Line.prototype.type = anychart.enums.SeriesDrawerTypes.LINE;


/** @inheritDoc */
anychart.core.drawers.Line.prototype.flags = (
    // anychart.core.drawers.Capabilities.NEEDS_ZERO |
    // anychart.core.drawers.Capabilities.NEEDS_SIZE_SCALE |
    // anychart.core.drawers.Capabilities.USES_CONTAINER_AS_ROOT |
    anychart.core.drawers.Capabilities.USES_STROKE_AS_FILL |
    anychart.core.drawers.Capabilities.SUPPORTS_CONNECTING_MISSING |
    // anychart.core.drawers.Capabilities.SUPPORTS_STACK |
    anychart.core.drawers.Capabilities.SUPPORTS_COMPARISON |
    anychart.core.drawers.Capabilities.SUPPORTS_ERROR |
    // anychart.core.drawers.Capabilities.SUPPORTS_OUTLIERS |
    // anychart.core.drawers.Capabilities.IS_DISCRETE_BASED |
    // anychart.core.drawers.Capabilities.IS_WIDTH_BASED |
    // anychart.core.drawers.Capabilities.IS_3D_BASED |
    // anychart.core.drawers.Capabilities.IS_VERTICAL |
    // anychart.core.drawers.Capabilities.IS_MARKER_BASED |
    // anychart.core.drawers.Capabilities.IS_OHLC_BASED |
    anychart.core.drawers.Capabilities.IS_LINE_BASED |
    // anychart.core.drawers.Capabilities.IS_RANGE_BASED |
    // anychart.core.drawers.Capabilities.SUPPORTS_STEP_DIRECTION |
    // anychart.core.drawers.Capabilities.SUPPORTS_DISTRIBUTION |
    0);


/** @inheritDoc */
anychart.core.drawers.Line.prototype.requiredShapes = (function() {
  var res = {};
  res['stroke'] = anychart.enums.ShapeType.PATH;
  return res;
})();


/** @inheritDoc */
anychart.core.drawers.Line.prototype.startDrawing = function(shapeManager) {
  anychart.core.drawers.Line.base(this, 'startDrawing', shapeManager);

  /**
   * If the line should be closed to its first point.
   * @type {boolean}
   * @protected
   */
  this.closed = !!this.series.getOption('closed');

  /**
   * If the first point is missing (for the closed mode).
   * @type {boolean}
   * @protected
   */
  this.firstPointMissing = false;

  /**
   * First non-missing point X coord (for the closed mode).
   * @type {number}
   * @protected
   */
  this.firstPointX = NaN;

  /**
   * First non-missing point Y coord (for the closed mode).
   * @type {number}
   * @protected
   */
  this.firstPointY = NaN;
};


/** @inheritDoc */
anychart.core.drawers.Line.prototype.drawMissingPoint = function(point, state) {
  if (isNaN(this.firstPointX))
    this.firstPointMissing = true;
};


/** @inheritDoc */
anychart.core.drawers.Line.prototype.drawFirstPoint = function(point, state) {
  var shapes = this.shapesManager.getShapesGroup(this.seriesState);
  var x = /** @type {number} */(point.meta('x'));
  var y = /** @type {number} */(point.meta('value'));
  anychart.core.drawers.move(/** @type {acgraph.vector.Path} */(shapes['stroke']), this.isVertical, x, y);
  if (isNaN(this.firstPointX)) {
    this.firstPointX = x;
    this.firstPointY = y;
  }
};


/** @inheritDoc */
anychart.core.drawers.Line.prototype.drawSubsequentPoint = function(point, state) {
  var shapes = this.shapesManager.getShapesGroup(this.seriesState);
  var x = /** @type {number} */(point.meta('x'));
  var y = /** @type {number} */(point.meta('value'));
  anychart.core.drawers.line(/** @type {acgraph.vector.Path} */(shapes['stroke']), this.isVertical, x, y);
};


/** @inheritDoc */
anychart.core.drawers.Line.prototype.finalizeDrawing = function() {
  this.additionalFinalize();
  anychart.core.drawers.Line.base(this, 'finalizeDrawing');
};


/**
 * Additional finalization.
 * @protected
 */
anychart.core.drawers.Line.prototype.additionalFinalize = function() {
  if (this.closed && !isNaN(this.firstPointX) && (this.connectMissing || this.prevPointDrawn && !this.firstPointMissing)) {
    var shapes = this.shapesManager.getShapesGroup(this.seriesState);
    anychart.core.drawers.line(/** @type {acgraph.vector.Path} */(shapes['stroke']), this.isVertical, this.firstPointX, this.firstPointY);
  }
};
