goog.provide('anychart.ui.chartEditor2.DataSelectorBase');

goog.require('anychart.ui.Component');
goog.require('goog.net.XhrIo');


/**
 * @constructor
 * @extends {anychart.ui.Component}
 */
anychart.ui.chartEditor2.DataSelectorBase = function() {
  anychart.ui.chartEditor2.DataSelectorBase.base(this, 'constructor');

  this.title = '';

  this.className = '';

  this.jsonUrl = '';

  /**
   * @type {Array}
   * @protected
   */
  this.dataIndex = [];

  this.searchFields = ['name', 'tags'];

  this.preloaders = {};
};
goog.inherits(anychart.ui.chartEditor2.DataSelectorBase, anychart.ui.Component);


/** @type {string} */
anychart.ui.chartEditor2.DataSelectorBase.CSS_CLASS = 'data-selector';

/**
 * @enum {string}
 */
anychart.ui.chartEditor2.DataSelectorBase.DatasetState = {
  NOT_LOADED: 0,
  PROCESSING: 1,
  LOADED: 2
};

/**
 * @private
 */
anychart.ui.chartEditor2.DataSelectorBase.prototype.loadDataIndex_ = function() {
  if (!this.dataIndex.length) {
    var self = this;
    goog.net.XhrIo.send(this.jsonUrl + 'index.json',
        function(e) {
          var xhr = e.target;
          var indexJson = xhr.getResponseJson();
          if (indexJson['sets']) {
            for (var i in indexJson['sets']) {
              self.dataIndex[indexJson['sets'][i]['id']] = indexJson['sets'][i];
            }
          }
          self.showDataSets_();
        });
  }
};


/** @inheritDoc */
anychart.ui.chartEditor2.DataSelectorBase.prototype.createDom = function() {
  anychart.ui.chartEditor2.DataSelectorBase.base(this, 'createDom');

  goog.dom.classlist.add(this.element_, anychart.ui.chartEditor2.DataSelectorBase.CSS_CLASS);
  goog.dom.classlist.add(this.element_, this.className);

  var dom = this.getDomHelper();
  this.filterInput_ = dom.createDom(goog.dom.TagName.INPUT, {'class': 'filter', 'placeholder': 'Filter..'});
  this.contentEl_ = dom.createDom(goog.dom.TagName.DIV, 'inner');
  this.element_.appendChild(dom.createDom(goog.dom.TagName.DIV, 'section-content',
      dom.createDom(goog.dom.TagName.DIV, 'top', dom.createDom(goog.dom.TagName.H2, null, this.title), this.filterInput_),
      this.contentEl_));

  this.loadDataIndex_();
};


anychart.ui.chartEditor2.DataSelectorBase.prototype.enterDocument = function() {
  anychart.ui.chartEditor2.DataSelectorBase.base(this, 'enterDocument');

  this.getHandler().listen(this.filterInput_, goog.events.EventType.INPUT, this.onFilterChange_);
  this.listen(anychart.ui.chartEditor2.events.EventType.UPDATE_FILTER, this.onFilterChange_, false, this);
};


anychart.ui.chartEditor2.DataSelectorBase.prototype.showDataSets_ = function(opt_ids) {
  goog.dom.removeChildren(this.contentEl_);

  for (var i = 0; i < this.dataIndex.length; i++) {
    var dataSetJson = this.dataIndex[i];
    if (!goog.isDef(dataSetJson['state']))
      dataSetJson['state'] = anychart.ui.chartEditor2.DataSelectorBase.DatasetState.NOT_LOADED;

    if (!goog.isArray(opt_ids) || opt_ids.indexOf(dataSetJson['id']) != -1)
      this.contentEl_.appendChild(this.createItem(dataSetJson, dataSetJson['state']));
  }
  this.contentEl_.appendChild(this.dom_.createDom(goog.dom.TagName.DIV, 'cb'));
};


anychart.ui.chartEditor2.DataSelectorBase.prototype.createItem = function(itemJson, state) {
  return null;
};


