goog.provide('anychart.ui.chartEditor2.DataSetPanelList');

goog.require('anychart.ui.Component');
goog.require('anychart.ui.chartEditor2.DataSetPanel');



/**
 * @constructor
 * @extends {anychart.ui.Component}
 */
anychart.ui.chartEditor2.DataSetPanelList = function() {
  anychart.ui.chartEditor2.DataSetPanelList.base(this, 'constructor');

  this.panels_ = [];
};
goog.inherits(anychart.ui.chartEditor2.DataSetPanelList, anychart.ui.Component);


/** @inheritDoc */
anychart.ui.chartEditor2.DataSetPanelList.prototype.createDom = function() {
  anychart.ui.chartEditor2.DataSetPanelList.base(this, 'createDom');

  var element = /** @type {Element} */(this.getElement());
  //  var dom = this.getDomHelper();

  goog.dom.classlist.add(element, 'data-set-panel-list');
};


anychart.ui.chartEditor2.DataSetPanelList.prototype.exitDocument = function() {
  anychart.ui.chartEditor2.DataSetPanelList.base(this, 'exitDocument');

  for(var i = 0; i < this.panels_.length; i++) {
    this.panels_[i].exitDocument();
    if (this.panels_[i].element_) {
      goog.dom.removeNode(this.panels_[i].element_);
    }
  }
};


anychart.ui.chartEditor2.DataSetPanelList.prototype.updatePanels = function(data) {
  console.log(data);

  this.removeChildren(true);
  this.panels_.length = 0;

  for(var i = 0; i < data.length; i++) {
    this.panels_.push(new anychart.ui.chartEditor2.DataSetPanel(data[i]));
    this.addChild(this.panels_[i], true);
  }
};


