goog.provide('anychart.chartEditor2Module.DataSelectorBase');

goog.require('anychart.chartEditor2Module.Component');
goog.require('anychart.ui.Preloader');
goog.require('goog.dom');
goog.require('goog.dom.forms');
goog.require('goog.net.XhrIo');



/**
 * Base class for predefined data set's selector widget.
 *
 * @param {anychart.chartEditor2Module.EditorModel} dataModel
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper; see {@link goog.ui.Component} for semantics.
 * @constructor
 * @extends {anychart.chartEditor2Module.Component}
 */
anychart.chartEditor2Module.DataSelectorBase = function(dataModel, opt_domHelper) {
  anychart.chartEditor2Module.DataSelectorBase.base(this, 'constructor', opt_domHelper);

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

  /**
   * @type {anychart.chartEditor2Module.EditorModel}
   * @private
   */
  this.dataModel_ = dataModel;

  this.dataType = '';
};
goog.inherits(anychart.chartEditor2Module.DataSelectorBase, anychart.chartEditor2Module.Component);


/**
 * @enum {number}
 */
anychart.chartEditor2Module.DataSelectorBase.DatasetState = {
  NOT_LOADED: 0,
  PROCESSING: 1,
  LOADED: 2
};


/** @inheritDoc */
anychart.chartEditor2Module.DataSelectorBase.prototype.createDom = function() {
  anychart.chartEditor2Module.DataSelectorBase.base(this, 'createDom');

  goog.dom.classlist.add(this.getElement(), 'data-selector');
  goog.dom.classlist.add(this.getElement(), this.className);

  var dom = this.getDomHelper();
  this.filterInput_ = dom.createDom(goog.dom.TagName.INPUT, {'class': 'filter', 'placeholder': 'Filter..'});

  this.setsContainer_ = dom.createDom(goog.dom.TagName.DIV, 'inner');
  this.getElement().appendChild(
      dom.createDom(goog.dom.TagName.DIV, 'section-content',
          dom.createDom(goog.dom.TagName.DIV, 'top',
              dom.createDom(goog.dom.TagName.H2, null, this.title),
              this.filterInput_),
          this.setsContainer_));

  this.loadDataIndex_();
};


/** @inheritDoc */
anychart.chartEditor2Module.DataSelectorBase.prototype.enterDocument = function() {
  anychart.chartEditor2Module.DataSelectorBase.base(this, 'enterDocument');

  this.getHandler().listen(this.filterInput_, goog.events.EventType.INPUT, this.onFilterChange_);
  this.listen(anychart.chartEditor2Module.events.EventType.FILTER_UPDATE, this.onFilterChange_);
  this.listen(anychart.chartEditor2Module.events.EventType.DATA_REMOVE, this.onRemoveData_);
  this.setButtonsListeners_();

  this.updateDataIndexStates_();

  // to redraw data sets
  this.dispatchEvent({
    type: anychart.chartEditor2Module.events.EventType.FILTER_UPDATE
  });
};


/**
 * Sets listeners for data set's panels buttons.
 * @private
 */
anychart.chartEditor2Module.DataSelectorBase.prototype.setButtonsListeners_ = function() {
  var buttons = goog.dom.findNodes(this.setsContainer_, function(el) {
    return goog.dom.classlist.contains(/** @type {Element} */(el), 'anychart-button');
  });

  for (var i = 0; i < buttons.length; i++) {
    this.getHandler().listen(buttons[i], goog.events.EventType.CLICK, this.onClickButton_);
  }
};


/**
 * Loads index json.
 * 
 * @private
 */
