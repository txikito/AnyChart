goog.provide('anychart.ui.chartEditor2.controls.MenuItemWithTwoValues');

goog.require('goog.ui.Container');



/**
 * @constructor
 * @extends {goog.ui.Container}
 */
anychart.ui.chartEditor2.controls.MenuItemWithTwoValues = function(caption, value, value2, opt_domHelper, opt_renderer) {
  goog.ui.MenuItem.call(
      this, caption, opt_renderer || goog.ui.MenuItemRenderer.getInstance(),
      opt_domHelper);
  
  this.setValue(value);
  this.setValue2(value2);
};
goog.inherits(anychart.ui.chartEditor2.controls.MenuItemWithTwoValues, goog.ui.MenuItem);


anychart.ui.chartEditor2.controls.MenuItemWithTwoValues.prototype.setValue2 = function(value) {
  this.value2_ = value;
};


anychart.ui.chartEditor2.controls.MenuItemWithTwoValues.prototype.getValue2 = function() {
  return this.value2_;
};