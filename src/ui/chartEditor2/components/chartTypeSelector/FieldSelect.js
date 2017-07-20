goog.provide('anychart.ui.chartEditor2.FieldSelect');

goog.require('goog.ui.Component');
goog.require('goog.ui.Select');



/**
 * @constructor
 * @extends {goog.ui.Container}
 */
anychart.ui.chartEditor2.FieldSelect = function(name, opt_items, opt_domHelper) {
  anychart.ui.chartEditor2.FieldSelect.base(this, 'constructor', opt_domHelper);

  this.name_ = name;

  if (goog.isDef(opt_items))
    this.items_ = items;
};
goog.inherits(anychart.ui.chartEditor2.FieldSelect, goog.ui.Component);


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


anychart.ui.chartEditor2.FieldSelect.prototype.addItem = function(item) {
  return this.select_.addItem(item);
};


anychart.ui.chartEditor2.FieldSelect.prototype.setSelectedIndex = function(index) {
  return this.select_.setSelectedIndex(index);
};
