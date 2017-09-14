goog.provide('anychart.chartEditor2Module.LegendPanel');

goog.require('anychart.chartEditor2Module.SettingsPanel');
goog.require('anychart.chartEditor2Module.select.Base');
goog.require('anychart.chartEditor2Module.settings.LegendAppearance');
goog.require('anychart.chartEditor2Module.settings.Title');



/**
 * @param {anychart.chartEditor2Module.EditorModel} model
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper; see {@link goog.ui.Component} for semantics.
 * @constructor
 * @extends {anychart.chartEditor2Module.SettingsPanel}
 */
anychart.chartEditor2Module.LegendPanel = function(model, opt_domHelper) {
  anychart.chartEditor2Module.LegendPanel.base(this, 'constructor', model, opt_domHelper);

  this.name = 'Legend';

  this.key = [['chart'], ['settings'], 'legend()'];
};
goog.inherits(anychart.chartEditor2Module.LegendPanel, anychart.chartEditor2Module.SettingsPanel);


/** @inheritDoc */
anychart.chartEditor2Module.LegendPanel.prototype.createDom = function() {
  anychart.chartEditor2Module.LegendPanel.base(this, 'createDom');

  var content = this.getContentElement();
  var model = /** @type {anychart.chartEditor2Module.EditorModel} */(this.getModel());

  var appearance = new anychart.chartEditor2Module.settings.LegendAppearance(model, 'Appearance');
  this.addChild(appearance, true);

  goog.dom.appendChild(content, goog.dom.createDom(
      goog.dom.TagName.DIV,
      goog.getCssName('anychart-chart-editor-settings-item-gap')));

  var title = new anychart.chartEditor2Module.settings.Title(model, 'Title');
  title.setPositionKey('orientation()');
  title.setKey([['chart'], ['settings'], 'legend().title()']);
  this.addChild(title, true);

  this.title_ = title;
};


/** @override */
anychart.chartEditor2Module.LegendPanel.prototype.disposeInternal = function() {
  this.title_ = null;
  anychart.chartEditor2Module.LegendPanel.base(this, 'disposeInternal');
};