anychart.chartEditor2Module.DataSelectorBase.prototype.loadDataIndex_ = function() {
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


/**
 * Sets states of data sets in data index.
 *
 * @private
 */
anychart.chartEditor2Module.DataSelectorBase.prototype.updateDataIndexStates_ = function() {
  var keys = this.dataModel_.getDataKeys();
  for (var i = 0; i < this.dataIndex.length; i++) {
    if (goog.array.contains(keys, this.dataType + i))
      this.dataIndex[i]['state'] = anychart.chartEditor2Module.DataSelectorBase.DatasetState.LOADED;
    else
      this.dataIndex[i]['state'] = anychart.chartEditor2Module.DataSelectorBase.DatasetState.NOT_LOADED;
  }
};


/**
 * @param {Array=} opt_ids
 * @private
 */
anychart.chartEditor2Module.DataSelectorBase.prototype.showDataSets_ = function(opt_ids) {
  var createItems = !this.setsContainer_.hasChildNodes() && this.dataIndex.length;
  for (var i = 0; i < this.dataIndex.length; i++) {
    var dataSetJson = this.dataIndex[i];
    var item;
    if (createItems) {
      dataSetJson['state'] = anychart.chartEditor2Module.DataSelectorBase.DatasetState.NOT_LOADED;
      item = /** @type {Element} */(this.createItem(dataSetJson, dataSetJson['state']));
      this.setsContainer_.appendChild(this.createItem(dataSetJson, dataSetJson['state']));
    } else {
      var className = 'data-set-' + dataSetJson['id'];
      item = /** @type {Element} */(goog.dom.findNode(this.setsContainer_, function(el) {
        return goog.dom.classlist.contains(/** @type {Element} */(el), className);
      }));

      if (dataSetJson['state'] != anychart.chartEditor2Module.DataSelectorBase.DatasetState.LOADED)
        goog.dom.classlist.remove(/** @type {Element} */(item), 'loaded');
    }

    if (!goog.isArray(opt_ids) || opt_ids.indexOf(dataSetJson['id']) != -1)
      goog.dom.classlist.remove(item, 'hidden');
    else
      goog.dom.classlist.add(item, 'hidden');
  }

  if (createItems) {
    this.setsContainer_.appendChild(this.dom_.createDom(goog.dom.TagName.DIV, 'cb'));
    this.setButtonsListeners_();
  }
};


/**
 * Creates DOM Element for data set.
 *
 * @param {Object} itemJson Object that describes data set.
 * @param {anychart.chartEditor2Module.DataSelectorBase.DatasetState} state
 * @return {Element}
 */
anychart.chartEditor2Module.DataSelectorBase.prototype.createItem = function(itemJson, state) {
  return null;
};


/**
 * Filters list of data sets on change of filter input value.
 *
 * @param {Object} evt
 * @private
 */
anychart.chartEditor2Module.DataSelectorBase.prototype.onFilterChange_ = function(evt) {
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
          if (set['state'] == anychart.chartEditor2Module.DataSelectorBase.DatasetState.LOADED ||
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


/** @private */
anychart.chartEditor2Module.DataSelectorBase.prototype.resetFilter_ = function() {
  goog.dom.forms.setValue(this.filterInput_, '');
  this.dispatchEvent({
    type: anychart.chartEditor2Module.events.EventType.FILTER_UPDATE
  });
};


/**
 * Universal handler for all data set panel buttons.
 * @param {Object} evt
 * @private
 */
anychart.chartEditor2Module.DataSelectorBase.prototype.onClickButton_ = function(evt) {
  var classes = goog.dom.classlist.get(/** @type {Element} */(evt.currentTarget));
  if (goog.array.contains(classes, 'download')) {
    this.onClickDownload_(evt);
  } else if (goog.array.contains(classes, 'remove')) {
    this.onClickRemove_(evt);
  }
};


/**
 * Loads data set.
 *
 * @param {Object} evt
 * @private
 */
anychart.chartEditor2Module.DataSelectorBase.prototype.onClickDownload_ = function(evt) {
  var setId = evt.currentTarget.getAttribute('data-set-id');
  if (setId && this.dataIndex[setId]['state'] != anychart.chartEditor2Module.DataSelectorBase.DatasetState.LOADED) {
    this.dataIndex[setId]['state'] = anychart.chartEditor2Module.DataSelectorBase.DatasetState.PROCESSING;
    var setEl = goog.dom.getAncestorByClass(/** @type {Element} */(evt.currentTarget), 'data-set');

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

            self.onLoadData(json, setId, self.dataIndex[setId]['name']);

            goog.dom.classlist.add(setEl, 'loaded');
            self.dataIndex[setId]['state'] = anychart.chartEditor2Module.DataSelectorBase.DatasetState.LOADED;
          } else {
            self.dataIndex[setId]['state'] = anychart.chartEditor2Module.DataSelectorBase.DatasetState.NOT_LOADED;
          }
          preloader.visible(false);
        });
  }
};


/**
 * @param {Object} evt
 * @private
 */
anychart.chartEditor2Module.DataSelectorBase.prototype.onClickRemove_ = function(evt) {
  var setId = evt.currentTarget.getAttribute('data-set-id');
  this.dispatchRemoveData(setId);
};


/**
 * Changes state of data set panel and updates filter.
 *
 * @param {Object} evt
 * @private
 */
anychart.chartEditor2Module.DataSelectorBase.prototype.onRemoveData_ = function(evt) {
  var setId = evt.setId;
  if (setId && this.dataIndex[setId]['state'] == anychart.chartEditor2Module.DataSelectorBase.DatasetState.LOADED) {
    this.dataIndex[setId]['state'] = anychart.chartEditor2Module.DataSelectorBase.DatasetState.NOT_LOADED;
    this.dispatchEvent({
      type: anychart.chartEditor2Module.events.EventType.FILTER_UPDATE
    });
  }
};


/**
 * Getter for data selector specific url for loaing of data set.
 *
 * @param {string} fileName
 * @return {string}
 */
anychart.chartEditor2Module.DataSelectorBase.prototype.getDataSetUrl = function(fileName) {return fileName;};


/**
 * Callback function on successfull loading of data set.
 *
 * @param {Object} json
 * @param {string} setId
 * @param {string=} opt_name
 */
anychart.chartEditor2Module.DataSelectorBase.prototype.onLoadData = function(json, setId, opt_name) {};


/**
 * Dispatches event to remove data set from model.
 *
 * @param {string} setId
 */
anychart.chartEditor2Module.DataSelectorBase.prototype.dispatchRemoveData = function(setId) {
  this.dispatchEvent({
    type: anychart.chartEditor2Module.events.EventType.DATA_REMOVE,
    dataType: this.dataType,
    setId: setId,
    setFullId: this.dataType + setId
  });
};
