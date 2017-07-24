goog.provide('anychart.chartEditor2Module.Component');

goog.require('goog.ui.Component');



anychart.chartEditor2Module.Component = function(opt_domHelper) {
  anychart.chartEditor2Module.Component.base(this, 'constructor', opt_domHelper);

  this.key_ = [];
};
goog.inherits(anychart.chartEditor2Module.Component, goog.ui.Component);



/**
 * @param {(String|Array)=} opt_completion
 * @return {!Array.<*>|*}
 */
anychart.chartEditor2Module.Component.prototype.getKey = function(opt_completion) {
  if (goog.isDef(opt_completion))
    this.key_ = goog.array.concat(this.key_, opt_completion);
  return this.key_;
};