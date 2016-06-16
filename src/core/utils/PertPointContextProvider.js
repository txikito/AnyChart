goog.provide('anychart.core.utils.PertPointContextProvider');

goog.require('anychart.core.utils.BaseContextProvider');
goog.require('anychart.core.utils.IContextProvider');
goog.require('anychart.enums');



/**
 * Pert point context provider.
 * @implements {anychart.core.utils.IContextProvider}
 * @param {anychart.charts.Pert} chart - Pert chart instance.
 * @extends {anychart.core.utils.BaseContextProvider}
 * @constructor
 */
anychart.core.utils.PertPointContextProvider = function(chart) {
  anychart.core.utils.PertPointContextProvider.base(this, 'constructor');

  this.chartInternal = chart;

  /**
   * @type {anychart.data.Tree.DataItem}
   */
  this.currentItem = null;

  /**
   * @type {anychart.charts.Pert.ActivityData|null|undefined}
   */
  this.activityData = null;

};
goog.inherits(anychart.core.utils.PertPointContextProvider, anychart.core.utils.BaseContextProvider);


/** @inheritDoc */
anychart.core.utils.PertPointContextProvider.prototype.applyReferenceValues = function() {
  if (this.currentItem) {
    this['item'] = this.currentItem;

    var pessimistic = this.currentItem.get(anychart.enums.DataField.PESSIMISTIC);
    if (goog.isDef(pessimistic))
      this[anychart.enums.DataField.PESSIMISTIC] = +pessimistic;

    var optimistic = this.currentItem.get(anychart.enums.DataField.OPTIMISTIC);
    if (goog.isDef(optimistic))
      this[anychart.enums.DataField.OPTIMISTIC] = +optimistic;

    var mostLikely = this.currentItem.get(anychart.enums.DataField.MOST_LIKELY);
    if (goog.isDef(mostLikely))
      this[anychart.enums.DataField.MOST_LIKELY] = +mostLikely;

    var duration = this.currentItem.get(anychart.enums.DataField.DURATION);
    if (goog.isDef(duration))
      this[anychart.enums.DataField.DURATION] = +duration;
  }

  if (this.activityData) {
    this['earliestStart'] = this.activityData.earliestStart;
    this['earliestFinish'] = this.activityData.earliestFinish;
    this['latestStart'] = this.activityData.latestStart;
    this['latestFinish'] = this.activityData.latestFinish;
    this[anychart.enums.DataField.DURATION] = this.activityData.duration;
    this['slack'] = this.activityData.slack;
  }
};


/**
 * Gets statistics.
 * @param {string=} opt_key - Key.
 * @return {*}
 */
anychart.core.utils.PertPointContextProvider.prototype.getStat = function(opt_key) {
  if (!opt_key) return void 0;
  if (this.pointInternal && goog.isDef(this.pointInternal.getStat(opt_key))) {
    return this.pointInternal.getStat(opt_key);
  } else if (this.chartInternal && this.chartInternal.getStat(opt_key)) {
    return this.chartInternal.getStat(opt_key);
  } else {
    return this.getDataValue(/** @type {string} */ (opt_key));
  }
};


/**
 * Fetch data value by its key.
 * @param {string} key Key.
 * @return {*}
 */
anychart.core.utils.PertPointContextProvider.prototype.getDataValue = function(key) {
  return this.currentItem ? this.currentItem.get(key) : void 0;
};



//exports
anychart.core.utils.PertPointContextProvider.prototype['getStat'] = anychart.core.utils.PertPointContextProvider.prototype.getStat;
anychart.core.utils.PertPointContextProvider.prototype['getTokenValue'] = anychart.core.utils.PertPointContextProvider.prototype.getTokenValue;
anychart.core.utils.PertPointContextProvider.prototype['getDataValue'] = anychart.core.utils.PertPointContextProvider.prototype.getDataValue;

