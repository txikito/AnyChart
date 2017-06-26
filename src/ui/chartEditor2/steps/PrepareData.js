goog.provide('anychart.ui.chartEditor2.steps.PrepareData');

goog.require('anychart.ui.chartEditor2.events');
goog.require('anychart.ui.chartEditor2.steps.Base');
goog.require('goog.dom.classlist');
goog.require('goog.format.JsonPrettyPrinter');

goog.forwardDeclare('anychart.data.Mapping');



/**
 * Chart Editor Step Class.
 * @constructor
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @extends {anychart.ui.chartEditor2.steps.Base}
 */
anychart.ui.chartEditor2.steps.PrepareData = function(opt_domHelper) {
  anychart.ui.chartEditor2.steps.PrepareData.base(this, 'constructor', opt_domHelper);

  this.setName('Prepare Data');
  this.setTitle('Prepare Data');
};
goog.inherits(anychart.ui.chartEditor2.steps.PrepareData, anychart.ui.chartEditor2.steps.Base);


/**
 * CSS class name.
 * @type {string}
 */
anychart.ui.chartEditor2.steps.PrepareData.CSS_CLASS = goog.getCssName('anychart-chart-editor-prepare-data-step');


/**
 * DataSet index attribute.
 * @private
 */
anychart.ui.chartEditor2.steps.PrepareData.DATA_SET_DATA_ATTRIBUTE_ = 'data-index';


/** @override */
anychart.ui.chartEditor2.steps.PrepareData.prototype.createDom = function() {
  anychart.ui.chartEditor2.steps.PrepareData.base(this, 'createDom');

  var element = /** @type {Element} */(this.getElement());
  var dom = this.getDomHelper();

  var className = anychart.ui.chartEditor2.steps.PrepareData.CSS_CLASS;
  goog.dom.classlist.add(element, className);
};


/** @inheritDoc */
anychart.ui.chartEditor2.steps.PrepareData.prototype.enterDocument = function() {
  anychart.ui.chartEditor2.steps.PrepareData.base(this, 'enterDocument');

  // this.getHandler().listen(this.dataPreviewContentEl_, goog.events.EventType.WHEEL, this.handleWheel);
  //
  // this.getHandler().listen(this.dataSetsEl_, goog.events.EventType.CLICK, this.dataSetsClickHandler_);
  this.listen(anychart.ui.chartEditor2.events.EventType.CHANGE_STEP, this.onChangeStep_);
};


/**
 *
 * @param {Object} e
 * @private
 */
anychart.ui.chartEditor2.steps.PrepareData.prototype.onChangeStep_ = function(e) {
  // var sharedModel = this.getSharedModel();
  // this.updateSharedDataMappings();
  //
  // this.dispatchEvent({
  //   type: anychart.ui.chartEditor.events.EventType.REMOVE_ALL_SERIES
  // });
  //
  // // build series
  // for (var i = 0, count = sharedModel.dataMappings.length; i < count; i++) {
  //   this.dispatchEvent({
  //     type: anychart.ui.chartEditor.events.EventType.ADD_SERIES,
  //     seriesType: null,
  //     mapping: i,
  //     rebuild: false
  //   });
  // }
  //
  // this.dispatchEvent({
  //   type: anychart.ui.chartEditor.events.EventType.SET_CHART_DATA,
  //   value: 0,
  //   rebuild: false
  // });
};


/** @inheritDoc */
anychart.ui.chartEditor2.steps.PrepareData.prototype.update = function() {
  //this.updateDataSets_();
};


/** @inheritDoc */
anychart.ui.chartEditor2.steps.PrepareData.prototype.exitDocument = function() {
  anychart.ui.chartEditor2.steps.PrepareData.base(this, 'exitDocument');
};


/** @inheritDoc */
anychart.ui.chartEditor2.steps.PrepareData.prototype.disposeInternal = function() {
  anychart.ui.chartEditor2.steps.PrepareData.base(this, 'disposeInternal');
};
