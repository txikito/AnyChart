goog.provide('anychart.ui.chartEditor2.DataSetPanelList');

goog.require('anychart.ui.Component');


/**
 * @constructor
 * @extends {anychart.ui.Component}
 */
anychart.ui.chartEditor2.DataSetPanelList = function() {
  anychart.ui.chartEditor2.DataSetPanelList.base(this, 'constructor');
};
goog.inherits(anychart.ui.chartEditor2.DataSetPanelList, anychart.ui.Component);


/** @inheritDoc */
anychart.ui.chartEditor2.DataSetPanelList.prototype.createDom = function() {
  anychart.ui.chartEditor2.DataSetPanelList.base(this, 'createDom');

  var element = /** @type {Element} */(this.getElement());
  var dom = this.getDomHelper();

  element.append( dom.createDom(goog.dom.TagName.H3, null, 'Data Sets List'));
};


anychart.ui.chartEditor2.DataSetPanelList.prototype.enterDocument = function() {
  anychart.ui.chartEditor2.DataSetPanelList.base(this, 'enterDocument');

  // this.getHandler().listen(this.filterInput_, goog.events.EventType.INPUT, this.onFilterChange_);
  // this.listen(anychart.ui.chartEditor2.events.EventType.UPDATE_FILTER, this.onFilterChange_, false, this);
};
