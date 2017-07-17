goog.provide('anychart.ui.chartEditor2.select.Align');
goog.require('anychart.ui.chartEditor2.select.Base');



/**
 * @constructor
 * @extends {anychart.ui.chartEditor2.select.Base}
 */
anychart.ui.chartEditor2.select.Align = function() {
  anychart.ui.chartEditor2.select.Align.base(this, 'constructor');
  this.setCaptions([null, null, null]);
  this.setOptions(['left', 'center', 'right']);
};
goog.inherits(anychart.ui.chartEditor2.select.Align, anychart.ui.chartEditor2.select.Base);


/**
 * @type {string}
 * @private
 */
anychart.ui.chartEditor2.select.Align.prototype.orientation_ = '';


/**
 * @type {string}
 * @private
 */
anychart.ui.chartEditor2.select.Align.prototype.orientationKey_ = 'orientation';


/** @param {string|Array.<string>} value */
anychart.ui.chartEditor2.select.Align.prototype.setOrientationKey = function(value) {
  this.orientationKey_ = goog.isArray(value) ? value[0] : value;
};


/** @inheritDoc */
anychart.ui.chartEditor2.select.Align.prototype.update = function(model) {
  //todo: rework, need silently update selects
  goog.events.unlisten(this, goog.ui.Component.EventType.CHANGE, this.onChange, false, this);
  var orientation = anychart.ui.chartEditor2.Controller.getset(model, this.orientationKey_);
  if (this.orientation_ != orientation) {
    this.orientation_ = orientation;
    if (orientation == 'top' || orientation == 'bottom') {
      this.setIcons(['ac ac-position-left', 'ac ac-position-center', 'ac ac-position-right']);
    } else if (orientation == 'left') {
      this.setIcons(['ac ac-position-bottom', 'ac ac-position-center2', 'ac ac-position-top']);
    } else {
      this.setIcons(['ac ac-position-top', 'ac ac-position-center2', 'ac ac-position-bottom']);
    }
    this.updateOptions();
  }
  goog.events.listen(this, goog.ui.Component.EventType.CHANGE, this.onChange, false, this);

  anychart.ui.chartEditor2.select.Align.base(this, 'update', model);
};
