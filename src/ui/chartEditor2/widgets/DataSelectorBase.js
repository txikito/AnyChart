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

  this.indexJsonUrl = '';

  /**
   * @type {?Object}
   * @private
   */
  this.indexJson_ = null;

  this.searchFields = ['name', 'tags'];
};
goog.inherits(anychart.ui.chartEditor2.DataSelectorBase, anychart.ui.Component);


/** @type {string} */
anychart.ui.chartEditor2.DataSelectorBase.CSS_CLASS = 'data-selector';

/**
 * @private
 */
anychart.ui.chartEditor2.DataSelectorBase.prototype.loadIndexJson_ = function() {
  if (!this.indexJson_) {
    var self = this;
    goog.net.XhrIo.send(this.indexJsonUrl,
        function(e) {
          var xhr = e.target;
          self.indexJson_ = xhr.getResponseJson();
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
  this.inputFilter_ = dom.createDom(goog.dom.TagName.INPUT, {'class': 'filter', 'placeholder': 'Filter..'});
  this.contentEl_ = dom.createDom(goog.dom.TagName.DIV, 'inner');
  this.element_.appendChild(dom.createDom(goog.dom.TagName.DIV, 'section-content',
      dom.createDom(goog.dom.TagName.DIV, 'top', dom.createDom(goog.dom.TagName.H2, null, this.title), this.inputFilter_),
      this.contentEl_));

  this.loadIndexJson_();
};


anychart.ui.chartEditor2.DataSelectorBase.prototype.enterDocument = function() {
  anychart.ui.chartEditor2.DataSelectorBase.base(this, 'enterDocument');

  this.getHandler().listen(this.inputFilter_, goog.events.EventType.INPUT, this.onFilterChange_);
};


anychart.ui.chartEditor2.DataSelectorBase.prototype.showDataSets_ = function(opt_ids) {
  goog.dom.removeChildren(this.contentEl_);

  for (var i = 0; i < this.indexJson_['sets'].length; i++) {
    var dataSetJson = this.indexJson_['sets'][i];
    if (!goog.isArray(opt_ids) || opt_ids.indexOf(dataSetJson['id']) != -1)
      this.contentEl_.appendChild(this.createItem(dataSetJson));
  }
  this.contentEl_.appendChild(this.dom_.createDom(goog.dom.TagName.DIV, 'cb'));
};


anychart.ui.chartEditor2.DataSelectorBase.prototype.createItem = function(itemJson) {
  return null;
};


anychart.ui.chartEditor2.DataSelectorBase.prototype.onFilterChange_ = function(evt) {
  var searchValue = String(evt.currentTarget.value).toLowerCase();
  var ids = [];
  if (searchValue && this.indexJson_ && goog.isArray(this.indexJson_['sets'])) {
    for (var i = 0; i < this.indexJson_['sets'].length; i++) {
      var set = this.indexJson_['sets'][i];
      for (var j = 0; j < this.searchFields.length; j++) {
        var field = this.searchFields[j];
        if (set[field]) {
          var fieldValue = set[field];
          if (goog.isString(fieldValue) && fieldValue.toLowerCase().indexOf(searchValue) != -1) {
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