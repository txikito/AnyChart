goog.provide('anychart.chartEditor2Module.DataSetPanelList');

goog.require('anychart.ui.Component');
goog.require('anychart.chartEditor2Module.DataSetPanel');
goog.require('anychart.chartEditor2Module.DataModel');



/**
 * @constructor
 * @extends {anychart.ui.Component}
 */
anychart.chartEditor2Module.DataSetPanelList = function(dataModel) {
  goog.base(this);

  /**
   * @type {anychart.chartEditor2Module.DataModel}
   * @private
   */
  this.dataModel_ = dataModel;

  this.panels_ = [];
};
goog.inherits(anychart.chartEditor2Module.DataSetPanelList, anychart.ui.Component);


/** @inheritDoc */
anychart.chartEditor2Module.DataSetPanelList.prototype.createDom = function() {
  anychart.chartEditor2Module.DataSetPanelList.base(this, 'createDom');

  var element = /** @type {Element} */(this.getElement());
  goog.dom.classlist.add(element, 'data-set-panel-list');
};


/** @inheritDoc */
anychart.chartEditor2Module.DataSetPanelList.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.getHandler().listen(this.dataModel_, anychart.chartEditor2Module.events.EventType.DATA_UPDATE_MODEL, this.update);
  this.getHandler().listen(this.dataModel_, anychart.chartEditor2Module.events.EventType.DATA_UPDATE_USING_STATE, this.updateUsing);

  this.update(null);
};


anychart.chartEditor2Module.DataSetPanelList.prototype.onRemoveData_ = function(evt) {
  var panel = evt.target;
  this.panels_ = goog.array.filter(this.panels_, function(item){
    return panel != item;
  });

  this.removeChild(panel, true);
  panel.dispose();
};


anychart.chartEditor2Module.DataSetPanelList.prototype.update = function(evt) {
  var data = this.dataModel_.getPreparedData();
  this.removeChildren(true);
  goog.disposeAll(this.panels_);
  this.panels_.length = 0;

  for(var i = 0; i < data.length; i++) {
    this.panels_.push(new anychart.chartEditor2Module.DataSetPanel(data[i]));
    this.addChild(this.panels_[i], true);
    this.getHandler().listen(this.panels_[i], anychart.chartEditor2Module.events.EventType.DATA_REMOVE, this.onRemoveData_);
  }
};


anychart.chartEditor2Module.DataSetPanelList.prototype.updateUsing = function(evt) {
  for(var i = this.panels_.length; i--;) {
    this.panels_[i].setDisabled(this.panels_[i].getDataFullId() != evt.setFullId);
  }
};