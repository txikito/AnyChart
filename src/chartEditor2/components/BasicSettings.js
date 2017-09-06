goog.provide('anychart.chartEditor2Module.BasicSettings');

goog.require('anychart.chartEditor2Module.Component');
goog.require('anychart.chartEditor2Module.EditorModel');
goog.require('anychart.chartEditor2Module.controls.Checkbox');
goog.require('anychart.chartEditor2Module.controls.Input');
goog.require('anychart.chartEditor2Module.controls.Select');
goog.require('anychart.chartEditor2Module.controls.SelectPalettes');



/**
 * Basic setting widget.
 *
 * @param {anychart.chartEditor2Module.Editor} editor
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper; see {@link goog.ui.Component} for semantics.
 * @constructor
 * @extends {anychart.chartEditor2Module.Component}
 */
anychart.chartEditor2Module.BasicSettings = function(editor, opt_domHelper) {
  anychart.chartEditor2Module.BasicSettings.base(this, 'constructor', opt_domHelper);

  /**
   * @type {anychart.chartEditor2Module.Editor}
   * @private
   */
  this.editor_ = editor;

  /**
   * @type {Array.<anychart.chartEditor2Module.controls.Input>}
   * @private
   */
  this.seriesNames_ = [];
};
goog.inherits(anychart.chartEditor2Module.BasicSettings, anychart.chartEditor2Module.Component);


/** @inheritDoc */
anychart.chartEditor2Module.BasicSettings.prototype.createDom = function() {
  anychart.chartEditor2Module.BasicSettings.base(this, 'createDom');

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

  // Series names
  this.seriesNamesContainer = dom.createDom(goog.dom.TagName.DIV, 'fields-row series-names',
      dom.createDom(goog.dom.TagName.H4, null, 'Series names'));
  this.getElement().appendChild(this.seriesNamesContainer);
};


/** @inheritDoc */
anychart.chartEditor2Module.BasicSettings.prototype.update = function() {
  var self = this;
  var model = /** @type {anychart.chartEditor2Module.EditorModel} */(self.editor_.getModel());

  this.getHandler().listenOnce(this.editor_, anychart.chartEditor2Module.events.EventType.CHART_DRAW,
      function(evt) {
        if (evt.rebuild) {
          var themes = goog.object.filter(goog.dom.getWindow()['anychart']['themes'], function(item) {
            return item['palette'];
          });

          this.themeSelect.setOptions(goog.object.getKeys(themes), 'defaultTheme');
          this.themeSelect.setEditorModel(model, [['anychart'], 'theme()'], 'setTheme', goog.dom.getWindow()['anychart']);

          var realPalettes = goog.dom.getWindow()['anychart']['palettes'];
          var paletteNames = [];
          for (var paletteName in realPalettes) {
            if (realPalettes.hasOwnProperty(paletteName) && goog.isArray(realPalettes[paletteName])) {
              paletteNames.push(paletteName);
            }
          }

          var chartType = model.getValue([['chart'], 'type']);
          if (chartType == 'stock') {
            this.paletteSelect.hide();
          } else {
            this.paletteSelect.show();
            this.paletteSelect.setOptions(paletteNames, 'defaultPalette');
            this.paletteSelect.setEditorModel(model, [['chart'], ['settings'], 'palette()'], void 0, evt.chart);
          }

          this.titleEnabled.setEditorModel(model, [['chart'], ['settings'], 'title().enabled()'], void 0, evt.chart, true);
          this.titleText.setEditorModel(model, [['chart'], ['settings'], 'title().text()'], void 0, evt.chart, true);

          // Series names
          this.removeSeriesNames_();
          var mappings = model.getValue([['dataSettings'], 'mappings']);
          for (var i = 0; i < mappings.length; i++) {
            for (var j = 0; j < mappings[i].length; j++) {
              var keyStr = chartType == 'stock' ? 'plot(' + i + ').' : '';
              keyStr += 'getSeries(' + mappings[i][j]['id'] + ').name()';
              var key = [['chart'], ['settings'], keyStr];
              var input = new anychart.chartEditor2Module.controls.Input();
              this.addChild(input, true);
              this.seriesNamesContainer.appendChild(input.getElement());
              input.setEditorModel(model, key, void 0, evt.chart, true);
              this.seriesNames_.push(input);
            }
          }
        }
      });
};


/** @inheritDoc */
anychart.chartEditor2Module.BasicSettings.prototype.enterDocument = function() {
  anychart.chartEditor2Module.BasicSettings.base(this, 'enterDocument');

  this.update();
  this.getHandler().listen(/** @type {anychart.chartEditor2Module.EditorModel} */(this.editor_.getModel()),
      anychart.chartEditor2Module.events.EventType.EDITOR_MODEL_UPDATE, this.update);
};


/**
 * Removes series names inputs.
 * @private
 */
anychart.chartEditor2Module.BasicSettings.prototype.removeSeriesNames_ = function() {
  for (var i = 0; i < this.seriesNames_.length; i++) {
    this.removeChild(this.seriesNames_[i], true);
    this.seriesNames_[i].dispose();
  }
  this.seriesNames_.length = 0;
};