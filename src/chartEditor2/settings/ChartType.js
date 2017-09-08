goog.provide('anychart.chartEditor2Module.settings.ChartType');

goog.require('goog.ui.Control');



/**
 * @constructor
 * @extends {goog.ui.Control}
 */
anychart.chartEditor2Module.settings.ChartType = function() {
  anychart.chartEditor2Module.settings.ChartType.base(this, 'constructor');

  this.setSupportedState(goog.ui.Component.State.CHECKED, true);
  this.setAutoStates(goog.ui.Component.State.CHECKED, false);
};
goog.inherits(anychart.chartEditor2Module.settings.ChartType, goog.ui.Control);


/** @type {string} */
anychart.chartEditor2Module.settings.ChartType.CSS_CLASS = goog.getCssName('anychart-chart-editor-settings-chart-type');


/** @inheritDoc */
anychart.chartEditor2Module.settings.ChartType.prototype.createDom = function() {
  anychart.chartEditor2Module.settings.ChartType.base(this, 'createDom');

  var element = this.getElement();
  goog.dom.classlist.add(element, goog.ui.INLINE_BLOCK_CLASSNAME);
  goog.dom.classlist.add(element, goog.getCssName('anychart-thumbnail'));
  goog.dom.classlist.add(element, anychart.chartEditor2Module.settings.ChartType.CSS_CLASS);

  this.image_ = goog.dom.createDom(goog.dom.TagName.IMG);
  goog.dom.appendChild(element, this.image_);
};


/** @inheritDoc */
anychart.chartEditor2Module.settings.ChartType.prototype.enterDocument = function() {
  anychart.chartEditor2Module.settings.ChartType.base(this, 'enterDocument');
  goog.events.listen(this, goog.ui.Component.EventType.ACTION, this.onAction_, false, this);
};


/** @inheritDoc */
anychart.chartEditor2Module.settings.ChartType.prototype.exitDocument = function() {
  goog.events.listen(this, goog.ui.Component.EventType.ACTION, this.onAction_, false, this);
  anychart.chartEditor2Module.settings.ChartType.base(this, 'exitDocument');
};


/**
 * @param {string} category
 * @param {{type: string, image: string, caption: string}} data
 * @param {boolean} checked
 */
anychart.chartEditor2Module.settings.ChartType.prototype.update = function(category, data, checked) {
  this.setChecked(checked);
  this.setModel({category: category, presetType: data.type});

  //this.caption_.innerHTML = data.caption;
  goog.dom.setProperties(this.image_, {
    'src': 'https://cdn.anychart.com/images/chartopedia/' + data.image,
    'alt': data.caption,
    'title': data.caption
  });
};


/** @private */
anychart.chartEditor2Module.settings.ChartType.prototype.onAction_ = function() {
  var model = /** @type {{category: string, presetType: string}} */(this.getModel());
  this.dispatchEvent({
    type: anychart.chartEditor2Module.events.EventType.SET_PRESET_TYPE,
    category: model.category,
    presetType: model.presetType
  });
};
