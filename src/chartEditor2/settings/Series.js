goog.provide('anychart.chartEditor2Module.settings.Series');

goog.require('anychart.chartEditor2Module.SettingsPanel');
goog.require('anychart.chartEditor2Module.colorPicker.Base');
goog.require('anychart.chartEditor2Module.input.Base');



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

  // Data labels
  var dataLabels = new anychart.chartEditor2Module.settings.Title(model, 'Data labels');
  dataLabels.allowEnabled(true);
  dataLabels.allowEditPosition(false);
  dataLabels.allowEditAlign(false);
  dataLabels.setTitleKey('format()');
  dataLabels.setKey(this.genKey('labels()'));
  this.addChild(dataLabels, true);

  this.nameInput_ = nameInput;
  this.colorPicker_ = colorPicker;
  this.dataLabels_ = dataLabels;

  this.updateKeys();
};


/**
 * Update model keys.
 */
anychart.chartEditor2Module.settings.Series.prototype.updateKeys = function() {
  var model = /** @type {anychart.chartEditor2Module.EditorModel} */(this.getModel());
  if (this.nameInput_) this.nameInput_.init(model, this.genKey('name()'));
  if (this.colorPicker_) this.colorPicker_.init(model, this.genKey('color()'));
  if (this.dataLabels_) this.dataLabels_.setKey(this.genKey('labels()'));

  // if (this.typeSelect_) this.typeSelect_.setKey(this.genKey('seriesType()'));
  // if (this.mappingSelect_) this.mappingSelect_.setMappingId(this.seriesId_);
  // if (this.markersEnabled_) this.markersEnabled_.setKey(this.genKey('markers().enabled()'));
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

  this.dataLabels_.dispose();
  this.dataLabels_ = null;

  anychart.chartEditor2Module.settings.Series.base(this, 'disposeInternal');
};