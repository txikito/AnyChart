goog.provide('anychart.chartEditor2Module.controls.SelectWithLabelRenderer');

goog.require('goog.ui.MenuButtonRenderer');


anychart.chartEditor2Module.controls.SelectWithLabelRenderer = function() {
  anychart.chartEditor2Module.controls.SelectWithLabelRenderer.base(this, 'constructor');
};
goog.inherits(anychart.chartEditor2Module.controls.SelectWithLabelRenderer, goog.ui.MenuButtonRenderer);
goog.addSingletonGetter(anychart.chartEditor2Module.controls.SelectWithLabelRenderer);


anychart.chartEditor2Module.controls.SelectWithLabelRenderer.prototype.createDom = function(control) {
  var button = /** @type {anychart.chartEditor2Module.controls.SelectWithLabel} */ (control);
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
