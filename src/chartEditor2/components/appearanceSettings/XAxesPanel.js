goog.provide('anychart.chartEditor2Module.XAxesPanel');

goog.require('anychart.chartEditor2Module.AxesPanelBase');



/**
 * @param {anychart.chartEditor2Module.EditorModel} model
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper; see {@link goog.ui.Component} for semantics.
 * @constructor
 * @extends {anychart.chartEditor2Module.AxesPanelBase}
 */
anychart.chartEditor2Module.XAxesPanel = function(model, opt_domHelper) {
  anychart.chartEditor2Module.XAxesPanel.base(this, 'constructor', model, opt_domHelper);

  this.name = 'X Axes';
  this.xOrY = 'x';
};
goog.inherits(anychart.chartEditor2Module.XAxesPanel, anychart.chartEditor2Module.AxesPanelBase);
