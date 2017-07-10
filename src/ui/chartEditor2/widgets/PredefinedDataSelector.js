goog.provide('anychart.ui.chartEditor2.PredefinedDataSelector');

goog.require('anychart.ui.chartEditor2.DataSelectorBase');
goog.require('anychart.ui.Component');



/**
 * @constructor
 * @extends {anychart.ui.chartEditor2.DataSelectorBase}
 */
anychart.ui.chartEditor2.PredefinedDataSelector = function() {
  anychart.ui.chartEditor2.PredefinedDataSelector.base(this, 'constructor');

  this.jsonUrl = 'https://cdn.anychart.com/anydata/common/';

  this.title = 'Use one of our data sets';

  this.className = 'predefined-data-selector';
};
goog.inherits(anychart.ui.chartEditor2.PredefinedDataSelector, anychart.ui.chartEditor2.DataSelectorBase);


anychart.ui.chartEditor2.PredefinedDataSelector.prototype.createItem = function(itemJson) {
  var imgUrl = itemJson['logo'].replace('./', 'https://cdn.anychart.com/anydata/common/');
  var dom = this.getDomHelper();

  var downloadButton = dom.createDom(goog.dom.TagName.A, {'class': 'anychart-button anychart-button-success download'}, 'Download');
  downloadButton.setAttribute('data-set-id', itemJson['id']);
  this.getHandler().listen(downloadButton, goog.events.EventType.CLICK, this.onDownloadClick_);

  var item = dom.createDom(
      goog.dom.TagName.DIV, 'data-set',
      dom.createDom(goog.dom.TagName.DIV, 'content',
          dom.createDom(goog.dom.TagName.IMG, {'src': imgUrl}),
          dom.createDom(goog.dom.TagName.DIV, 'title', itemJson['name']),
          // dom.createTextNode(itemJson['description']),
          dom.createDom(goog.dom.TagName.DIV, 'buttons',
              downloadButton,
              dom.createDom(goog.dom.TagName.A,
                  {
                    'href': itemJson['sample'],
                    'class': 'anychart-button anychart-button-primary sample',
                    'target': 'blank_'
                  },
                  'View sample'))));
      // dom.createDom(goog.dom.TagName.DIV, 'overlay', dom.createDom(goog.dom.TagName.DIV, 'wait')));
  
  return item;
};


anychart.ui.chartEditor2.PredefinedDataSelector.prototype.onDownloadClick_ = function(evt) {
  var datasetId = evt.currentTarget.getAttribute('data-set-id');
  if (datasetId && this.dataIndex[datasetId]['state'] != anychart.ui.chartEditor2.DataSelectorBase.DatasetState.PROCESSING) {
    console.log("process " + datasetId);
    this.dataIndex[datasetId]['state'] = anychart.ui.chartEditor2.DataSelectorBase.DatasetState.PROCESSING;
    var datasetEl = goog.dom.getAncestorByClass(evt.currentTarget, 'data-set');
    // goog.dom.classlist.add(datasetEl, 'processing');

    var preloader = this.preloaders[datasetId];
    if (!preloader) {
      console.log("create loader for " + datasetId);
      preloader = this.preloaders[datasetId] = new anychart.ui.Preloader();
    }
    preloader.render(datasetEl);
    preloader.visible(true);

    var datasetUrl = this.dataIndex[datasetId]['data'].replace('./', this.jsonUrl);
    console.log(datasetUrl);
    var self = this;
    // goog.net.XhrIo.send(this.jsonUrl,
    //     function(e) {
    //       var xhr = e.target;
    //       var indexJson = xhr.getResponseJson();
    //       if (indexJson['sets']) {
    //         for (var i in indexJson['sets']) {
    //           self.dataIndex[indexJson['sets'][i]['id']] = indexJson['sets'][i];
    //         }
    //       }
    //       self.showDataSets_();
    //     });

    /**
     * todo:
     * 3. послать запрос
     * 4. колбэк и перерисовка датасетов
     */

  }
};