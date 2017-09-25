goog.provide('anychart.chartEditor2Module.settings.Axis');

goog.require('anychart.chartEditor2Module.IconButtonRenderer');
goog.require('anychart.chartEditor2Module.SettingsPanel');



/**
 * @param {anychart.chartEditor2Module.EditorModel} model
 * @param {string} xOrY
 * @param {number} index
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper; see {@link goog.ui.Component} for semantics.
 * @constructor
 * @extends {anychart.chartEditor2Module.SettingsPanel}
 */
anychart.chartEditor2Module.settings.Axis = function(model, xOrY, index, opt_domHelper) {
  anychart.chartEditor2Module.settings.Axis.base(this, 'constructor', model, opt_domHelper);
  this.xOrY_ = xOrY;
  this.index_ = index;
  this.name = this.xOrY_ + 'Axis(' + this.index_ + ')';
  this.key = [['chart'], ['settings'], this.xOrY_ + 'Axis(' + this.index_ + ')'];
};
goog.inherits(anychart.chartEditor2Module.settings.Axis, anychart.chartEditor2Module.SettingsPanel);


/**
 * Default CSS class.
 * @type {string}
 */
anychart.chartEditor2Module.settings.Axis.CSS_CLASS = goog.getCssName('settings-axis');


/** @override */
anychart.chartEditor2Module.settings.Axis.prototype.createDom = function() {
  anychart.chartEditor2Module.settings.Axis.base(this, 'createDom');

  var element = this.getElement();
  goog.dom.classlist.add(element, anychart.chartEditor2Module.settings.Axis.CSS_CLASS);
  goog.dom.classlist.add(element, this.index_ % 2 ? 'even' : 'odd');

  // var content = this.getContentElement();
  // var model = /** @type {anychart.chartEditor2Module.EditorModel} */(this.getModel());

//   var nameInput = new anychart.chartEditor2Module.input.Base('Series name');
//   this.addChild(nameInput, true);
//   goog.dom.classlist.add(nameInput.getElement(), goog.getCssName('anychart-chart-editor-series-name-input'));
//
//   var colorPicker = new anychart.chartEditor2Module.colorPicker.Base();
//   colorPicker.addClassName(goog.getCssName('anychart-chart-editor-settings-control-right'));
//   this.addChild(colorPicker, true);
//
//   goog.dom.appendChild(content, goog.dom.createDom(
//       goog.dom.TagName.DIV,
//       goog.getCssName('anychart-chart-editor-settings-item-gap')));
//
//   // Stroke
//   var stroke = new anychart.chartEditor2Module.settings.Stroke(model);
//   // stroke.setKey(this.genKey('stroke()'));
//   this.addChild(stroke, true);
//
//   goog.dom.appendChild(content, goog.dom.createDom(
//       goog.dom.TagName.DIV,
//       goog.getCssName('anychart-chart-editor-settings-item-gap')));
//
//   // Tooltip
//   var tooltip = new anychart.chartEditor2Module.settings.Title(model, 'Tooltip');
//   tooltip.allowEnabled(true);
//   tooltip.allowEditPosition(false);
//   tooltip.allowEditAlign(false);
//   tooltip.setTitleKey('format()');
//   tooltip.setKey(this.genKey('tooltip()')); // This is for enabled working sake!
//   this.addChild(tooltip, true);
//
//   goog.dom.appendChild(content, goog.dom.createDom(
//       goog.dom.TagName.DIV,
//       goog.getCssName('anychart-chart-editor-settings-item-gap')));
//
//
//   // Data labels
//   var dataLabels = new anychart.chartEditor2Module.settings.Title(model, 'Data labels');
//   dataLabels.allowEnabled(true);
//   dataLabels.allowEditPosition(false);
//   dataLabels.allowEditAlign(false);
//   dataLabels.setTitleKey('format()');
//   dataLabels.setKey(this.genKey('labels()')); // This is for enabled working sake!
//   this.addChild(dataLabels, true);
//
//   goog.dom.appendChild(content, goog.dom.createDom(
//       goog.dom.TagName.DIV,
//       goog.getCssName('anychart-chart-editor-settings-item-gap')));
//
//   // Data markers
//   var dataMarkers = new anychart.chartEditor2Module.settings.DataMarkers(model, 'Data markers');
//   dataMarkers.allowEnabled(true);
//   this.addChild(dataMarkers, true);
//
//   this.nameInput_ = nameInput;
//   this.colorPicker_ = colorPicker;
//   this.stroke_ = stroke;
//   this.tooltip_ = tooltip;
//   this.dataLabels_ = dataLabels;
//   this.dataMarkers_ = dataMarkers;
};


/** @inheritDoc */
anychart.chartEditor2Module.settings.Axis.prototype.onRemoveAction = function(evt) {
  var model = /** @type {anychart.chartEditor2Module.EditorModel} */(this.getModel());
  model.dropAxis(this.xOrY_, this.index_);
};



// /** @inheritDoc */
// anychart.chartEditor2Module.settings.Axis.prototype.updateKeys = function() {
//   if (!this.isExcluded()) {
//     var stringKey = 'getSeries(\'' + this.AxisId_ + '\')';
//     if (goog.isDef(this.plotIndex_)) {
//       stringKey = 'plot(' + this.plotIndex_ + ').' + stringKey;
//     }
//     this.key = [['chart'], ['settings'], stringKey];
//
//     var model = /** @type {anychart.chartEditor2Module.EditorModel} */(this.getModel());
//     if (this.nameInput_) this.nameInput_.init(model, this.genKey('name()'));
//     if (this.colorPicker_) this.colorPicker_.init(model, this.genKey('color()'));
//
//     if (this.stroke_) this.stroke_.setKey(this.genKey('stroke()'));
//     if (this.tooltip_) this.tooltip_.setKey(this.genKey('tooltip()'));
//     if (this.dataLabels_) this.dataLabels_.setKey(this.genKey('labels()'));
//     if (this.dataMarkers_) this.dataMarkers_.setKey(this.genKey('markers()'));
//   }
//
//   anychart.chartEditor2Module.settings.Axis.base(this, 'updateKeys');
// };
//
//
// /** @inheritDoc */
// anychart.chartEditor2Module.settings.Axis.prototype.onChartDraw = function(evt) {
//   anychart.chartEditor2Module.settings.Axis.base(this, 'onChartDraw', evt);
//   if (this.isExcluded()) return;
//
//   var target = evt.chart;
//   this.nameInput_.setValueByTarget(target, true);
//   this.colorPicker_.setValueByTarget(target);
// };
//
//
// /** @override */
// anychart.chartEditor2Module.settings.Axis.prototype.disposeInternal = function() {
//   this.nameInput_ = null;
//   this.colorPicker_ = null;
//
//   this.stroke_.dispose();
//   this.stroke_ = null;
//
//   this.tooltip_.dispose();
//   this.tooltip_ = null;
//
//   this.dataLabels_.dispose();
//   this.dataLabels_ = null;
//
//   this.dataMarkers_.dispose();
//   this.dataMarkers_ = null;
//
//   anychart.chartEditor2Module.settings.Axis.base(this, 'disposeInternal');
// };