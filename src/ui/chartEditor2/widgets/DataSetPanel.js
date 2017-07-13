goog.provide('anychart.ui.chartEditor2.DataSetPanel');

goog.require('anychart.ui.Component');


/**
 * @constructor
 * @extends {anychart.ui.Component}
 */
anychart.ui.chartEditor2.DataSetPanel = function(data) {
  anychart.ui.chartEditor2.DataSetPanel.base(this, 'constructor');

  this.data_ = data;
};
goog.inherits(anychart.ui.chartEditor2.DataSetPanel, anychart.ui.Component);


/** @inheritDoc */
anychart.ui.chartEditor2.DataSetPanel.prototype.createDom = function() {
  anychart.ui.chartEditor2.DataSetPanel.base(this, 'createDom');

  var element = /** @type {Element} */(this.getElement());
  var dom = this.getDomHelper();

  var fields = [];
  if (goog.isArray(this.data_['fields'])) {
    for (var i = 0; i < this.data_['fields'].length; i++) {
      fields.push(dom.createDom(goog.dom.TagName.DIV, 'field', this.data_['fields'][i]['name']))
    }
  }

  element.append(dom.createDom(goog.dom.TagName.H4, null, this.data_['name']), dom.createDom(goog.dom.TagName.DIV, 'inner', fields));
};


anychart.ui.chartEditor2.DataSetPanel.prototype.enterDocument = function() {
  anychart.ui.chartEditor2.DataSetPanel.base(this, 'enterDocument');

  // this.getHandler().listen(this.filterInput_, goog.events.EventType.INPUT, this.onFilterChange_);
  // this.listen(anychart.ui.chartEditor2.events.EventType.UPDATE_FILTER, this.onFilterChange_, false, this);
};
