goog.provide('anychart.chartEditor2Module.DataLabelsPanel');

goog.require('anychart.chartEditor2Module.SettingsPanel');
goog.require('anychart.chartEditor2Module.settings.Title');



/**
 * @param {anychart.chartEditor2Module.EditorModel} model
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper; see {@link goog.ui.Component} for semantics.
 * @constructor
 * @extends {anychart.chartEditor2Module.SettingsPanel}
 */
anychart.chartEditor2Module.DataLabelsPanel = function(model, opt_domHelper) {
  anychart.chartEditor2Module.DataLabelsPanel.base(this, 'constructor', model, opt_domHelper);

  this.name = 'Data Labels';

  this.key = [['chart'], ['settings'], 'labels()'];
};
goog.inherits(anychart.chartEditor2Module.DataLabelsPanel, anychart.chartEditor2Module.SettingsPanel);


/** @inheritDoc */
anychart.chartEditor2Module.DataLabelsPanel.prototype.createDom = function() {
  anychart.chartEditor2Module.DataLabelsPanel.base(this, 'createDom');

  var model = /** @type {anychart.chartEditor2Module.EditorModel} */(this.getModel());
  var title = new anychart.chartEditor2Module.settings.Title(model);
  title.allowEnabled(false);
  title.allowEditPosition(false);
  title.allowEditAlign(false);
  title.setTitleKey('format()');
  title.setKey([['chart'], ['settings'], 'labels()']);
  this.addChild(title, true);

  this.title_ = title;

};


// /**
//  * @param {Object} chart
//  * @return {anychart.chartEditor2Module.EditorModel.Key}
//  * @private
//  */
// anychart.chartEditor2Module.DataLabelsPanel.prototype.getDataLabelsKey_ = function(chart) {
//   var seriesCount = chart['getSeriesCount']();
//   var keys = [];
//   for (var i = 0; i < seriesCount; i++) {
//     keys.push(goog.string.subs('chart.getSeriesAt(%s).labels()', i));
//   }
//   return keys;
// };


/** @override */
anychart.chartEditor2Module.DataLabelsPanel.prototype.disposeInternal = function() {
  this.title_ = null;

  anychart.chartEditor2Module.DataLabelsPanel.base(this, 'disposeInternal');
};