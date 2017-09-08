goog.provide('anychart.chartEditor2Module.select.Align');
goog.require('anychart.chartEditor2Module.select.Base');



/**
 * @constructor
 * @extends {anychart.chartEditor2Module.select.Base}
 */
anychart.chartEditor2Module.select.Align = function() {
  anychart.chartEditor2Module.select.Align.base(this, 'constructor');
  this.setCaptions([null, null, null]);
  this.setOptions(['left', 'center', 'right']);
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


/** @inheritDoc */
anychart.chartEditor2Module.select.Align.prototype.update = function(model) {
  //todo: rework, need silently update selects
  goog.events.unlisten(this, goog.ui.Component.EventType.CHANGE, this.onChange, false, this);
  var orientation = anychart.chartEditor2Module.Controller.getset(model, this.orientationKey_);
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

  anychart.chartEditor2Module.select.Align.base(this, 'update', model);
};
