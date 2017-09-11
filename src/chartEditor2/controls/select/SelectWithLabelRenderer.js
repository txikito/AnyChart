goog.provide('anychart.chartEditor2Module.select.SelectWithLabelRenderer');

goog.require('goog.ui.MenuButtonRenderer');



/**
 * Renderer for {@link anychart.chartEditor2Module.select.SelectWithLabel}s.
 * @constructor
 * @extends {goog.ui.MenuButtonRenderer}
 */
anychart.chartEditor2Module.select.SelectWithLabelRenderer = function() {
  goog.ui.MenuButtonRenderer.call(this);
};
goog.inherits(anychart.chartEditor2Module.select.SelectWithLabelRenderer, goog.ui.MenuButtonRenderer);
goog.addSingletonGetter(anychart.chartEditor2Module.select.SelectWithLabelRenderer);


/** @inheritDoc */
anychart.chartEditor2Module.select.SelectWithLabelRenderer.prototype.createDom = function(control) {
  var button = /** @type {anychart.chartEditor2Module.select.SelectWithLabel} */ (control);
  var classNames = this.getClassNames(button);
  var attributes = {
    'class': 'select-with-label ' + classNames.join(' ')
  };
  var buttonElement = button.getDomHelper().createDom(
      goog.dom.TagName.DIV, attributes,
      [
        this.createButton(button.getContent(), button.getDomHelper()),
        button.getDomHelper().createDom(goog.dom.TagName.LABEL, null, button.getLabel())
      ]);

  this.setTooltip(buttonElement, /** @type {!string}*/ (button.getTooltip()));

  return buttonElement;
};
