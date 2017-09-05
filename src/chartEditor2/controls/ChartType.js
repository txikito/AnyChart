goog.provide('anychart.chartEditor2Module.controls.ChartTypeSelect');

goog.require('anychart.chartEditor2Module.controls.MenuItemWithTwoValues');
goog.require('anychart.chartEditor2Module.controls.Select');



/**
 * Select for chart type.
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
 * @extends {goog.ui.Select}
 */
anychart.chartEditor2Module.controls.ChartTypeSelect = function(opt_caption, opt_menu, opt_renderer, opt_domHelper, opt_menuRenderer) {
  anychart.chartEditor2Module.controls.ChartTypeSelect.base(this, 'constructor', opt_caption, opt_menu, opt_renderer, opt_domHelper, opt_menuRenderer);

  /**
   * @type {Array}
   * @private
   */
  this.options_ = [];
};
goog.inherits(anychart.chartEditor2Module.controls.ChartTypeSelect, anychart.chartEditor2Module.controls.Select);


/** @inheritDoc */
anychart.chartEditor2Module.controls.ChartTypeSelect.prototype.createDom = function() {
  goog.base(this, 'createDom');

  for(var i = 0; i < this.options_.length; i++) {
    var item = new anychart.chartEditor2Module.controls.MenuItemWithTwoValues(this.options_[i]['name'], this.options_[i]['value'], this.options_[i]['stackMode']);
    this.addItem(item);
  }

  goog.dom.classlist.add(this.getElement(), 'type-select');
};


/** @inheritDoc */
anychart.chartEditor2Module.controls.ChartTypeSelect.prototype.setOptions = function(options, opt_default) {
  this.options_ = options;
};


/**
 * Return icon url
 * @return {string}
 */
anychart.chartEditor2Module.controls.ChartTypeSelect.prototype.getIcon = function() {
  var i = this.getSelectedIndex() >= 0 ? this.getSelectedIndex() : 0;
  return 'http://www.anychart.com/_design/img/upload/charts/types/' + this.options_[i]['icon'];
};


/**
 * Returns the second value associated with the menu item.
 * @return {*} Value associated with the menu item, if any, or its caption.
 */
anychart.chartEditor2Module.controls.ChartTypeSelect.prototype.getValue2 = function() {
  var selectedItem = this.getSelectedItem();
  return selectedItem ? selectedItem.getValue2() : null;
};
