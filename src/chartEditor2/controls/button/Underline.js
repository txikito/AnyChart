goog.provide('anychart.chartEditor2Module.button.Underline');

goog.require('anychart.chartEditor2Module.button.Toggle');



/**
 * Underline button for text appearance.
 * @constructor
 * @extends {anychart.chartEditor2Module.button.Toggle}
 */
anychart.chartEditor2Module.button.Underline = function() {
  anychart.chartEditor2Module.button.Underline.base(this, 'constructor');

  this.setIcon('ac ac-underline');
  this.setNormalValue('normal');
  this.setCheckedValue('underline');
};
goog.inherits(anychart.chartEditor2Module.button.Underline, anychart.chartEditor2Module.button.Toggle);
