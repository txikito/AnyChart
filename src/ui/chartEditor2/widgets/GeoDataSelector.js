goog.provide('anychart.ui.chartEditor2.GeoDataSelector');

goog.require('anychart.ui.chartEditor2.DataSelectorBase');
goog.require('anychart.ui.Component');



/**
 * @constructor
 * @extends {anychart.ui.chartEditor2.DataSelectorBase}
 */
anychart.ui.chartEditor2.GeoDataSelector = function() {
  anychart.ui.chartEditor2.GeoDataSelector.base(this, 'constructor');

  this.indexJsonUrl = 'https://cdn.anychart.com/anydata/geo/index.json';

  this.title = 'Choose geo data';

  this.className = 'geo-data-selector';
};
goog.inherits(anychart.ui.chartEditor2.GeoDataSelector, anychart.ui.chartEditor2.DataSelectorBase);


anychart.ui.chartEditor2.GeoDataSelector.prototype.createItem = function(itemJson) {
  var basePath = 'https://cdn.anychart.com/geodata/1.2.0';
  var imgUrl = basePath + itemJson['logo'];
  var dom = this.getDomHelper();
  var item = dom.createDom(
      goog.dom.TagName.DIV, 'data-set',
      dom.createDom(goog.dom.TagName.DIV, 'content',
          dom.createDom(goog.dom.TagName.IMG, {'src': imgUrl}),
          dom.createDom(goog.dom.TagName.DIV, 'title', itemJson['name'])));

  item.setAttribute('data-set-id', itemJson['id']);
  
  return item;
};
