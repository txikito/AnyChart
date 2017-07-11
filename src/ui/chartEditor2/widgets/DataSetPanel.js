goog.provide('anychart.ui.chartEditor2.DataSetPanel');

goog.require('anychart.ui.Component');


/**
 * @constructor
 * @extends {anychart.ui.Component}
 */
anychart.ui.chartEditor2.DataSetPanel = function() {
  anychart.ui.chartEditor2.DataSetPanel.base(this, 'constructor');
};
goog.inherits(anychart.ui.chartEditor2.DataSetPanel, anychart.ui.Component);


/** @inheritDoc */
anychart.ui.chartEditor2.DataSetPanel.prototype.createDom = function() {
  anychart.ui.chartEditor2.DataSetPanel.base(this, 'createDom');

};


anychart.ui.chartEditor2.DataSetPanel.prototype.enterDocument = function() {
  anychart.ui.chartEditor2.DataSetPanel.base(this, 'enterDocument');

  // this.getHandler().listen(this.filterInput_, goog.events.EventType.INPUT, this.onFilterChange_);
  // this.listen(anychart.ui.chartEditor2.events.EventType.UPDATE_FILTER, this.onFilterChange_, false, this);
};
