goog.provide('anychart.chartEditor2Module.UploadedDataSetPanel');

goog.require('anychart.ui.Component');
goog.require('goog.ui.Menu');
goog.require('goog.ui.MenuButton');
goog.require('goog.ui.MenuItem');
goog.require('goog.ui.MenuSeparator');


/**
 * Uploaded dataset's panel with dataset's name and with 'remove' button.
 *
 * @param {Object} dataSet Data set object
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper; see {@link goog.ui.Component} for semantics.
 * @constructor
 * @extends {anychart.ui.Component}
 */
anychart.chartEditor2Module.UploadedDataSetPanel = function(dataSet, opt_domHelper) {
  anychart.chartEditor2Module.UploadedDataSetPanel.base(this, 'constructor', opt_domHelper);
  this.dataSet_ = dataSet;
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
      dom.createDom(goog.dom.TagName.DIV, 'title', this.dataSet_['title']),
      removeButton));
};


/**
 * Dispatches event to remove dataset from model.
 */
anychart.chartEditor2Module.UploadedDataSetPanel.prototype.removeDataSet = function() {
  this.dispatchEvent({
    type: anychart.chartEditor2Module.events.EventType.DATA_REMOVE,
    setId: this.dataSet_['setId'],
    dataType: this.dataSet_['type'],
    setFullId: this.dataSet_['setFullId']
  });
};
