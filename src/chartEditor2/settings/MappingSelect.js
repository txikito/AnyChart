goog.provide('anychart.chartEditor2Module.settings.MappingSelect');

goog.require('anychart.chartEditor2Module.select.Base');



/**
 * @constructor
 * @extends {anychart.chartEditor2Module.select.Base}
 */
anychart.chartEditor2Module.settings.MappingSelect = function() {
  anychart.chartEditor2Module.settings.MappingSelect.base(this, 'constructor');
};
goog.inherits(anychart.chartEditor2Module.settings.MappingSelect, anychart.chartEditor2Module.select.Base);


/**
 * @type {string}
 * @private
 */
anychart.chartEditor2Module.settings.MappingSelect.prototype.mappingId_ = '0';


/** @param {string} value */
anychart.chartEditor2Module.settings.MappingSelect.prototype.setMappingId = function(value) {
  this.mappingId_ = value;
};


/** @inheritDoc */
anychart.chartEditor2Module.settings.MappingSelect.prototype.update = function(model) {
  //todo: rework, need silently update selects
  goog.events.unlisten(this, goog.ui.Component.EventType.CHANGE, this.onChange, false, this);

  var seriesData = model.seriesMappings[this.mappingId_];
  var mapping = seriesData.mapping;
  this.setSelectedIndex(mapping);

  goog.events.listen(this, goog.ui.Component.EventType.CHANGE, this.onChange, false, this);
};


/** @inheritDoc */
anychart.chartEditor2Module.settings.MappingSelect.prototype.onChange = function(evt) {
  evt.preventDefault();
  evt.stopPropagation();

  this.dispatchEvent({
    type: anychart.chartEditor2Module.events.EventType.SET_SERIES_MAPPING,
    id: this.mappingId_,
    value: this.getSelectedItem().getModel(),
    rebuild: true
  });
};
