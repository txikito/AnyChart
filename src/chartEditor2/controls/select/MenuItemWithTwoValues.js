goog.provide('anychart.chartEditor2Module.select.MenuItemWithTwoValues');

goog.require('goog.ui.MenuItem');



/**
 * @param {goog.ui.ControlContent} caption Text caption or DOM structure to
 *     display as the content of the item (use to add icons or styling to
 *     menus).
 * @param {*} value First data/model associated with the menu item.
 * @param {*} value2 Second data/model associated with the menu item.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper used for
 *     document interactions.
 * @param {goog.ui.MenuItemRenderer=} opt_renderer Optional renderer.
 *
 * @constructor
 * @extends {goog.ui.MenuItem}
 */
anychart.chartEditor2Module.select.MenuItemWithTwoValues = function(caption, value, value2, opt_domHelper, opt_renderer) {
  goog.ui.MenuItem.call(
      this, caption, value, opt_domHelper, opt_renderer || goog.ui.MenuItemRenderer.getInstance());

  this.setValue2(value2);
};
goog.inherits(anychart.chartEditor2Module.select.MenuItemWithTwoValues, goog.ui.MenuItem);


/**
 * Sets the second value associated with the menu item.  The default implementation
 * stores the value as the model of the menu item.
 * @param {*} value Value to be associated with the menu item.
 */
anychart.chartEditor2Module.select.MenuItemWithTwoValues.prototype.setValue2 = function(value) {
  this.value2_ = value;
};


/**
 * Returns the second value associated with the menu item.  The default implementation
 * returns the model object associated with the item (if any), or its caption.
 * @return {*} Value associated with the menu item, if any, or its caption.
 */
anychart.chartEditor2Module.select.MenuItemWithTwoValues.prototype.getValue2 = function() {
  return this.value2_;
};
