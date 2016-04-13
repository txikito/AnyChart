goog.provide('anychart.core.utils.LegendContextProvider');
goog.require('anychart.core.utils.ITokenProvider');
goog.require('anychart.enums');



/**
 * Context provider for legend itemsTextFormatter function
 * @implements {anychart.core.utils.ITokenProvider}
 * @param {(anychart.core.SeriesBase)=} opt_source Source for statistics and meta.
 * @constructor
 */
anychart.core.utils.LegendContextProvider = function(opt_source) {
  this.source_ = opt_source;
};


/**
 * Fetch statistics value by key.
 * @param {string=} opt_key Key.
 * @return {*}
 */
anychart.core.utils.LegendContextProvider.prototype.getStat = function(opt_key) {
  return this.source_.statistics(opt_key);
};


/**
 * Gets meta by key.
 * @param {string=} opt_key Key.
 * @return {*} Meta value by key, or meta object.
 */
anychart.core.utils.LegendContextProvider.prototype.getMeta = function(opt_key) {
  if (this.source_.meta)
    return this.source_.meta(opt_key);
};


/** @inheritDoc */
anychart.core.utils.LegendContextProvider.prototype.getTokenValue = function(name) {
  return undefined;
};


/** @inheritDoc */
anychart.core.utils.LegendContextProvider.prototype.getTokenType = function(name) {
  return anychart.enums.TokenType.UNKNOWN;
};


//exports
anychart.core.utils.LegendContextProvider.prototype['getStat'] = anychart.core.utils.LegendContextProvider.prototype.getStat;
anychart.core.utils.LegendContextProvider.prototype['getMeta'] = anychart.core.utils.LegendContextProvider.prototype.getMeta;
anychart.core.utils.LegendContextProvider.prototype['getTokenType'] = anychart.core.utils.LegendContextProvider.prototype.getTokenType;
anychart.core.utils.LegendContextProvider.prototype['getTokenValue'] = anychart.core.utils.LegendContextProvider.prototype.getTokenValue;
