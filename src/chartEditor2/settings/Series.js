goog.provide('anychart.chartEditor2Module.settings.Series');

goog.require('anychart.chartEditor2Module.SettingsPanel');
goog.require('anychart.chartEditor2Module.colorPicker.Base');
goog.require('anychart.chartEditor2Module.input.Base');
goog.require('anychart.chartEditor2Module.settings.DataMarkers');
goog.require('anychart.chartEditor2Module.settings.Stroke');
goog.require('anychart.chartEditor2Module.settings.Title');



/**
 * @param {anychart.chartEditor2Module.EditorModel} model
 * @param {string|number} seriesId
 * @param {number=} opt_plotIndex
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper; see {@link goog.ui.Component} for semantics.
 * @constructor
 * @extends {anychart.chartEditor2Module.SettingsPanel}
 */
anychart.chartEditor2Module.settings.Series = function(model, seriesId, opt_plotIndex, opt_domHelper) {
  anychart.chartEditor2Module.settings.Series.base(this, 'constructor', model, opt_domHelper);
  this.name = null;
  this.seriesId_ = String(seriesId);

  var stringKey = 'getSeries(\'' + this.seriesId_ + '\')';
  if (goog.isDef(opt_plotIndex)) {
    this.plotIndex_ = opt_plotIndex;
    stringKey = 'plot(' + this.plotIndex_ + ').' + stringKey;
  }

  this.key = [['chart'], ['settings'], stringKey];
};
goog.inherits(anychart.chartEditor2Module.settings.Series, anychart.chartEditor2Module.SettingsPanel);


/**
 * Default CSS class.
 * @type {string}
 */
anychart.chartEditor2Module.settings.Series.CSS_CLASS = goog.getCssName('settings-series');


/** @override */
anychart.chartEditor2Module.settings.Series.prototype.createDom = function() {
  anychart.chartEditor2Module.settings.Series.base(this, 'createDom');

  var element = this.getElement();
  goog.dom.classlist.add(element, anychart.chartEditor2Module.settings.Series.CSS_CLASS);

  var content = this.getContentElement();
  var model = /** @type {anychart.chartEditor2Module.EditorModel} */(this.getModel());

  var nameInput = new anychart.chartEditor2Module.input.Base('Series name');
  this.addChild(nameInput, true);
  goog.dom.classlist.add(nameInput.getElement(), goog.getCssName('anychart-chart-editor-series-name-input'));

  var colorPicker = new anychart.chartEditor2Module.colorPicker.Base();
  colorPicker.addClassName(goog.getCssName('anychart-chart-editor-settings-control-right'));
  this.addChild(colorPicker, true);

  goog.dom.appendChild(content, goog.dom.createDom(
      goog.dom.TagName.DIV,
      goog.getCssName('anychart-chart-editor-settings-item-gap')));

  // Stroke
  var stroke = new anychart.chartEditor2Module.settings.Stroke(model);
  stroke.setKey(this.genKey('stroke()'));
  this.addChild(stroke, true);

  goog.dom.appendChild(content, goog.dom.createDom(
      goog.dom.TagName.DIV,
      goog.getCssName('anychart-chart-editor-settings-item-gap')));

  // Data labels
  var dataLabels = new anychart.chartEditor2Module.settings.Title(model, 'Data labels');
  dataLabels.allowEnabled(true);
  dataLabels.allowEditPosition(false);
  dataLabels.allowEditAlign(false);
  dataLabels.setTitleKey('format()');
  dataLabels.setKey(this.genKey('labels()'));
  this.addChild(dataLabels, true);

  goog.dom.appendChild(content, goog.dom.createDom(
      goog.dom.TagName.DIV,
      goog.getCssName('anychart-chart-editor-settings-item-gap')));

  // Data markers
  var dataMarkers = new anychart.chartEditor2Module.settings.DataMarkers(model, 'Data markers');
  dataMarkers.allowEnabled(true);
  dataMarkers.setKey(this.genKey('markers()'));
  this.addChild(dataMarkers, true);

  this.nameInput_ = nameInput;
  this.colorPicker_ = colorPicker;
  this.stroke_ = stroke;
  this.dataLabels_ = dataLabels;
  this.dataMarkers_ = dataMarkers;

  this.updateKeys();
};


/**
 * Update model keys.
 */
anychart.chartEditor2Module.settings.Series.prototype.updateKeys = function() {
  var model = /** @type {anychart.chartEditor2Module.EditorModel} */(this.getModel());
  this.nameInput_.init(model, this.genKey('name()'));
  this.colorPicker_.init(model, this.genKey('color()'));

  this.stroke_.setKey(this.genKey('stroke()'));
  this.dataLabels_.setKey(this.genKey('labels()'));
  this.dataMarkers_.setKey(this.genKey('markers()'));
};


/** @inheritDoc */
anychart.chartEditor2Module.settings.Series.prototype.onChartDraw = function(evt) {
  anychart.chartEditor2Module.settings.Series.base(this, 'onChartDraw', evt);

  var target = evt.chart;
  this.nameInput_.setValueByTarget(target, true);
  this.colorPicker_.setValueByTarget(target);
};


/** @override */
anychart.chartEditor2Module.settings.Series.prototype.disposeInternal = function() {
  this.nameInput_ = null;
  this.colorPicker_ = null;

  this.stroke_.dispose();
  this.stroke_ = null;

  this.dataLabels_.dispose();
  this.dataLabels_ = null;

  this.dataMarkers_.dispose();
  this.dataMarkers_ = null;

  anychart.chartEditor2Module.settings.Series.base(this, 'disposeInternal');
};