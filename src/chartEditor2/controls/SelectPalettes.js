goog.provide('anychart.chartEditor2Module.controls.SelectPalettes');

goog.require('anychart.chartEditor2Module.controls.Select');



/**
 * Overrides control to work with EditorModel.
 * @constructor
 * @extends {anychart.chartEditor2Module.controls.Select}
 */
anychart.chartEditor2Module.controls.SelectPalettes = function(opt_caption, opt_menu, opt_renderer, opt_domHelper, opt_menuRenderer) {
  anychart.chartEditor2Module.controls.SelectPalettes.base(this, 'constructor', opt_caption, opt_menu, opt_renderer, opt_domHelper, opt_menuRenderer);
};
goog.inherits(anychart.chartEditor2Module.controls.SelectPalettes, anychart.chartEditor2Module.controls.Select);


/**
 *
 * @param {anychart.chartEditor2Module.EditorModel} model
 * @param {anychart.chartEditor2Module.EditorModel.Key} key
 * @param {?{Object}=} opt_target
 */
anychart.chartEditor2Module.controls.SelectPalettes.prototype.setEditorModel = function(model, key, opt_target) {
  this.editorModel_ = model;
  this.key_ = key;
  if (opt_target) {
    var stringKey = anychart.chartEditor2Module.EditorModel.getStringKey(key);
    var realPalettes = goog.dom.getWindow()['anychart']['palettes'];
    var value = anychart.bindingModule.exec(opt_target, stringKey);
    var stringValue = '';

    for (var paletteName in realPalettes) {
      if (realPalettes.hasOwnProperty(paletteName) && goog.isArray(realPalettes[paletteName]) && goog.array.equals(value['items'](), realPalettes[paletteName])) {
        stringValue = paletteName;
        break;
      }
    }
    this.setValue(stringValue);
    this.editorModel_.setInputValue(this.key_, stringValue, true);
  }
};
