goog.provide('anychart.chartEditor2Module.ChartTitlePanel');

goog.require('anychart.chartEditor2Module.SettingsPanel');
goog.require('anychart.chartEditor2Module.settings.Title');



/**
 * @param {anychart.chartEditor2Module.EditorModel} model
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper; see {@link goog.ui.Component} for semantics.
 * @constructor
 * @extends {anychart.chartEditor2Module.SettingsPanel}
 */
anychart.chartEditor2Module.ChartTitlePanel = function(model, opt_domHelper) {
  anychart.chartEditor2Module.ChartTitlePanel.base(this, 'constructor', model, opt_domHelper);

  this.name = 'Chart Title';

  this.key = [['chart'], ['settings'], 'title().enabled()'];
};
goog.inherits(anychart.chartEditor2Module.ChartTitlePanel, anychart.chartEditor2Module.SettingsPanel);


/** @inheritDoc */
anychart.chartEditor2Module.ChartTitlePanel.prototype.createDom = function() {
  anychart.chartEditor2Module.ChartTitlePanel.base(this, 'createDom');

  var title = new anychart.chartEditor2Module.settings.Title();
  title.allowEnabled(false);
  title.setModel(this.getModel());
  title.setKey([['chart'], ['settings'], 'title()']);
  title.setPositionKey('orientation()');
  this.addChild(title, true);

  this.title_ = title;
};


/** @inheritDoc */
anychart.chartEditor2Module.ChartTitlePanel.prototype.onChartDraw = function(evt) {
  // var model = /** @type {anychart.chartEditor2Module.EditorModel} */(this.getModel());
  this.title_.update(evt.chart);

  anychart.chartEditor2Module.ChartTitlePanel.base(this, 'onChartDraw', evt);
};

