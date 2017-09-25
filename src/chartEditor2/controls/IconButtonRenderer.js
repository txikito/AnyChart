goog.provide('anychart.chartEditor2Module.IconButtonRenderer');

goog.require('goog.ui.CustomButtonRenderer');
goog.require('goog.ui.INLINE_BLOCK_CLASSNAME');



/**
 * Icon button renderer.
 *
 * @constructor
 * @extends {goog.ui.CustomButtonRenderer}
 */
anychart.chartEditor2Module.IconButtonRenderer = function() {
  anychart.chartEditor2Module.IconButtonRenderer.base(this, 'constructor');
};
goog.inherits(anychart.chartEditor2Module.IconButtonRenderer, goog.ui.CustomButtonRenderer);
goog.addSingletonGetter(anychart.chartEditor2Module.IconButtonRenderer);


/**
 * Default CSS class to be applied to the root element of components rendered
 * by this renderer.
 * @type {string}
 */
anychart.chartEditor2Module.IconButtonRenderer.CSS_CLASS = goog.getCssName('anychart-icon-button');


/** @override */
anychart.chartEditor2Module.IconButtonRenderer.prototype.getCssClass = function() {
  return anychart.chartEditor2Module.IconButtonRenderer.CSS_CLASS;
};


/** @override */
anychart.chartEditor2Module.IconButtonRenderer.prototype.createDom = function(control) {
  var button = /** @type {goog.ui.Button} */ (control);
  var classNames = this.getClassNames(button);
  var attributes = {
    'class': goog.ui.INLINE_BLOCK_CLASSNAME + ' ' + classNames.join(' ')
  };
  var buttonElement = button.getDomHelper().createDom(
      goog.dom.TagName.DIV, attributes);
  this.setTooltip(
      buttonElement, /** @type {!string}*/ (button.getTooltip()));

  return buttonElement;
};


/** @override */
anychart.chartEditor2Module.IconButtonRenderer.prototype.getContentElement = function(element) {
  return element;
};
