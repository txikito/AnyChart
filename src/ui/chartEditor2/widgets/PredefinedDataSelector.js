goog.provide('anychart.ui.chartEditor2.PredefinedDataSelector');

goog.require('anychart.ui.chartEditor2.DataSelectorBase');
goog.require('anychart.ui.Component');



/**
 * @constructor
 * @extends {anychart.ui.chartEditor2.DataSelectorBase}
 */
anychart.ui.chartEditor2.PredefinedDataSelector = function() {
  anychart.ui.chartEditor2.PredefinedDataSelector.base(this, 'constructor');

  this.indexJsonUrl = 'https://cdn.anychart.com/anydata/common/index.json';

  this.title = 'Use one of our data sets';

  this.className = 'predefined-data-selector';
};
goog.inherits(anychart.ui.chartEditor2.PredefinedDataSelector, anychart.ui.chartEditor2.DataSelectorBase);


anychart.ui.chartEditor2.PredefinedDataSelector.prototype.createItem = function(itemJson) {
  var imgUrl = itemJson['logo'].replace('./', 'https://cdn.anychart.com/anydata/common/');
  var dom = this.getDomHelper();
  var item = dom.createDom(
      goog.dom.TagName.DIV, 'data-set',
      dom.createDom(goog.dom.TagName.DIV, 'content',
          dom.createDom(goog.dom.TagName.IMG, {'src': imgUrl}),
          dom.createDom(goog.dom.TagName.DIV, 'title', itemJson['name']),
          dom.createTextNode(itemJson['description']),
          dom.createDom(goog.dom.TagName.DIV, 'buttons',
              dom.createDom(goog.dom.TagName.A,
                  {
                    // 'href': itemJson['download'],
                    'class': 'anychart-button anychart-button-success download'
                  },
                  'Download'),
              dom.createDom(goog.dom.TagName.A,
                  {
                    'href': itemJson['sample'],
                    'class': 'anychart-button anychart-button-primary sample',
                    'target': 'blank_'
                  },
                  'View sample'))));

  item.setAttribute('data-set-id', itemJson['id']);
  
  return item;
};
