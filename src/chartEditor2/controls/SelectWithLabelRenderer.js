goog.provide('anychart.chartEditor2Module.controls.SelectWithLabelRenderer');

goog.require('goog.ui.MenuButtonRenderer');



anychart.chartEditor2Module.controls.SelectWithLabelRenderer = function() {
  anychart.chartEditor2Module.controls.SelectWithLabelRenderer.base(this, 'constructor');
};
goog.inherits(anychart.chartEditor2Module.controls.SelectWithLabelRenderer, goog.ui.MenuButtonRenderer);
goog.addSingletonGetter(anychart.chartEditor2Module.controls.SelectWithLabelRenderer);


// anychart.chartEditor2Module.controls.SelectWithLabelRenderer.prototype.createDom = function() {
//   debugger;
//   return goog.base(this, 'createDom');
// };