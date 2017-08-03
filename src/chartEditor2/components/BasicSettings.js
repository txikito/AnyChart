goog.provide('anychart.chartEditor2Module.BasicSettings');

goog.require('anychart.chartEditor2Module.Component');
goog.require('anychart.chartEditor2Module.controls.Checkbox');
goog.require('anychart.chartEditor2Module.controls.Input');
goog.require('anychart.chartEditor2Module.controls.Select');
goog.require('anychart.chartEditor2Module.controls.SelectPalettes');
goog.require('anychart.chartEditor2Module.EditorModel');


/**
 * Chart widget.
 * @param {anychart.chartEditor2Module.Editor} editor
 * @constructor
 * @extends {anychart.chartEditor2Module.Component}
 */
anychart.chartEditor2Module.BasicSettings = function(editor) {
  anychart.chartEditor2Module.BasicSettings.base(this, 'constructor');

  /**
   * @type {anychart.chartEditor2Module.Editor}
   * @private
   */
  this.editor_ = editor;
};
goog.inherits(anychart.chartEditor2Module.BasicSettings, anychart.chartEditor2Module.Component);


/** @inheritDoc */
anychart.chartEditor2Module.BasicSettings.prototype.createDom = function() {
  goog.base(this, 'createDom');

  goog.dom.classlist.add(this.getElement(), 'settings-panel');
  goog.dom.classlist.add(this.getElement(), 'basic-settings');
  var dom = this.getDomHelper();

  this.themeSelect = new anychart.chartEditor2Module.controls.Select("-- Choose theme --");
  this.paletteSelect = new anychart.chartEditor2Module.controls.SelectPalettes("-- Choose palette --");
  this.addChild(this.themeSelect, true);
  this.addChild(this.paletteSelect, true);
  this.getElement().appendChild(dom.createDom(goog.dom.TagName.DIV, 'fields-row', this.themeSelect.getElement(), this.paletteSelect.getElement()));


  this.titleEnabled = new anychart.chartEditor2Module.controls.Checkbox();
  this.titleText = new anychart.chartEditor2Module.controls.Input();
  this.addChild(this.titleEnabled, true);
  this.addChild(this.titleText, true);
  this.getElement().appendChild(dom.createDom(goog.dom.TagName.DIV, 'fields-row', [this.titleEnabled.getElement(), this.titleText.getElement()]));
};


anychart.chartEditor2Module.BasicSettings.prototype.update = function() {
  var self = this;
  this.getHandler().listenOnce(this.editor_, anychart.chartEditor2Module.events.EventType.CHART_DRAW,
      function(evt) {
        var themes = goog.object.filter(goog.dom.getWindow()['anychart']['themes'], function(item) {
          return item['palette'];
        });

        this.themeSelect.setOptions(goog.object.getKeys(themes), 'defaultTheme');
        this.themeSelect.setEditorModel(self.editor_.getModel(), [['anychart'], 'theme()'], 'setTheme', goog.dom.getWindow()['anychart']);

        var realPalettes = goog.dom.getWindow()['anychart']['palettes'];
        var paletteNames = [];
        for (var paletteName in realPalettes) {
          if (realPalettes.hasOwnProperty(paletteName) && goog.isArray(realPalettes[paletteName])) {
            paletteNames.push(paletteName);
          }
        }
        this.paletteSelect.setOptions(paletteNames, 'defaultPalette');
        this.paletteSelect.setEditorModel(self.editor_.getModel(), [['chart'], ['settings'], 'palette()'], void 0, evt.chart);

        this.titleEnabled.setEditorModel(self.editor_.getModel(), [['chart'], ['settings'], 'title().enabled()'], void 0, evt.chart);
        this.titleText.setEditorModel(self.editor_.getModel(), [['chart'], ['settings'], 'title().text()'], void 0, evt.chart);
      });
};


anychart.chartEditor2Module.BasicSettings.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.update();

  this.getHandler().listen(this.editor_.getModel(), anychart.chartEditor2Module.events.EventType.EDITOR_MODEL_UPDATE, this.update);
};