anychart.ui.chartEditor2.DataSelectorBase.prototype.onFilterChange_ = function(evt) {
  var searchValue = goog.isDef(evt.currentTarget.value) ? evt.currentTarget.value : this.filterInput_.value;
  searchValue = searchValue.toLowerCase();
  var ids = [];
  if (searchValue && this.dataIndex.length) {
    for (var i = 0; i < this.dataIndex.length; i++) {
      var set = this.dataIndex[i];
      for (var j = 0; j < this.searchFields.length; j++) {
        var field = this.searchFields[j];
        if (set[field]) {
          var fieldValue = set[field];
          if (set['state'] == anychart.ui.chartEditor2.DataSelectorBase.DatasetState.LOADED ||
              (goog.isString(fieldValue) && fieldValue.toLowerCase().indexOf(searchValue) != -1)) {
              ids.push(set['id']);
          } else if (goog.isArray(fieldValue)) {
            var result = fieldValue.filter(function(item) {
              return item.toLowerCase().indexOf(searchValue) != -1;
            });
            if (result.length)
              ids.push(set['id']);
          }
        }
      }
    }
    this.showDataSets_(ids);
  } else {
    // Show everything
    this.showDataSets_();
  }
};


anychart.ui.chartEditor2.DataSelectorBase.prototype.onDownloadClick = function(evt) {
  var setId = evt.currentTarget.getAttribute('data-set-id');
  if (setId && this.dataIndex[setId]['state'] != anychart.ui.chartEditor2.DataSelectorBase.DatasetState.LOADED) {
    this.dataIndex[setId]['state'] = anychart.ui.chartEditor2.DataSelectorBase.DatasetState.PROCESSING;
    var setEl = goog.dom.getAncestorByClass(evt.currentTarget, 'data-set');

    var preloader = this.preloaders[setId];
    if (!preloader) {
      preloader = this.preloaders[setId] = new anychart.ui.Preloader();
      preloader.render(setEl);
    }
    preloader.visible(true);

    var setUrl = this.getDataSetUrl(this.dataIndex[setId]['data']);
    var self = this;
    goog.net.XhrIo.send(setUrl,
        function(e) {
          if(e.target.getStatus() == 200) {
            var json = e.target.getResponseJson();
            self.onLoadData(json, setId);

            goog.dom.classlist.add(setEl, 'loaded');
            self.dataIndex[setId]['state'] = anychart.ui.chartEditor2.DataSelectorBase.DatasetState.LOADED;
          } else {
            self.dataIndex[setId]['state'] = anychart.ui.chartEditor2.DataSelectorBase.DatasetState.NOT_LOADED;
          }

          preloader.visible(false);
        });

    /**
     * todo:
     * Карточка загруженного датасета
     * Удаление датасета из загрузки
     */
  }
};


anychart.ui.chartEditor2.DataSelectorBase.prototype.onRemoveClick = function(evt) {
  var setId = evt.currentTarget.getAttribute('data-set-id');
  if (setId && this.dataIndex[setId]['state'] == anychart.ui.chartEditor2.DataSelectorBase.DatasetState.LOADED) {
    // this.dataIndex[setId]['state'] = anychart.ui.chartEditor2.DataSelectorBase.DatasetState.PROCESSING;
    var setEl = goog.dom.getAncestorByClass(evt.currentTarget, 'data-set');

    goog.dom.classlist.remove(setEl, 'loaded');
    this.dataIndex[setId]['state'] = anychart.ui.chartEditor2.DataSelectorBase.DatasetState.NOT_LOADED;
    this.onRemoveData(setId);

    this.dispatchEvent({
      type: anychart.ui.chartEditor2.events.EventType.UPDATE_FILTER
    });
  }
};


anychart.ui.chartEditor2.DataSelectorBase.prototype.getDataSetUrl = function(fileName) {
  return fileName.replace('./', this.jsonUrl);
};


anychart.ui.chartEditor2.DataSelectorBase.prototype.onLoadData = function(json, setId) {};

anychart.ui.chartEditor2.DataSelectorBase.prototype.onRemoveData = function(setId) {};