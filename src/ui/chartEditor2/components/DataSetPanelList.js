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


anychart.ui.chartEditor2.DataSetPanelList.prototype.onRemoveData_ = function(evt) {
  var panel = evt.target;
  this.panels_ = goog.array.filter(this.panels_, function(item){
    return panel != item;
  });

  this.removeChild(panel, true);
  panel.dispose();
};


anychart.ui.chartEditor2.DataSetPanelList.prototype.updatePanels = function(data) {
  this.removeChildren(true);
  goog.disposeAll(this.panels_);
  this.panels_.length = 0;

  for(var i = 0; i < data.length; i++) {
    this.panels_.push(new anychart.ui.chartEditor2.DataSetPanel(data[i]));
    this.addChild(this.panels_[i], true);
    this.getHandler().listen(this.panels_[i], anychart.ui.chartEditor2.events.EventType.REMOVE_DATA, this.onRemoveData_);
  }
};


