goog.provide('anychart.chartEditor2Module.controls.FieldSelect');

goog.require('goog.ui.Component');
goog.require('anychart.chartEditor2Module.controls.Select');


/**
 * @param name {String}
 * @param opt_domHelper
 * @constructor
 * @extends {goog.ui.Container}
 */
anychart.chartEditor2Module.controls.FieldSelect = function(name, opt_domHelper) {
  anychart.chartEditor2Module.controls.FieldSelect.base(this, 'constructor', opt_domHelper);

  this.name_ = name;
};
goog.inherits(anychart.chartEditor2Module.controls.FieldSelect, goog.ui.Component);



anychart.chartEditor2Module.controls.FieldSelect.prototype.createDom = function() {
  goog.base(this, 'createDom');

  var dom = this.getDomHelper();
  var element = this.getElement();

  goog.dom.classlist.add(this.getElement(), 'field-select');

  element.appendChild(dom.createDom(goog.dom.TagName.LABEL, 'label', this.name_));

  this.select_ = new anychart.chartEditor2Module.controls.Select();
  this.addChild(this.select_, true);
};


anychart.chartEditor2Module.controls.FieldSelect.prototype.getItemCount = function() {
  return this.select_.getItemCount();
};


anychart.chartEditor2Module.controls.FieldSelect.prototype.removeItemAt = function(index) {
  return this.select_.removeItemAt(index);
};


/**
 * @param item {goog.ui.MenuItem|anychart.chartEditor2Module.controls.MenuItemWithTwoValues}
 */
anychart.chartEditor2Module.controls.FieldSelect.prototype.addItem = function(item) {
  return this.select_.addItem(item);
};


anychart.chartEditor2Module.controls.FieldSelect.prototype.setSelectedIndex = function(index) {
  return this.select_.setSelectedIndex(index);
};


anychart.chartEditor2Module.controls.FieldSelect.prototype.getValue = function() {
  return this.select_.getValue();
};


anychart.chartEditor2Module.controls.FieldSelect.prototype.getValue2 = function() {
  var selectedItem = this.select_.getSelectedItem();
  return selectedItem ? selectedItem.getValue2() : null;
};
