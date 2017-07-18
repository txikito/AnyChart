goog.provide('anychart.ui.chartEditor2.SeriesPanel');

goog.require('goog.ui.Container');



/**
 * @constructor
 * @extends {goog.ui.Container}
 */
anychart.ui.chartEditor2.SeriesPanel = function(type, index) {
  goog.base(this, 'constructor');

  this.index_ = index;

  this.type_ = type;
};
goog.inherits(anychart.ui.chartEditor2.SeriesPanel, goog.ui.Container);


/** @inheritDoc */
anychart.ui.chartEditor2.SeriesPanel.prototype.createDom = function() {
  goog.base(this, 'createDom');

  goog.dom.classlist.add(this.getElement(), 'series-panel');

  var dom = this.getDomHelper();
  this.getElement().appendChild(dom.createDom(goog.dom.TagName.H3, null, this.type_ + ' series ' + this.index_));
};


anychart.ui.chartEditor2.SeriesPanel.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
};
