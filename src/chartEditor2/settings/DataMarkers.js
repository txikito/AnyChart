goog.provide('anychart.chartEditor2Module.settings.DataMarkers');

goog.require('anychart.chartEditor2Module.SettingsPanel');
goog.require('anychart.chartEditor2Module.colorPicker.Base');
goog.require('anychart.chartEditor2Module.comboBox.Base');
goog.require('anychart.chartEditor2Module.input.Base');
goog.require('anychart.chartEditor2Module.select.Base');
goog.require('anychart.chartEditor2Module.settings.Title');
goog.require('anychart.enums');



/**
 * @param {anychart.chartEditor2Module.EditorModel} model
 * @param {string|number} seriesId
 * @param {number=} opt_plotIndex
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper; see {@link goog.ui.Component} for semantics.
 * @constructor
 * @extends {anychart.chartEditor2Module.SettingsPanel}
 */
anychart.chartEditor2Module.settings.DataMarkers = function(model, seriesId, opt_plotIndex, opt_domHelper) {
  anychart.chartEditor2Module.settings.DataMarkers.base(this, 'constructor', model, opt_domHelper);
  this.name = 'Data markers';
  this.seriesId_ = String(seriesId);

  var stringKey = 'getSeries(\'' + this.seriesId_ + '\')';
  if (goog.isDef(opt_plotIndex)) {
    this.plotIndex_ = opt_plotIndex;
    stringKey = 'plot(' + this.plotIndex_ + ').' + stringKey;
  }

  this.key = [['chart'], ['settings'], stringKey];
};
goog.inherits(anychart.chartEditor2Module.settings.DataMarkers, anychart.chartEditor2Module.SettingsPanel);


/**
 * Default CSS class.
 * @type {string}
 */
anychart.chartEditor2Module.settings.DataMarkers.CSS_CLASS = goog.getCssName('settings-data-markers');


/** @override */
anychart.chartEditor2Module.settings.DataMarkers.prototype.createDom = function() {
  anychart.chartEditor2Module.settings.DataMarkers.base(this, 'createDom');

  var element = this.getElement();
  goog.dom.classlist.add(element, anychart.chartEditor2Module.settings.DataMarkers.CSS_CLASS);

  //var content = this.getContentElement();
  // var model = /** @type {anychart.chartEditor2Module.EditorModel} */(this.getModel());

  // var typeLabel = goog.dom.createDom(
  //     goog.dom.TagName.LABEL,
  //     [
  //       goog.ui.INLINE_BLOCK_CLASSNAME,
  //       goog.getCssName('settings-label')
  //     ],
  //     'Type');
  // goog.dom.appendChild(content, typeLabel);
  // this.typeLabel_ = typeLabel;

  var typeSelect = new anychart.chartEditor2Module.select.Base('Type');
  typeSelect.setOptions(goog.object.getValues(anychart.enums.MarkerType));
  typeSelect.updateOptions();
  this.addChild(typeSelect, true);
  this.typeSelect_ = typeSelect;
  // typeSelect.addClassName(goog.getCssName('anychart-chart-editor-settings-control-right'));

  var fillSelect = new anychart.chartEditor2Module.colorPicker.Base();
  fillSelect.addClassName(goog.getCssName('marker-fill'));
  this.addChild(fillSelect, true);
  this.fillSelect_ = fillSelect;

  var sizeSelect = new anychart.chartEditor2Module.comboBox.Base();
  sizeSelect.setOptions([6, 10, 12, 15]);
  this.addChild(sizeSelect, true);
  goog.dom.classlist.add(sizeSelect.getElement(), goog.getCssName('size'));
  this.sizeSelect_ = sizeSelect;

  this.updateKeys();
};


/**
 * Update model keys.
 */
anychart.chartEditor2Module.settings.DataMarkers.prototype.updateKeys = function() {
  var model = /** @type {anychart.chartEditor2Module.EditorModel} */(this.getModel());
  if (this.typeSelect_) this.typeSelect_.init(model, this.genKey('type()'));
  if (this.fillSelect_) this.fillSelect_.init(model, this.genKey('fill()'));
  if (this.sizeSelect_) this.sizeSelect_.init(model, this.genKey('size()'));
};


/** @inheritDoc */
anychart.chartEditor2Module.settings.DataMarkers.prototype.onChartDraw = function(evt) {
  anychart.chartEditor2Module.settings.DataMarkers.base(this, 'onChartDraw', evt);

  var target = evt.chart;
  this.typeSelect_.setValueByTarget(target);
  this.fillSelect_.setValueByTarget(target);
  this.sizeSelect_.setValueByTarget(target);
};


/** @override */
anychart.chartEditor2Module.settings.DataMarkers.prototype.disposeInternal = function() {
  this.typeSelect_ = null;
  this.fillSelect_ = null;
  this.sizeSelect_ = null;

  anychart.chartEditor2Module.settings.DataMarkers.base(this, 'disposeInternal');
};

/** @inheritDoc */
anychart.chartEditor2Module.settings.DataMarkers.prototype.setContentEnabled = function(enabled) {
  anychart.chartEditor2Module.settings.DataMarkers.base(this, 'setContentEnabled', enabled);
  // if (this.typeLabel_)
  //   goog.dom.classlist.enable(goog.asserts.assert(this.typeLabel_), goog.getCssName('anychart-control-disabled'), !enabled);

};