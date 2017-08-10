goog.provide('anychart.chartEditor2Module.controls.MenuItemWithTwoValues');

goog.require('goog.ui.Container');



/**
 * @constructor
 * @extends {goog.ui.Container}
 */
anychart.chartEditor2Module.controls.MenuItemWithTwoValues = function(caption, value, value2, opt_domHelper, opt_renderer) {
  goog.ui.MenuItem.call(
      this, caption, value, opt_domHelper, opt_renderer || goog.ui.MenuItemRenderer.getInstance());

  this.setValue2(value2);
};
goog.inherits(anychart.chartEditor2Module.controls.MenuItemWithTwoValues, goog.ui.MenuItem);


anychart.chartEditor2Module.controls.MenuItemWithTwoValues.prototype.setValue2 = function(value) {
  this.value2_ = value;
};


anychart.chartEditor2Module.controls.MenuItemWithTwoValues.prototype.getValue2 = function() {
  return this.value2_;
};