goog.provide('anychart.chartEditor2Module.controls.SelectWithLabel');

goog.require('anychart.chartEditor2Module.select.Base');
goog.require('anychart.chartEditor2Module.controls.SelectWithLabelRenderer');
goog.require('goog.ui.Component');



/**
 * Select control with label.
 *
 * @param {string} field
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
 * @constructor
 * @extends {anychart.chartEditor2Module.select.Base}
 */
anychart.chartEditor2Module.controls.SelectWithLabel = function(field, opt_caption, opt_menu, opt_renderer, opt_domHelper, opt_menuRenderer) {
  anychart.chartEditor2Module.controls.SelectWithLabel.base(this, 'constructor', opt_caption, opt_menu,
      opt_renderer || anychart.chartEditor2Module.controls.SelectWithLabelRenderer.getInstance(),
      opt_domHelper, opt_menuRenderer);

  /**
   * @type {goog.ui.ControlContent}
   */
  this.label_ = goog.isDef(opt_caption) ? opt_caption : field;
  this.setModel(field);
};
goog.inherits(anychart.chartEditor2Module.controls.SelectWithLabel, anychart.chartEditor2Module.select.Base);


/**
 * Return label value.
 * @return {goog.ui.ControlContent}
 */
anychart.chartEditor2Module.controls.SelectWithLabel.prototype.getLabel = function() {
  return this.label_ ? this.label_ : '';
};