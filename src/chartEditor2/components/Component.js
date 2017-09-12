goog.provide('anychart.chartEditor2Module.Component');

goog.require('anychart.ui.Component');



/**
 * Component, that can be hidden.
 *
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper; see {@link goog.ui.Component} for semantics.
 * @constructor
 * @extends {anychart.ui.Component}
 */
anychart.chartEditor2Module.Component = function(opt_domHelper) {
  anychart.chartEditor2Module.Component.base(this, 'constructor', opt_domHelper);

  /**
   * @type {boolean}
   * @private
   */
  this.hidden_ = false;
};
goog.inherits(anychart.chartEditor2Module.Component, anychart.ui.Component);


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
 * @param {Object=} opt_evt
 */
anychart.chartEditor2Module.Component.prototype.update = function(opt_evt) {

};
