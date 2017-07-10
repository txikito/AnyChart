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

  var removeButton = dom.createDom(goog.dom.TagName.A, {'class': 'anychart-button anychart-button-danger remove'}, 'Remove');
  removeButton.setAttribute('data-set-id', itemJson['id']);
  this.getHandler().listen(removeButton, goog.events.EventType.CLICK, this.onRemoveClick);

  var item = dom.createDom(
      goog.dom.TagName.DIV, 'data-set',
      dom.createDom(goog.dom.TagName.DIV, 'content',
          dom.createDom(goog.dom.TagName.IMG, {'src': imgUrl}),
          dom.createDom(goog.dom.TagName.DIV, 'title', itemJson['name']),
          dom.createDom(goog.dom.TagName.DIV, 'buttons', downloadButton, removeButton)));
  
  return item;
};


anychart.ui.chartEditor2.GeoDataSelector.prototype.getDataSetUrl = function(fileName) {
  return this.baseUrl + fileName;
};


anychart.ui.chartEditor2.GeoDataSelector.prototype.onLoadData = function(json, setId) {
  // anychart.ui.chartEditor2.GeoDataSelector.base(this, 'onLoadData', json, setId);
  this.dispatchEvent({
    type: anychart.ui.chartEditor2.events.EventType.ADD_DATA,
    data: json,
    setId: setId,
    isGeo: true
  });
};


anychart.ui.chartEditor2.GeoDataSelector.prototype.onRemoveData = function(setId) {
  //anychart.ui.chartEditor2.PredefinedDataSelector.base(this, 'onRemoveData');
  this.dispatchEvent({
    type: anychart.ui.chartEditor2.events.EventType.REMOVE_DATA,
    setId: setId,
    isGeo: true
  });
};