goog.provide('anychart.ui.chartEditor2.steps.SetupChart');

goog.require('anychart.ui.chartEditor2.DataSetPanelList');
goog.require('anychart.ui.chartEditor2.events');
goog.require('anychart.ui.chartEditor2.steps.Base');
goog.require('goog.dom.classlist');
goog.require('goog.format.JsonPrettyPrinter');

goog.forwardDeclare('anychart.data.Mapping');



/**
 * Chart Editor Step Class.
 * @constructor
 * @param {number} index Step index
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @extends {anychart.ui.chartEditor2.steps.Base}
 */
anychart.ui.chartEditor2.steps.SetupChart = function(index, opt_domHelper) {
  anychart.ui.chartEditor2.steps.SetupChart.base(this, 'constructor', index, opt_domHelper);

  this.name('Setup Chart');
  this.title('Setup Chart');
};
goog.inherits(anychart.ui.chartEditor2.steps.SetupChart, anychart.ui.chartEditor2.steps.Base);


/** @override */
anychart.ui.chartEditor2.steps.SetupChart.prototype.enterDocument = function() {
  anychart.ui.chartEditor2.steps.SetupChart.base(this, 'enterDocument');

  var dataModel = /** @type {anychart.ui.Editor2} */(this.getParent()).getDataModel();
  if (dataModel.isDirty()) {
    this.panelsList_.updatePanels(dataModel.getPreparedData());
  }
};


anychart.ui.chartEditor2.steps.SetupChart.prototype.createDom = function() {
  anychart.ui.chartEditor2.steps.SetupChart.base(this, 'createDom');

  var element = /** @type {Element} */(this.getElement());
  // var dom = this.getDomHelper();

  goog.dom.classlist.add(element, 'step-setup-chart');

  this.panelsList_ = new anychart.ui.chartEditor2.DataSetPanelList();
  this.addChild(this.panelsList_, true);
  //this.panelsList_.render(element);
};
