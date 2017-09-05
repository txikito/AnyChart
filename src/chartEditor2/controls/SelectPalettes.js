goog.provide('anychart.chartEditor2Module.controls.SelectPalettes');

goog.require('anychart.chartEditor2Module.controls.Select');



/**
 * Select input for palettes property.
 *
 * @param {goog.ui.ControlContent=} opt_caption Default caption or existing DOM
 *     structure to display as the button's caption when nothing is selected.
 *     Defaults to no caption.
 * @param {goog.ui.Menu=} opt_menu Menu containing selection options.
 * @param {goog.ui.ButtonRenderer=} opt_renderer Renderer used to render or
 *     decorate the control; defaults to {@link goog.ui.MenuButtonRenderer}.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
 *     document interaction.
 * @param {!goog.ui.MenuRenderer=} opt_menuRenderer Renderer used to render or
 *     decorate the menu; defaults to {@link goog.ui.MenuRenderer}.
 *
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
 * @param {string=} opt_callback
 * @param {?Object=} opt_target
 * @param {boolean=} opt_noRebuild Should or not rebuild chart on change value of this control.
 */
anychart.chartEditor2Module.controls.SelectPalettes.prototype.setEditorModel = function(model, key, opt_callback, opt_target, opt_noRebuild) {
  this.editorModel = model;
  this.key = key;
  this.callback = opt_callback;

  if (opt_target) {
    var stringKey = anychart.chartEditor2Module.EditorModel.getStringKey(key);
    var value = anychart.bindingModule.exec(opt_target, stringKey);

    if (value) {
      var realPalettes = goog.dom.getWindow()['anychart']['palettes'];
      var stringValue = '';
      for (var paletteName in realPalettes) {
        if (realPalettes.hasOwnProperty(paletteName) && goog.isArray(realPalettes[paletteName]) && goog.array.equals(value['items'](), realPalettes[paletteName])) {
          stringValue = paletteName;
          break;
        }
      }

      this.suspendDispatch = true;
      this.setValue(stringValue);
      this.editorModel.setValue(this.key, stringValue, true);
      this.suspendDispatch = false;
    }
  }
};
