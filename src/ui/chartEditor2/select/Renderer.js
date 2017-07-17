goog.provide('anychart.ui.chartEditor2.select.Renderer');

goog.require('goog.ui.FlatMenuButtonRenderer');
goog.require('goog.ui.INLINE_BLOCK_CLASSNAME');



/**
 * Select renderer.
 * @constructor
 * @extends {goog.ui.FlatMenuButtonRenderer}
 */
anychart.ui.chartEditor2.select.Renderer = function() {
  anychart.ui.chartEditor2.select.Renderer.base(this, 'constructor');
};
goog.inherits(anychart.ui.chartEditor2.select.Renderer, goog.ui.FlatMenuButtonRenderer);
goog.addSingletonGetter(anychart.ui.chartEditor2.select.Renderer);


/** @override */
anychart.ui.chartEditor2.select.Renderer.prototype.createDropdown = function(dom) {
  var element = dom.createDom(goog.dom.TagName.DIV, {
    'class': goog.ui.INLINE_BLOCK_CLASSNAME + ' ' +
        goog.getCssName(this.getCssClass(), 'dropdown'),
    'aria-hidden': true
  });

  // Don't use UTF-8.
  element.innerHTML = '&nbsp;';
  return element;
};
