goog.provide('anychart.chartEditor2Module.YAxesPanel');

goog.require('anychart.chartEditor2Module.AxesPanelBase');



/**
 * @param {anychart.chartEditor2Module.EditorModel} model
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper; see {@link goog.ui.Component} for semantics.
 * @constructor
 * @extends {anychart.chartEditor2Module.AxesPanelBase}
 */
anychart.chartEditor2Module.YAxesPanel = function(model, opt_domHelper) {
  anychart.chartEditor2Module.YAxesPanel.base(this, 'constructor', model, opt_domHelper);

  this.name = 'Y Axes';
  this.xOrY = 'y';
};
goog.inherits(anychart.chartEditor2Module.YAxesPanel, anychart.chartEditor2Module.AxesPanelBase);
