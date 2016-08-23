//region --- Requiring and Providing
goog.provide('anychart.core.axes.Map');
//endregion



/**
 * @constructor
 * @extends {anychart.core.axes.Linear}
 */
anychart.core.axes.Map = function() {
  anychart.core.axes.Map.base(this, 'constructor');
};
goog.inherits(anychart.core.axes.Map, anychart.core.axes.Linear);


//region --- Setup and Dispose
/** @inheritDoc */
anychart.core.axes.Map.prototype.setupByJSON = function(config) {
  anychart.core.axes.Map.base(this, 'setupByJSON', config);
};


/** @inheritDoc */
anychart.core.axes.Map.prototype.serialize = function() {
  var json = anychart.core.axes.Map.base(this, 'serialize');
};


/** @inheritDoc */
anychart.core.axes.Map.prototype.disposeInternal = function() {
  anychart.core.axes.Map.base(this, 'disposeInternal');
};


//endregion
//region --- Exports

//exports
//endregion
