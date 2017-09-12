goog.provide('anychart.chartEditor2Module.BasicSettings');

goog.require('anychart.chartEditor2Module.ComponentWithKey');
goog.require('anychart.chartEditor2Module.EditorModel');
goog.require('anychart.chartEditor2Module.checkbox.Base');
goog.require('anychart.chartEditor2Module.input.Base');
goog.require('anychart.chartEditor2Module.select.Base');
goog.require('anychart.chartEditor2Module.select.Palettes');



/**
 * Basic setting widget.
 *
 * @param {anychart.chartEditor2Module.EditorModel} model
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper; see {@link goog.ui.Component} for semantics.
 * @constructor
 * @extends {anychart.chartEditor2Module.ComponentWithKey}
 */
anychart.chartEditor2Module.BasicSettings = function(model, opt_domHelper) {
  anychart.chartEditor2Module.BasicSettings.base(this, 'constructor', model, opt_domHelper);
};
goog.inherits(anychart.chartEditor2Module.BasicSettings, anychart.chartEditor2Module.ComponentWithKey);


/** @inheritDoc */
anychart.chartEditor2Module.BasicSettings.prototype.createDom = function() {
  anychart.chartEditor2Module.BasicSettings.base(this, 'createDom');

  goog.dom.classlist.add(this.getElement(), 'settings-panel');
  goog.dom.classlist.add(this.getElement(), 'basic-settings');
  var dom = this.getDomHelper();

  var model = /** @type {anychart.chartEditor2Module.EditorModel} */(this.getModel());
  var themes = goog.object.filter(goog.dom.getWindow()['anychart']['themes'], function(item) {
    return item['palette'];
  });
  this.themeSelect = new anychart.chartEditor2Module.select.Base("-- Choose theme --");
  this.themeSelect.setOptions(goog.object.getKeys(themes));
  this.themeSelect.updateOptions();
  this.themeSelect.init(model, [['anychart'], 'theme()'], 'setTheme');
  this.addChild(this.themeSelect, true);

  var realPalettes = goog.dom.getWindow()['anychart']['palettes'];
  var paletteNames = [];
  for (var paletteName in realPalettes) {
    if (realPalettes.hasOwnProperty(paletteName) && goog.isArray(realPalettes[paletteName])) {
      paletteNames.push(paletteName);
    }
  }
  this.paletteSelect = new anychart.chartEditor2Module.select.Palettes("-- Choose palette --");
  this.paletteSelect.setOptions(paletteNames);
  this.paletteSelect.updateOptions('defaultPalette');
  this.paletteSelect.init(model, [['chart'], ['settings'], 'palette()']);
  this.addChild(this.paletteSelect, true);

  this.getElement().appendChild(dom.createDom(goog.dom.TagName.DIV, 'fields-row', this.themeSelect.getElement(), this.paletteSelect.getElement()));

  this.titleEnabled = new anychart.chartEditor2Module.checkbox.Base();
  this.titleEnabled.init(model, [['chart'], ['settings'], 'title().enabled()']);
  this.addChild(this.titleEnabled, true);

  this.titleText = new anychart.chartEditor2Module.input.Base();
  this.titleText.init(model, [['chart'], ['settings'], 'title().text()']);
  this.addChild(this.titleText, true);

  this.getElement().appendChild(dom.createDom(goog.dom.TagName.DIV, 'fields-row', [this.titleEnabled.getElement(), this.titleText.getElement()]));
};


/** @inheritDoc */
anychart.chartEditor2Module.BasicSettings.prototype.onChartDraw = function(evt) {
  var model = /** @type {anychart.chartEditor2Module.EditorModel} */(this.getModel());

  if (evt.rebuild) {
    this.themeSelect.setValueByTarget(goog.dom.getWindow()['anychart']);

    var chartType = model.getValue([['chart'], 'type']);
    if (chartType == 'stock') {
      this.paletteSelect.hide();
    } else {
      this.paletteSelect.setValueByTarget(evt.chart);
      this.paletteSelect.show();
    }

    this.titleEnabled.setValueByTarget(evt.chart);
    this.titleText.setValueByTarget(evt.chart);
  }
};
