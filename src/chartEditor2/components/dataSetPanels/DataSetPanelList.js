goog.provide('anychart.chartEditor2Module.DataSetPanelList');

goog.require('anychart.ui.Component');
goog.require('anychart.chartEditor2Module.DataSetPanel');
goog.require('anychart.chartEditor2Module.EditorModel');



/**
 * @constructor
 * @extends {anychart.ui.Component}
 */
anychart.chartEditor2Module.DataSetPanelList = function(dataModel) {
  goog.base(this);

  this.setModel(dataModel);

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
  this.update();
  this.getHandler().listen(this.model_, anychart.chartEditor2Module.events.EventType.EDITOR_MODEL_UPDATE, this.update);
};


/*anychart.chartEditor2Module.DataSetPanelList.prototype.onRemoveData_ = function(evt) {
  var panel = evt.target;
  this.panels_ = goog.array.filter(this.panels_, function(item){
    return panel != item;
  });

  this.removeChild(panel, true);
  panel.dispose();
};*/


anychart.chartEditor2Module.DataSetPanelList.prototype.update = function() {
  this.removeChildren(true);
  goog.disposeAll(this.panels_);
  this.panels_.length = 0;

  var active = this.model_.getActive();
  var data = this.model_.getPreparedData();

  for(var i = 0; i < data.length; i++) {
    this.panels_.push(new anychart.chartEditor2Module.DataSetPanel(data[i]));
    this.addChild(this.panels_[i], true);
    this.panels_[i].setDisabled(this.panels_[i].getSetFullId() != active);
  }
};