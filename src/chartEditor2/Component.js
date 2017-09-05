goog.provide('anychart.chartEditor2Module.Component');

goog.require('anychart.ui.Component');



/**
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper; see {@link goog.ui.Component} for semantics.
 * @constructor
 * @extends {anychart.ui.Component}
 */
anychart.chartEditor2Module.Component = function(opt_domHelper) {
  anychart.chartEditor2Module.Component.base(this, 'constructor', opt_domHelper);

  /**
   * 
   * @type {anychart.chartEditor2Module.EditorModel.Key}
   * @protected
   */
  this.key = [];

  /**
   * @type {boolean}
   * @private
   */
  this.hidden_ = false;
};
goog.inherits(anychart.chartEditor2Module.Component, anychart.ui.Component);


/**
 * Getter for model key.
 *
 * @param {(string|Array)=} opt_completion
 * @return {anychart.chartEditor2Module.EditorModel.Key}
 */
anychart.chartEditor2Module.Component.prototype.getKey = function(opt_completion) {
  return goog.isDef(opt_completion) ? goog.array.concat(this.key, opt_completion) : this.key;
};


/**
 * Shows component by assigning 'hidden' class.
 */
anychart.chartEditor2Module.Component.prototype.hide = function() {
  goog.dom.classlist.enable(this.getElement(), 'hidden', true);
  this.hidden_ = true;
};


/**
 * Shows component by removing 'hidden' class.
 */
anychart.chartEditor2Module.Component.prototype.show = function() {
  goog.dom.classlist.enable(this.getElement(), 'hidden', false);
  this.hidden_ = false;
};


/**
 * Getter for hidden state.
 * @return {boolean}
 */
anychart.chartEditor2Module.Component.prototype.isHidden = function() {
  return this.hidden_;
};


/**
 * Updates component on model change.
 */
anychart.chartEditor2Module.Component.prototype.update = function() {

};
