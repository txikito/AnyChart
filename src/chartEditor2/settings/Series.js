goog.provide('anychart.chartEditor2Module.settings.Series');

goog.require('anychart.chartEditor2Module.checkbox.Base');
goog.require('anychart.chartEditor2Module.colorPicker.Base');
goog.require('anychart.chartEditor2Module.events');
goog.require('anychart.chartEditor2Module.select.Base');
goog.require('anychart.chartEditor2Module.input.Base');
goog.require('anychart.chartEditor2Module.settings.MappingSelect');
goog.require('anychart.ui.button.Base');
goog.require('goog.ui.Component');



/**
 * @constructor
 * @extends {goog.ui.Component}
 */
anychart.chartEditor2Module.settings.Series = function() {
  anychart.chartEditor2Module.settings.Series.base(this, 'constructor');
};
goog.inherits(anychart.chartEditor2Module.settings.Series, goog.ui.Component);


/**
 * @type {string}
 * @private
 */
anychart.chartEditor2Module.settings.Series.prototype.seriesId_ = '0';


/** @param {string} value */
anychart.chartEditor2Module.settings.Series.prototype.setSeriesId = function(value) {
  if (value != this.seriesId_) {
    this.seriesId_ = value;
    this.updateKeys();
  }
};


/**
 * @param {Object} options
 */
anychart.chartEditor2Module.settings.Series.prototype.setSeriesTypeOptions = function(options) {
  // CE: Part 3
};


/** @inheritDoc */
anychart.chartEditor2Module.settings.Series.prototype.disposeInternal = function() {
  this.nameInput_ = null;
  this.colorPicker_ = null;
  this.removeBtn_ = null;
  this.typeSelect_ = null;
  this.mappingSelect_ = null;
  this.markersEnabled_ = null;

  anychart.chartEditor2Module.settings.Series.base(this, 'disposeInternal');
};


/** @inheritDoc */
anychart.chartEditor2Module.settings.Series.prototype.createDom = function() {
  anychart.chartEditor2Module.settings.Series.base(this, 'createDom');
  var content = this.getContentElement();

  var nameInput = new anychart.chartEditor2Module.input.Base('Series name');
  this.addChild(nameInput, true);
  goog.dom.classlist.add(nameInput.getElement(), goog.getCssName('anychart-chart-editor-series-name-input'));

  var removeBtn = new anychart.ui.button.Base(null, anychart.chartEditor2Module.IconButtonRenderer.getInstance());
  removeBtn.addClassName(goog.getCssName('anychart-chart-editor-settings-control-right'));
  removeBtn.setIcon(goog.getCssName('ac ac-remove'));
  removeBtn.addClassName(goog.getCssName('anychart-chart-editor-remove-series-btn'));
  removeBtn.setTooltip('Remove series');
  this.addChild(removeBtn, true);

  var colorPicker = new anychart.chartEditor2Module.colorPicker.Base();
  colorPicker.addClassName(goog.getCssName('anychart-chart-editor-settings-control-right'));
  this.addChild(colorPicker, true);

  goog.dom.appendChild(content, goog.dom.createDom(
      goog.dom.TagName.DIV,
      goog.getCssName('anychart-chart-editor-settings-item-gap')));

  //region Series type
  var typeLabel = goog.dom.createDom(
      goog.dom.TagName.LABEL,
      [
        goog.ui.INLINE_BLOCK_CLASSNAME,
        goog.getCssName('anychart-chart-editor-settings-label')
      ],
      'Series type');
  goog.dom.appendChild(content, typeLabel);

  var typeSelect = new anychart.chartEditor2Module.select.Base();
  typeSelect.addClassName(goog.getCssName('anychart-chart-editor-settings-control-right'));
  typeSelect.addClassName(goog.getCssName('anychart-chart-editor-settings-control-small'));
  typeSelect.setOptions(['line', 'area', 'spline', 'column']);
  typeSelect.setCaptions(['Line', 'Area', 'Spline', 'Column']);
  this.addChild(typeSelect, true);

  goog.dom.appendChild(content, goog.dom.createDom(
      goog.dom.TagName.DIV,
      goog.getCssName('anychart-chart-editor-settings-item-gap')));
  //endregion

  //region Mapping
  var mappingLabel = goog.dom.createDom(
      goog.dom.TagName.LABEL,
      [
        goog.ui.INLINE_BLOCK_CLASSNAME,
        goog.getCssName('anychart-chart-editor-settings-label')
      ],
      'Data mapping');
  goog.dom.appendChild(content, mappingLabel);

  var mappingSelect = new anychart.chartEditor2Module.settings.MappingSelect();
  mappingSelect.addClassName(goog.getCssName('anychart-chart-editor-settings-control-right'));
  mappingSelect.addClassName(goog.getCssName('anychart-chart-editor-settings-control-big'));
  this.addChild(mappingSelect, true);

  goog.dom.appendChild(content, goog.dom.createDom(
      goog.dom.TagName.DIV,
      goog.getCssName('anychart-chart-editor-settings-item-gap')));
  //endregion


  //region Markers
  var markersEnabledHeader = goog.dom.createDom(
      goog.dom.TagName.LABEL,
      [
        goog.ui.INLINE_BLOCK_CLASSNAME,
        goog.getCssName('anychart-chart-editor-settings-label')
      ],
      'Markers');
  goog.dom.appendChild(content, markersEnabledHeader);

  var markersEnabledBtn = new anychart.chartEditor2Module.checkbox.Base();
  markersEnabledBtn.addClassName(goog.getCssName('anychart-chart-editor-settings-control-right'));
  markersEnabledBtn.addClassName(goog.getCssName('anychart-chart-editor-settings-enabled'));
  markersEnabledBtn.setNormalValue(false);
  markersEnabledBtn.setCheckedValue(true);
  markersEnabledBtn.setLabel(markersEnabledHeader);
  this.addChild(markersEnabledBtn, true);

  goog.dom.appendChild(content, goog.dom.createDom(
      goog.dom.TagName.DIV,
      goog.getCssName('anychart-chart-editor-settings-item-gap-mini')));
  //endregion

  goog.dom.appendChild(content, goog.dom.createDom(
      goog.dom.TagName.DIV,
      goog.getCssName('anychart-chart-editor-settings-item-separator')));

  this.nameInput_ = nameInput;
  this.colorPicker_ = colorPicker;
  this.removeBtn_ = removeBtn;
  this.typeSelect_ = typeSelect;
  this.mappingSelect_ = mappingSelect;
  this.markersEnabled_ = markersEnabledBtn;

  this.updateKeys();
};


