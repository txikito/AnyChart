goog.provide('anychart.chartEditor2Module.BasicSettings');

goog.require('anychart.chartEditor2Module.Component');
goog.require('anychart.chartEditor2Module.controls.Checkbox');
goog.require('anychart.chartEditor2Module.controls.Input');
goog.require('anychart.chartEditor2Module.controls.Select');
goog.require('anychart.chartEditor2Module.controls.SelectPalettes');
goog.require('anychart.chartEditor2Module.EditorModel');
goog.require('anychart.chartEditor2Module.DataModel');



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
  this.editor_  = editor;
};
goog.inherits(anychart.chartEditor2Module.BasicSettings, anychart.chartEditor2Module.Component);



/** @inheritDoc */
anychart.chartEditor2Module.BasicSettings.prototype.createDom = function() {
  goog.base(this, 'createDom');

  goog.dom.classlist.add(this.getElement(), 'settings-panel');
  goog.dom.classlist.add(this.getElement(), 'basic-settings');
  // var dom = this.getDomHelper();

  this.themeSelect = new anychart.chartEditor2Module.controls.Select("Theme");
  this.addChild(this.themeSelect, true);

  this.paletteSelect = new anychart.chartEditor2Module.controls.SelectPalettes("Palette");
  this.addChild(this.paletteSelect, true);

  this.titleEnabled = new anychart.chartEditor2Module.controls.Checkbox();
  this.addChild(this.titleEnabled, true);

  this.titleText = new anychart.chartEditor2Module.controls.Input();
  this.addChild(this.titleText, true);
};


anychart.chartEditor2Module.BasicSettings.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  var self = this;
  this.getHandler().listenOnce(this.editor_, anychart.chartEditor2Module.events.EventType.CHART_DRAW, function(evt){
    var chart = evt.chart;
    var themes = goog.object.filter(goog.dom.getWindow()['anychart']['themes'], function(item){
      return item['palette'];
    });

    this.themeSelect.setOptions(goog.object.getKeys(themes), 'defaultTheme');
    this.themeSelect.setEditorModel(self.editor_.getEditorModel(), [['anychart'], 'theme()'], goog.dom.getWindow()['anychart']);

    this.paletteSelect.setOptions([
        'defaultPalette',
        'earth',
        'monochrome',
        'provence'
    ], 'defaultPalette');
    this.paletteSelect.setEditorModel(self.editor_.getEditorModel(), [['chart'], 'palette()'], chart);

    this.titleEnabled.setEditorModel(self.editor_.getEditorModel(), [['chart'], 'title().enabled()'], chart);
    this.titleText.setEditorModel(self.editor_.getEditorModel(), [['chart'], 'title().text()'], chart);
  });
};