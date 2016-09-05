goog.provide('anychart.core.utils.MapAxisLabelsContextProvider');
goog.require('anychart.core.utils.BaseContextProvider');
goog.require('anychart.enums');



/**
 * Axis context provider.
 * @param {anychart.core.axes.Map} axis Axis.
 * @param {number} index Label index.
 * @param {string|number} value Label value.
 * @extends {anychart.core.utils.BaseContextProvider}
 * @constructor
 */
anychart.core.utils.MapAxisLabelsContextProvider = function(axis, index, value) {
  anychart.core.utils.MapAxisLabelsContextProvider.base(this, 'constructor');
  this['axis'] = axis;
  var scale = axis.scale();

  var labelText, labelValue;
  if (scale instanceof anychart.scales.Geo) {
    labelText = parseFloat(value);
    labelValue = parseFloat(value);
  }
  this['index'] = index;
  this['value'] = labelText;
  this['tickValue'] = labelValue;
  this['max'] = goog.isDef(scale.max) ? scale.max : null;
  this['min'] = goog.isDef(scale.min) ? scale.min : null;
  this['scale'] = scale;
  //TODO as soon as it is possible:
  //sum -- the sum data values from series bound to this axis (depends on orientation)
  //average -- the sum divided by the number of points
  //median -- axis median
  //mode -- axis mode
};
goog.inherits(anychart.core.utils.MapAxisLabelsContextProvider, anychart.core.utils.BaseContextProvider);


/** @inheritDoc */
anychart.core.utils.MapAxisLabelsContextProvider.prototype.getTokenValue = function(name) {
  switch (name) {
    case anychart.enums.StringToken.AXIS_NAME:
      return this['axis'].title().text();
    case anychart.enums.StringToken.AXIS_SCALE_MAX:
      return this['max'];
    case anychart.enums.StringToken.AXIS_SCALE_MIN:
      return this['min'];
  }
  return anychart.core.utils.MapAxisLabelsContextProvider.base(this, 'getTokenValue', name);
};


/** @inheritDoc */
anychart.core.utils.MapAxisLabelsContextProvider.prototype.getTokenType = function(name) {
  switch (name) {
    case anychart.enums.StringToken.AXIS_SCALE_MAX:
    case anychart.enums.StringToken.AXIS_SCALE_MIN:
    case anychart.enums.StringToken.INDEX:
      return anychart.enums.TokenType.NUMBER;
    case anychart.enums.StringToken.VALUE:
      return anychart.enums.TokenType.STRING;
  }
  return anychart.core.utils.MapAxisLabelsContextProvider.base(this, 'getTokenType', name);
};


/**
 * Dummy.
 * @return {undefined}
 */
anychart.core.utils.MapAxisLabelsContextProvider.prototype.getDataValue = function() {
  return undefined;
};


//exports
anychart.core.utils.MapAxisLabelsContextProvider.prototype['getTokenValue'] = anychart.core.utils.MapAxisLabelsContextProvider.prototype.getTokenValue;
anychart.core.utils.MapAxisLabelsContextProvider.prototype['getTokenType'] = anychart.core.utils.MapAxisLabelsContextProvider.prototype.getTokenType;
