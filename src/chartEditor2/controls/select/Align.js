goog.provide('anychart.chartEditor2Module.select.Align');
goog.require('anychart.chartEditor2Module.select.Base');



/**
 * @param {boolean=} opt_inverse
 * @constructor
 * @extends {anychart.chartEditor2Module.select.Base}
 */
anychart.chartEditor2Module.select.Align = function(opt_inverse) {
  anychart.chartEditor2Module.select.Align.base(this, 'constructor');
  this.setCaptions([null, null, null]);
  this.setOptions(['left', 'center', 'right']);

  this.inverse_ = opt_inverse;
};
goog.inherits(anychart.chartEditor2Module.select.Align, anychart.chartEditor2Module.select.Base);


/**
 * @type {string}
 * @private
 */
anychart.chartEditor2Module.select.Align.prototype.orientation_ = '';


/**
 * @type {string}
 * @private
 */
anychart.chartEditor2Module.select.Align.prototype.orientationKey_ = 'orientation';


/** @param {string|Array.<string>} value */
anychart.chartEditor2Module.select.Align.prototype.setOrientationKey = function(value) {
  this.orientationKey_ = goog.isArray(value) ? value[0] : value;
};


/**
 * Icons of thyis select depend of value of orientation select value.
 * @param {string} orientationValue
 */
anychart.chartEditor2Module.select.Align.prototype.updateIcons = function(orientationValue) {
  goog.events.unlisten(this, goog.ui.Component.EventType.CHANGE, this.onChange, false, this);
  if (this.orientation_ != orientationValue) {
    this.orientation_ = orientationValue;
    if (orientationValue == 'top' || orientationValue == 'bottom') {
      this.setIcons(['ac ac-position-left', 'ac ac-position-center', 'ac ac-position-right']);
    } else if (orientationValue == 'left' && !this.inverse_) {
      this.setIcons(['ac ac-position-bottom', 'ac ac-position-center2', 'ac ac-position-top']);
    } else {
      this.setIcons(['ac ac-position-top', 'ac ac-position-center2', 'ac ac-position-bottom']);
    }
    this.updateOptions();
  }
  goog.events.listen(this, goog.ui.Component.EventType.CHANGE, this.onChange, false, this);
};
