goog.provide('anychart.ui.chartEditor2.DataSetPanelList');

goog.require('anychart.ui.Component');
goog.require('anychart.ui.chartEditor2.DataSetPanel');
goog.require('anychart.ui.chartEditor2.DataModel');



/**
 * @constructor
 * @extends {anychart.ui.Component}
 */
anychart.ui.chartEditor2.DataSetPanelList = function(dataModel) {
  goog.base(this);

  /**
   * @type {anychart.ui.chartEditor2.DataModel}
   * @private
   */
  this.dataModel_ = dataModel;

  this.panels_ = [];
};
goog.inherits(anychart.ui.chartEditor2.DataSetPanelList, anychart.ui.Component);


/** @inheritDoc */
anychart.ui.chartEditor2.DataSetPanelList.prototype.createDom = function() {
  anychart.ui.chartEditor2.DataSetPanelList.base(this, 'createDom');

  var element = /** @type {Element} */(this.getElement());
  goog.dom.classlist.add(element, 'data-set-panel-list');
};


/** @inheritDoc */
anychart.ui.chartEditor2.DataSetPanelList.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.getHandler().listen(this.dataModel_, anychart.ui.chartEditor2.events.EventType.DATA_UPDATE_MODEL, this.update);

  this.update(null);
};


anychart.ui.chartEditor2.DataSetPanelList.prototype.onRemoveData_ = function(evt) {
  var panel = evt.target;
  this.panels_ = goog.array.filter(this.panels_, function(item){
    return panel != item;
  });

  this.removeChild(panel, true);
  panel.dispose();
};


anychart.ui.chartEditor2.DataSetPanelList.prototype.update = function(evt) {
  var data = this.dataModel_.getPreparedData();
  this.removeChildren(true);
  goog.disposeAll(this.panels_);
  this.panels_.length = 0;

  for(var i = 0; i < data.length; i++) {
    this.panels_.push(new anychart.ui.chartEditor2.DataSetPanel(data[i]));
    this.addChild(this.panels_[i], true);
    this.getHandler().listen(this.panels_[i], anychart.ui.chartEditor2.events.EventType.DATA_REMOVE, this.onRemoveData_);
  }
};


