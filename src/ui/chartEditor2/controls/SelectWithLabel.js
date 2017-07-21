goog.provide('anychart.ui.chartEditor2.controls.SelectWithLabel');

goog.require('goog.ui.Component');
goog.require('anychart.ui.chartEditor2.controls.Select');
goog.require('anychart.ui.chartEditor2.controls.SelectWithLabelRenderer');


/**
 * @param {String} label
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
 * @extends {anychart.ui.chartEditor2.controls.Select}
 */
anychart.ui.chartEditor2.controls.SelectWithLabel = function(label, opt_caption, opt_menu, opt_renderer, opt_domHelper, opt_menuRenderer) {
  anychart.ui.chartEditor2.controls.SelectWithLabel.base(this, 'constructor', opt_caption, opt_menu,
      opt_renderer || anychart.ui.chartEditor2.controls.SelectWithLabelRenderer.getInstance(),
      opt_domHelper, opt_menuRenderer);

  this.label_ = label;
};
goog.inherits(anychart.ui.chartEditor2.controls.SelectWithLabel, anychart.ui.chartEditor2.controls.Select);



anychart.ui.chartEditor2.controls.SelectWithLabel.prototype.createDom = function() {
  goog.base(this, 'createDom');

   var dom = this.getDomHelper();
   var element = this.getElement();

  goog.dom.classlist.add(this.getElement(), 'field-select');

  element.appendChild(dom.createDom(goog.dom.TagName.LABEL, 'label', this.label_));
};


anychart.ui.chartEditor2.controls.SelectWithLabel.prototype.getValue2 = function() {
  var selectedItem = this.getSelectedItem();
  return selectedItem ? selectedItem.getValue2() : null;
};
