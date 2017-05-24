goog.provide('anychart.ui.chartEditor.Component');

goog.require('anychart.ui.Component');



/**
 *
 * @constructor
 * @name anychart.ui.chartEditor.Component
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper; see {@link goog.ui.Component} for semantics.
 * @extends {anychart.ui.Component}
 */
anychart.ui.chartEditor.Component = function(opt_domHelper) {
  anychart.ui.chartEditor.Component.base(this, 'constructor', opt_domHelper);

  /**
   * @type {string|Array.<string>}
   * @protected
   */
  this.key = '';

  /**
   * @type {string}
   * @protected
   */
  this.keyValue = '';
};
goog.inherits(anychart.ui.chartEditor.Component, anychart.ui.Component);

/**
 @param {anychart.ui.Editor.Model} model
 */
anychart.ui.chartEditor.Component.prototype.update = function(model) {
  this.keyValue = anychart.ui.chartEditor.Controller.getset(model, goog.isArray(this.key_) ? this.key_[0] : this.key_);
  //this.setChecked(value == this.checkedValue_);
};

//exports
(function() {
  var proto = anychart.ui.chartEditor.Component.prototype;
  proto['listen'] = proto.listen;
  proto['listenOnce'] = proto.listenOnce;
  proto['unlisten'] = proto.unlisten;
  proto['unlistenByKey'] = proto.unlistenByKey;
  proto['removeAllListeners'] = proto.removeAllListeners;
})();
