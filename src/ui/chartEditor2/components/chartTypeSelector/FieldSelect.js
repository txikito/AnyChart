goog.provide('anychart.ui.chartEditor2.FieldSelect');

goog.require('goog.ui.Component');
goog.require('goog.ui.Select');


/**
 * @param name {String}
 * @param opt_role {anychart.ui.chartEditor2.FieldSelect.Role=}
 * @param opt_domHelper
 * @constructor
 * @extends {goog.ui.Container}
 */
anychart.ui.chartEditor2.FieldSelect = function(name, opt_role, opt_domHelper) {
  anychart.ui.chartEditor2.FieldSelect.base(this, 'constructor', opt_domHelper);

  this.name_ = name;

  /**
   * @type {anychart.ui.chartEditor2.FieldSelect.Role}
   * @public
   */
  this.role = goog.isDef(opt_role) ? opt_role : anychart.ui.chartEditor2.FieldSelect.Role.SIMPLE;
};
goog.inherits(anychart.ui.chartEditor2.FieldSelect, goog.ui.Component);


/** @enum {number} */
anychart.ui.chartEditor2.FieldSelect.Role = {
  SIMPLE: 0,
  DATA_FIELD: 1
};


anychart.ui.chartEditor2.FieldSelect.prototype.createDom = function() {
  goog.base(this, 'createDom');

  var dom = this.getDomHelper();
  var element = this.getElement();

  goog.dom.classlist.add(this.getElement(), 'field-select');

  element.appendChild(dom.createDom(goog.dom.TagName.LABEL, 'label', this.name_));

  this.select_ = new goog.ui.Select();
  this.addChild(this.select_, true);
};


anychart.ui.chartEditor2.FieldSelect.prototype.getItemCount = function() {
  return this.select_.getItemCount();
};


anychart.ui.chartEditor2.FieldSelect.prototype.removeItemAt = function(index) {
  return this.select_.removeItemAt(index);
};


/**
 * @param item {anychart.ui.chartEditor2.MenuItemWithTwoValues}
 */
anychart.ui.chartEditor2.FieldSelect.prototype.addItem = function(item) {
  return this.select_.addItem(item);
};


anychart.ui.chartEditor2.FieldSelect.prototype.setSelectedIndex = function(index) {
  return this.select_.setSelectedIndex(index);
};


anychart.ui.chartEditor2.FieldSelect.prototype.getValue = function() {
  return this.select_.getValue();
};


anychart.ui.chartEditor2.FieldSelect.prototype.getValue2 = function() {
  var selectedItem = this.select_.getSelectedItem();
  return selectedItem ? selectedItem.getValue2() : null;
};
