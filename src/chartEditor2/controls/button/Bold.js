goog.provide('anychart.chartEditor2Module.button.Bold');

goog.require('anychart.chartEditor2Module.button.Toggle');



/**
 * Bold button for text appearance.
 * @constructor
 * @extends {anychart.chartEditor2Module.button.Toggle}
 */
anychart.chartEditor2Module.button.Bold = function() {
  anychart.chartEditor2Module.button.Bold.base(this, 'constructor');

  this.setIcon('ac ac-bold');
  this.setNormalValue('normal');
  this.setCheckedValue('bold');
};
goog.inherits(anychart.chartEditor2Module.button.Bold, anychart.chartEditor2Module.button.Toggle);
