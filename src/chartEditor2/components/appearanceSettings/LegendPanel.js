goog.provide('anychart.chartEditor2Module.LegendPanel');

goog.require('anychart.chartEditor2Module.SettingsPanel');



/**
 * @param {anychart.chartEditor2Module.EditorModel} model
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper; see {@link goog.ui.Component} for semantics.
 * @constructor
 * @extends {anychart.chartEditor2Module.SettingsPanel}
 */
anychart.chartEditor2Module.LegendPanel = function(model, opt_domHelper) {
  anychart.chartEditor2Module.LegendPanel.base(this, 'constructor', model, opt_domHelper);

  this.name_ = 'Legend';
};
goog.inherits(anychart.chartEditor2Module.LegendPanel, anychart.chartEditor2Module.SettingsPanel);


/** @inheritDoc */
anychart.chartEditor2Module.LegendPanel.prototype.createDom = function() {
  anychart.chartEditor2Module.LegendPanel.base(this, 'createDom');
};
