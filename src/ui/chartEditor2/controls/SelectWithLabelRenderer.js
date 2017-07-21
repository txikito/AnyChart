goog.provide('anychart.ui.chartEditor2.controls.SelectWithLabelRenderer');

goog.require('goog.ui.MenuButtonRenderer');



anychart.ui.chartEditor2.controls.SelectWithLabelRenderer = function() {
  anychart.ui.chartEditor2.controls.SelectWithLabelRenderer.base(this, 'constructor');
};
goog.inherits(anychart.ui.chartEditor2.controls.SelectWithLabelRenderer, goog.ui.MenuButtonRenderer);
goog.addSingletonGetter(anychart.ui.chartEditor2.controls.SelectWithLabelRenderer);


// anychart.ui.chartEditor2.controls.SelectWithLabelRenderer.prototype.createDom = function() {
//   debugger;
//   return goog.base(this, 'createDom');
// };