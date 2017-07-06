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
          self.showDataSets();
        });
  }
};


/** @inheritDoc */
anychart.ui.chartEditor2.DataSelectorBase.prototype.createDom = function() {
  anychart.ui.chartEditor2.DataSelectorBase.base(this, 'createDom');

  goog.dom.classlist.add(this.element_, anychart.ui.chartEditor2.DataSelectorBase.CSS_CLASS);
  goog.dom.classlist.add(this.element_, this.className);

  var dom = this.getDomHelper();
  this.contentEl_ = dom.createDom(goog.dom.TagName.DIV, 'inner',
      dom.createDom(goog.dom.TagName.DIV, 'top',
          dom.createDom(goog.dom.TagName.H2, null, this.title),
          dom.createDom(goog.dom.TagName.INPUT, {'class': 'filter', 'placeholder': 'Filter..'})));
  this.element_.appendChild(dom.createDom(goog.dom.TagName.DIV, 'section-content', this.contentEl_));

  this.loadIndexJson_();
};


anychart.ui.chartEditor2.DataSelectorBase.prototype.showDataSets = function() {
  for (var i = 0; i < this.indexJson_['sets'].length; i++) {
    var dataSetJson = this.indexJson_['sets'][i];
    this.contentEl_.appendChild(this.createItem(dataSetJson));
  }
  this.contentEl_.appendChild(this.dom_.createDom(goog.dom.TagName.DIV, 'cb'));
};


anychart.ui.chartEditor2.DataSelectorBase.prototype.createItem = function(itemJson) {
  return null;
};
