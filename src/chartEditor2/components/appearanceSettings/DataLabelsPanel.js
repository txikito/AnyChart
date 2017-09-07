goog.provide('anychart.chartEditor2Module.DataLabelsPanel');

goog.require('anychart.chartEditor2Module.SettingsPanel');



/**
 * @param {anychart.chartEditor2Module.EditorModel} model
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper; see {@link goog.ui.Component} for semantics.
 * @constructor
 * @extends {anychart.chartEditor2Module.SettingsPanel}
 */
anychart.chartEditor2Module.DataLabelsPanel = function(model, opt_domHelper) {
  anychart.chartEditor2Module.DataLabelsPanel.base(this, 'constructor', model, opt_domHelper);

  this.name_ = 'Data Labels';
};
goog.inherits(anychart.chartEditor2Module.DataLabelsPanel, anychart.chartEditor2Module.SettingsPanel);


/** @inheritDoc */
anychart.chartEditor2Module.DataLabelsPanel.prototype.createDom = function() {
  anychart.chartEditor2Module.DataLabelsPanel.base(this, 'createDom');
};
