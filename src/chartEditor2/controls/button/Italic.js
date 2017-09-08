goog.provide('anychart.chartEditor2Module.button.Italic');

goog.require('anychart.chartEditor2Module.button.Toggle');



/**
 * Italic button for text appearance.
 * @constructor
 * @extends {anychart.chartEditor2Module.button.Toggle}
 */
anychart.chartEditor2Module.button.Italic = function() {
  anychart.chartEditor2Module.button.Italic.base(this, 'constructor');

  this.setIcon('ac ac-italic');
  this.setNormalValue('normal');
  this.setCheckedValue('italic');
};
goog.inherits(anychart.chartEditor2Module.button.Italic, anychart.chartEditor2Module.button.Toggle);
