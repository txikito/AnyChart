goog.provide('anychart.ui.chartEditor2.select.ChartType');

goog.require('goog.ui.Select');



/**
 * @constructor
 * @extends {goog.ui.Select}
 */
anychart.ui.chartEditor2.select.ChartType = function(opt_caption, opt_menu, opt_renderer, opt_domHelper, opt_menuRenderer) {
  anychart.ui.chartEditor2.select.ChartType.base(this, 'constructor', opt_caption, opt_menu, opt_renderer, opt_domHelper, opt_menuRenderer);
  this.options_ = [];
};
goog.inherits(anychart.ui.chartEditor2.select.ChartType, goog.ui.Select);


anychart.ui.chartEditor2.select.ChartType.prototype.createDom = function() {
  for(var i = 0; i < this.options_.length; i++) {
    var item = new goog.ui.MenuItem(this.options_[i]['name']);
    item.setModel(this.options_[i]['value']);
    this.addItem(item);
  }
  this.setSelectedIndex(0);

  anychart.ui.chartEditor2.select.ChartType.base(this, 'createDom');

};


anychart.ui.chartEditor2.select.ChartType.prototype.setOptions = function(options) {
  this.options_ = options;
};


anychart.ui.chartEditor2.select.ChartType.prototype.getIcon = function() {
  var i = this.getSelectedIndex() >= 0 ? this.getSelectedIndex() : 0;
  return 'http://www.anychart.com/_design/img/upload/charts/types/' + this.options_[i]['icon'];
};