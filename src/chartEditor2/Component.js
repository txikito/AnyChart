goog.provide('anychart.chartEditor2Module.Component');

goog.require('goog.ui.Component');



anychart.chartEditor2Module.Component = function(opt_domHelper) {
  anychart.chartEditor2Module.Component.base(this, 'constructor', opt_domHelper);

  this.key_ = [];

  this.hidden_ = false;
};
goog.inherits(anychart.chartEditor2Module.Component, goog.ui.Component);



/**
 * @param {(String|Array)=} opt_completion
 * @return {!Array.<*>|*}
 */
anychart.chartEditor2Module.Component.prototype.getKey = function(opt_completion) {
  return goog.isDef(opt_completion) ? goog.array.concat(this.key_, opt_completion) : this.key_;
};


anychart.chartEditor2Module.Component.prototype.hide = function() {
  goog.dom.classlist.enable(this.getElement(), 'hidden', true);
  this.hidden_ = true;
};


anychart.chartEditor2Module.Component.prototype.show = function() {
  goog.dom.classlist.enable(this.getElement(), 'hidden', false);
  this.hidden_ = false;
};


anychart.chartEditor2Module.Component.prototype.isHidden = function() {
  return this.hidden_;
};