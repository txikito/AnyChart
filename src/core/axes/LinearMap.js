//region --- Requiring and Providing
goog.provide('anychart.core.axes.LinearMap');
//endregion



/**
 *
 * @constructor
 */
anychart.core.axes.LinearMap = function() {
  anychart.core.axes.LinearMap.base(this, 'constructor');
};
goog.inherits(anychart.core.axes.LinearMap, anychart.core.VisualBase);


//region --- Setup and Dispose
/** @inheritDoc */
anychart.core.axes.LinearMap.prototype.setupByJSON = function(config) {
  anychart.core.axes.LinearMap.base(this, 'setupByJSON', config);
};


/** @inheritDoc */
anychart.core.axes.LinearMap.prototype.serialize = function() {
  var json = anychart.core.axes.LinearMap.base(this, 'serialize');
};


/** @inheritDoc */
anychart.core.axes.LinearMap.prototype.disposeInternal = function() {
  anychart.core.axes.LinearMap.base(this, 'disposeInternal');
};


//endregion
//region --- Exports

//exports
//endregion
