goog.provide('anychart.chartEditor2Module.UploadedDataSetPanel');

goog.require('anychart.ui.Component');
goog.require('goog.ui.Menu');
goog.require('goog.ui.MenuButton');
goog.require('goog.ui.MenuItem');
goog.require('goog.ui.MenuSeparator');


/**
 * @constructor
 * @extends {anychart.ui.Component}
 */
anychart.chartEditor2Module.UploadedDataSetPanel = function(data) {
  goog.base(this);
  this.data_ = data;
};
goog.inherits(anychart.chartEditor2Module.UploadedDataSetPanel, anychart.ui.Component);


/** @inheritDoc */
anychart.chartEditor2Module.UploadedDataSetPanel.prototype.createDom = function() {
  goog.base(this, 'createDom');

  var dom = this.getDomHelper();
  var element = /** @type {Element} */(this.getElement());
  goog.dom.classlist.add(element, 'panel');

  var removeButton = dom.createDom(goog.dom.TagName.A, {'class': 'anychart-button anychart-button-danger remove'}, 'Remove');
  this.getHandler().listen(removeButton, goog.events.EventType.CLICK, this.removeDataSet);
  element.appendChild(dom.createDom(goog.dom.TagName.DIV, 'content',
      dom.createDom(goog.dom.TagName.DIV, 'title', this.data_['title']),
      removeButton));
};


anychart.chartEditor2Module.UploadedDataSetPanel.prototype.removeDataSet = function() {
  this.dispatchEvent({
    type: anychart.chartEditor2Module.events.EventType.DATA_REMOVE,
    setId: this.data_['setId'],
    dataType: this.data_['type'],
    setFullId: this.data_['setFullId']
  });
};

