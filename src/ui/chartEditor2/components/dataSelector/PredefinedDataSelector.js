goog.provide('anychart.ui.chartEditor2.PredefinedDataSelector');

goog.require('anychart.ui.Component');
goog.require('anychart.ui.chartEditor2.DataSelectorBase');



/**
 * @constructor
 * @extends {anychart.ui.chartEditor2.DataSelectorBase}
 */
anychart.ui.chartEditor2.PredefinedDataSelector = function(dataModel) {
  anychart.ui.chartEditor2.PredefinedDataSelector.base(this, 'constructor', dataModel);

  this.jsonUrl = 'https://cdn.anychart.com/anydata/common/';

  this.title = 'Use one of our data sets';

  this.className = 'predefined-data-selector';

  this.dataType = anychart.ui.chartEditor2.DataModel.dataType.PREDEFINED;
};
goog.inherits(anychart.ui.chartEditor2.PredefinedDataSelector, anychart.ui.chartEditor2.DataSelectorBase);


anychart.ui.chartEditor2.PredefinedDataSelector.prototype.createItem = function(itemJson, state) {
  var imgUrl = itemJson['logo'].replace('./', 'https://cdn.anychart.com/anydata/common/');
  var dom = this.getDomHelper();

  var downloadButton = dom.createDom(goog.dom.TagName.A, {'class': 'anychart-button anychart-button-success download'}, 'Download');
  downloadButton.setAttribute('data-set-id', itemJson['id']);

  var removeButton = dom.createDom(goog.dom.TagName.A, {'class': 'anychart-button anychart-button-danger remove'}, 'Remove');
  removeButton.setAttribute('data-set-id', itemJson['id']);

  return dom.createDom(
      goog.dom.TagName.DIV, 'data-set data-set-' + itemJson['id'],
      dom.createDom(goog.dom.TagName.DIV, 'content',
          dom.createDom(goog.dom.TagName.IMG, {'src': imgUrl}),
          dom.createDom(goog.dom.TagName.DIV, 'title', itemJson['name']),
          // dom.createTextNode(itemJson['description']),
          dom.createDom(goog.dom.TagName.DIV, 'buttons',
              downloadButton,
              removeButton,
              dom.createDom(goog.dom.TagName.A,
                  {
                    'href': itemJson['sample'],
                    'class': 'anychart-button anychart-button-primary sample',
                    'target': 'blank_'
                  },
                  'View sample'))));
};


anychart.ui.chartEditor2.PredefinedDataSelector.prototype.getDataSetUrl = function(fileName) {
  return fileName.replace('./', this.jsonUrl);
};


anychart.ui.chartEditor2.PredefinedDataSelector.prototype.onLoadData = function(json, setId) {
  if (json['data']) {
    this.dispatchEvent({
      type: anychart.ui.chartEditor2.events.EventType.DATA_ADD,
      data: json['data'],
      setId: setId,
      dataType: this.dataType
    });
  }
};
