goog.provide('anychart.ui.chartEditor2.GeoDataSelector');

goog.require('anychart.ui.chartEditor2.DataSelectorBase');
goog.require('anychart.ui.Component');



/**
 * @constructor
 * @extends {anychart.ui.chartEditor2.DataSelectorBase}
 */
anychart.ui.chartEditor2.GeoDataSelector = function() {
  anychart.ui.chartEditor2.GeoDataSelector.base(this, 'constructor');

  this.jsonUrl = 'https://cdn.anychart.com/anydata/geo/';

  this.baseUrl = 'https://cdn.anychart.com/geodata/1.2.0';

  this.title = 'Choose geo data';

  this.className = 'geo-data-selector';
};
goog.inherits(anychart.ui.chartEditor2.GeoDataSelector, anychart.ui.chartEditor2.DataSelectorBase);


anychart.ui.chartEditor2.GeoDataSelector.prototype.createItem = function(itemJson) {
  var imgUrl = this.baseUrl + itemJson['logo'];
  var dom = this.getDomHelper();

  var downloadButton = dom.createDom(goog.dom.TagName.A, {'class': 'anychart-button anychart-button-success download'}, 'Download');
  downloadButton.setAttribute('data-set-id', itemJson['id']);
  this.getHandler().listen(downloadButton, goog.events.EventType.CLICK, this.onDownloadClick);

  var item = dom.createDom(
      goog.dom.TagName.DIV, 'data-set',
      dom.createDom(goog.dom.TagName.DIV, 'content',
          dom.createDom(goog.dom.TagName.IMG, {'src': imgUrl}),
          dom.createDom(goog.dom.TagName.DIV, 'title', itemJson['name']),
          dom.createDom(goog.dom.TagName.DIV, 'buttons', downloadButton)));
  
  return item;
};


anychart.ui.chartEditor2.GeoDataSelector.prototype.getDataSetUrl = function(fileName) {
  return this.baseUrl + fileName;
};


anychart.ui.chartEditor2.GeoDataSelector.prototype.onLoadDataSetJson = function(json) {
  this.dispatchEvent({
    type: anychart.ui.chartEditor2.events.EventType.ADD_GEO_DATA,
    json: json
  });
};