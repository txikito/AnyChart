goog.provide('anychart.chartEditor2Module.steps.SetupChart');

goog.require('anychart.chartEditor2Module.BasicSettings');
goog.require('anychart.chartEditor2Module.Chart');
goog.require('anychart.chartEditor2Module.ChartTypeSelector');
goog.require('anychart.chartEditor2Module.DataSetPanelList');
goog.require('anychart.chartEditor2Module.events');
goog.require('anychart.chartEditor2Module.steps.Base');
goog.require('goog.dom.classlist');
goog.require('goog.format.JsonPrettyPrinter');

goog.forwardDeclare('anychart.data.Mapping');



/**
 * Chart Editor Step Class.
 * @constructor
 * @param {number} index Step index
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @extends {anychart.chartEditor2Module.steps.Base}
 */
anychart.chartEditor2Module.steps.SetupChart = function(index, opt_domHelper) {
  anychart.chartEditor2Module.steps.SetupChart.base(this, 'constructor', index, opt_domHelper);

  this.name('Setup Chart');
  this.title('Setup Chart');
};
goog.inherits(anychart.chartEditor2Module.steps.SetupChart, anychart.chartEditor2Module.steps.Base);


/** @inheritDoc */
anychart.chartEditor2Module.steps.SetupChart.prototype.createDom = function() {
  goog.base(this, 'createDom');

  var element = /** @type {Element} */(this.getElement());
  goog.dom.classlist.add(element, 'step-setup-chart');

  var model = /** @type {anychart.chartEditor2Module.EditorModel} */(/** @type {anychart.chartEditor2Module.Editor} */(this.getParent()).getModel());

  this.chart_ = new anychart.chartEditor2Module.Chart(model);
  this.addChild(this.chart_, true);

  this.panelsList_ = new anychart.chartEditor2Module.DataSetPanelList(model);
  this.addChild(this.panelsList_, true);

  this.chartTypeSelector_ = new anychart.chartEditor2Module.ChartTypeSelector(model);
  this.addChild(this.chartTypeSelector_, true);

  this.basicSettings_ = new anychart.chartEditor2Module.BasicSettings(/** @type {anychart.chartEditor2Module.Editor} */(this.getParent()));
  this.addChild(this.basicSettings_, true);
};
