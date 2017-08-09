goog.provide('anychart.chartEditor2Module.GeoDataSelector');

goog.require('anychart.chartEditor2Module.DataSelectorBase');



/**
 * @constructor
 * @extends {anychart.chartEditor2Module.DataSelectorBase}
 */
anychart.chartEditor2Module.GeoDataSelector = function(dataModel) {
  anychart.chartEditor2Module.GeoDataSelector.base(this, 'constructor', dataModel);

  this.jsonUrl = 'https://cdn.anychart.com/anydata/geo/';

  this.baseUrl = 'https://cdn.anychart.com/geodata/1.2.0';

  this.title = 'Choose geo data';

  this.className = 'geo-data-selector';

  this.dataType = anychart.chartEditor2Module.EditorModel.dataType.GEO;
};
goog.inherits(anychart.chartEditor2Module.GeoDataSelector, anychart.chartEditor2Module.DataSelectorBase);


anychart.chartEditor2Module.GeoDataSelector.prototype.createItem = function(itemJson, state) {
  var imgUrl = this.baseUrl + itemJson['logo'];
  var dom = this.getDomHelper();

  var downloadButton = dom.createDom(goog.dom.TagName.A, {'class': 'anychart-button anychart-button-success download'}, 'Download');
  downloadButton.setAttribute('data-set-id', itemJson['id']);

  var removeButton = dom.createDom(goog.dom.TagName.A, {'class': 'anychart-button anychart-button-danger remove'}, 'Remove');
  removeButton.setAttribute('data-set-id', itemJson['id']);

  var item = dom.createDom(
      goog.dom.TagName.DIV, 'data-set data-set-' + itemJson['id'],
      dom.createDom(goog.dom.TagName.DIV, 'content',
          dom.createDom(goog.dom.TagName.IMG, {'src': imgUrl}),
          dom.createDom(goog.dom.TagName.DIV, 'title', itemJson['name']),
          dom.createDom(goog.dom.TagName.DIV, 'buttons', downloadButton, removeButton)));

  if (state == anychart.chartEditor2Module.DataSelectorBase.DatasetState.LOADED) {
    goog.dom.classlist.add(item, 'loaded');
  }

  return item;
};


anychart.chartEditor2Module.GeoDataSelector.prototype.getDataSetUrl = function(fileName) {
  return this.baseUrl + fileName;
};


anychart.chartEditor2Module.GeoDataSelector.prototype.onLoadData = function(json, setId, opt_name) {
  this.dispatchEvent({
    type: anychart.chartEditor2Module.events.EventType.DATA_ADD,
    data: json,
    dataType: this.dataType,
    setId: setId,
    setFullId: this.dataType + setId,
    title: opt_name
  });
};
