//region --- Requiring and Providing
goog.provide('anychart.core.axes.MapTicks');
//endregion



/**
 * @constructor
 * @extends {anychart.core.axes.Ticks}
 */
anychart.core.axes.MapTicks = function() {
  anychart.core.axes.MapTicks.base(this, 'constructor');
};
goog.inherits(anychart.core.axes.MapTicks, anychart.core.axes.Ticks);


//region --- Setup and Dispose
/** @inheritDoc */
anychart.core.axes.MapTicks.prototype.setupByJSON = function(config) {
  anychart.core.axes.MapTicks.base(this, 'setupByJSON', config);
};


/** @inheritDoc */
anychart.core.axes.MapTicks.prototype.serialize = function() {
  var json = anychart.core.axes.MapTicks.base(this, 'serialize');
};


/** @inheritDoc */
anychart.core.axes.MapTicks.prototype.disposeInternal = function() {
  anychart.core.axes.MapTicks.base(this, 'disposeInternal');
};


//endregion
//region --- Exports

//exports
//endregion
