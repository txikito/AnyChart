goog.provide('anychart.chartEditor2Module.controls.ChartTypeSelect');

goog.require('anychart.chartEditor2Module.controls.MenuItemWithTwoValues');
goog.require('anychart.chartEditor2Module.controls.Select');



/**
 * @constructor
 * @extends {goog.ui.Select}
 */
anychart.chartEditor2Module.controls.ChartTypeSelect = function(opt_caption, opt_menu, opt_renderer, opt_domHelper, opt_menuRenderer) {
  anychart.chartEditor2Module.controls.ChartTypeSelect.base(this, 'constructor', opt_caption, opt_menu, opt_renderer, opt_domHelper, opt_menuRenderer);

  this.options_ = [];
};
goog.inherits(anychart.chartEditor2Module.controls.ChartTypeSelect, anychart.chartEditor2Module.controls.Select);


anychart.chartEditor2Module.controls.ChartTypeSelect.prototype.createDom = function() {
  goog.base(this, 'createDom');

  for(var i = 0; i < this.options_.length; i++) {
    var item = new anychart.chartEditor2Module.controls.MenuItemWithTwoValues(this.options_[i]['name'], this.options_[i]['value'], this.options_[i]['stackMode']);
    this.addItem(item);
  }

  goog.dom.classlist.add(this.getElement(), 'type-select');
};


anychart.chartEditor2Module.controls.ChartTypeSelect.prototype.setOptions = function(options) {
  this.options_ = options;
};


anychart.chartEditor2Module.controls.ChartTypeSelect.prototype.getIcon = function() {
  var i = this.getSelectedIndex() >= 0 ? this.getSelectedIndex() : 0;
  return 'http://www.anychart.com/_design/img/upload/charts/types/' + this.options_[i]['icon'];
};


anychart.chartEditor2Module.controls.ChartTypeSelect.prototype.getValue2 = function() {
  var selectedItem = this.getSelectedItem();
  return selectedItem ? selectedItem.getValue2() : null;
};
