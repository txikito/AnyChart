goog.provide('anychart.chartEditor2Module.UploadedDataSetPanelList');

goog.require('anychart.ui.Component');
goog.require('anychart.chartEditor2Module.UploadedDataSetPanel');
goog.require('anychart.chartEditor2Module.EditorModel');



/**
 * @constructor
 * @extends {anychart.ui.Component}
 */
anychart.chartEditor2Module.UploadedDataSetPanelList = function(dataModel) {
  goog.base(this);

  this.setModel(dataModel);

  this.panels_ = [];
};
goog.inherits(anychart.chartEditor2Module.UploadedDataSetPanelList, anychart.ui.Component);


/** @inheritDoc */
anychart.chartEditor2Module.UploadedDataSetPanelList.prototype.createDom = function() {
  anychart.chartEditor2Module.UploadedDataSetPanelList.base(this, 'createDom');

  var element = /** @type {Element} */(this.getElement());
  goog.dom.classlist.add(element, 'uploaded');

  var dom = this.getDomHelper();
  this.empty_ = dom.createDom(goog.dom.TagName.DIV, 'empty', 'Nothing uploaded yet...');
  element.appendChild(this.empty_);
};


/** @inheritDoc */
anychart.chartEditor2Module.UploadedDataSetPanelList.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.update();
  this.getHandler().listen(this.model_, anychart.chartEditor2Module.events.EventType.EDITOR_MODEL_UPDATE, this.update);
};


anychart.chartEditor2Module.UploadedDataSetPanelList.prototype.update = function() {
  this.removeChildren(true);
  goog.disposeAll(this.panels_);
  this.panels_.length = 0;

  var data = this.model_.getPreparedData();
  for(var i = 0; i < data.length; i++) {
    if (data[i]['type'] == anychart.chartEditor2Module.EditorModel.dataType.UPLOADED) {
      this.panels_.push(new anychart.chartEditor2Module.UploadedDataSetPanel(data[i]));
      this.addChild(this.panels_[i], true);
    }
  }

  goog.dom.classlist.enable(this.empty_, 'hidden', this.panels_.length);
};