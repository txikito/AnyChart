goog.provide('anychart.chartEditor2Module.UploadedDataSetPanelList');

goog.require('anychart.chartEditor2Module.Component');
goog.require('anychart.chartEditor2Module.EditorModel');
goog.require('anychart.chartEditor2Module.UploadedDataSetPanel');



/**
 * List of uploaded data sets.
 *
 * @param {anychart.chartEditor2Module.EditorModel} dataModel
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper; see {@link goog.ui.Component} for semantics.
 * @constructor
 * @extends {anychart.chartEditor2Module.Component}
 */
anychart.chartEditor2Module.UploadedDataSetPanelList = function(dataModel, opt_domHelper) {
  anychart.chartEditor2Module.UploadedDataSetPanelList.base(this, 'constructor', opt_domHelper);

  this.setModel(dataModel);

  /**
   * @type {Array.<anychart.chartEditor2Module.UploadedDataSetPanel>}
   * @private
   */
  this.panels_ = [];
};
goog.inherits(anychart.chartEditor2Module.UploadedDataSetPanelList, anychart.chartEditor2Module.Component);


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
  this.getHandler().listen(/** @type {anychart.chartEditor2Module.EditorModel} */(this.getModel()),
      anychart.chartEditor2Module.events.EventType.EDITOR_MODEL_UPDATE, this.update);
};


/** @inheritDoc */
anychart.chartEditor2Module.UploadedDataSetPanelList.prototype.update = function() {
  this.removeChildren(true);
  goog.disposeAll(this.panels_);
  this.panels_.length = 0;

  var data = this.getModel().getPreparedData();
  for(var i = 0; i < data.length; i++) {
    if (data[i]['type'] == anychart.chartEditor2Module.EditorModel.dataType.UPLOADED) {
      this.panels_.push(new anychart.chartEditor2Module.UploadedDataSetPanel(data[i]));
      this.addChild(this.panels_[i], true);
    }
  }

  goog.dom.classlist.enable(this.empty_, 'hidden', !!this.panels_.length);
};