/** @override */
anychart.chartEditor2Module.settings.Series.prototype.enterDocument = function() {
  anychart.chartEditor2Module.settings.Series.base(this, 'enterDocument');
  goog.events.listen(this.removeBtn_, goog.ui.Component.EventType.ACTION, this.onRemoveAction_, false, this);
};


/** @override */
anychart.chartEditor2Module.settings.Series.prototype.exitDocument = function() {
  goog.events.unlisten(this.removeBtn_, goog.ui.Component.EventType.ACTION, this.onRemoveAction_, false, this);
  anychart.chartEditor2Module.settings.Series.base(this, 'exitDocument');
};


/**
 * Update model keys.
 */
anychart.chartEditor2Module.settings.Series.prototype.updateKeys = function() {
  if (this.nameInput_) this.nameInput_.setKey(this.genKey('name()'));
  if (this.colorPicker_) this.colorPicker_.setKey(this.genKey('color()'));
  if (this.typeSelect_) this.typeSelect_.setKey(this.genKey('seriesType()'));
  if (this.mappingSelect_) this.mappingSelect_.setMappingId(this.seriesId_);
  if (this.markersEnabled_) this.markersEnabled_.setKey(this.genKey('markers().enabled()'));
};


/**
 * Update controls.
 * @param {anychart.chartEditor2Module.steps.Base.Model} model
 */
anychart.chartEditor2Module.settings.Series.prototype.update = function(model) {
  var mappings = [];
  var captions = [];

  for (var i = 0, count = model.dataMappings.length; i < count; i++) {
    mappings.push(i);
    captions.push(model.dataMappings[i]['meta'](0, 'title'));
  }

  this.mappingSelect_.setOptions(mappings);
  this.mappingSelect_.setCaptions(captions);
  this.mappingSelect_.updateOptions();

  this.nameInput_.update(model);
  this.colorPicker_.update(model);
  this.typeSelect_.update(model);
  this.mappingSelect_.update(model);
  this.markersEnabled_.update(model);
};


/**
 * @param {string} value
 * @return {string}
 */
anychart.chartEditor2Module.settings.Series.prototype.genKey = function(value) {
  return 'chart.getSeries(' + this.seriesId_ + ').' + value;
};


/**
 * @param {goog.events.Event} evt
 * @private
 */
anychart.chartEditor2Module.settings.Series.prototype.onRemoveAction_ = function(evt) {
  evt.preventDefault();
  evt.stopPropagation();

  this.dispatchEvent({
    type: anychart.chartEditor2Module.events.EventType.REMOVE_SERIES,
    id: this.seriesId_,
    rebuild: true
  });
};
