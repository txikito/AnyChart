goog.provide('anychart.ui.chartEditor2.steps.SetupChart');

goog.require('anychart.ui.chartEditor2.ChartTypeSelector');
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
  goog.base(this, index, opt_domHelper);

  this.name('Setup Chart');
  this.title('Setup Chart');
};
goog.inherits(anychart.ui.chartEditor2.steps.SetupChart, anychart.ui.chartEditor2.steps.Base);


anychart.ui.chartEditor2.steps.SetupChart.prototype.createDom = function() {
  goog.base(this, 'createDom');

  var element = /** @type {Element} */(this.getElement());
  goog.dom.classlist.add(element, 'step-setup-chart');

  var dataModel = /** @type {anychart.ui.Editor2} */(this.getParent()).getDataModel();

  this.panelsList_ = new anychart.ui.chartEditor2.DataSetPanelList(dataModel);
  this.addChild(this.panelsList_, true);

  this.chartTypeSelector_ = new anychart.ui.chartEditor2.ChartTypeSelector(dataModel);
  this.addChild(this.chartTypeSelector_, true);
};
