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

  this.key = [['chart'], ['settings'], 'title()'];
};
goog.inherits(anychart.chartEditor2Module.ChartTitlePanel, anychart.chartEditor2Module.SettingsPanel);


/** @inheritDoc */
anychart.chartEditor2Module.ChartTitlePanel.prototype.createDom = function() {
  anychart.chartEditor2Module.ChartTitlePanel.base(this, 'createDom');

  var model = /** @type {anychart.chartEditor2Module.EditorModel} */(this.getModel());
  var title = new anychart.chartEditor2Module.settings.Title(model);
  title.allowEnabled(false);
  title.setPositionKey('orientation()');
  title.setKey([['chart'], ['settings'], 'title()']);
  this.addChild(title, true);

  this.title_ = title;
};


