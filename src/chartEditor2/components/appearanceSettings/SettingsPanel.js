goog.provide('anychart.chartEditor2Module.SettingsPanel');

goog.require('anychart.chartEditor2Module.ComponentWithKey');
goog.require('anychart.chartEditor2Module.checkbox.Base');



/**
 * @param {anychart.chartEditor2Module.EditorModel} model
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper; see {@link goog.ui.Component} for semantics.
 * @constructor
 * @extends {anychart.chartEditor2Module.ComponentWithKey}
 */
anychart.chartEditor2Module.SettingsPanel = function(model, opt_domHelper) {
  anychart.chartEditor2Module.SettingsPanel.base(this, 'constructor', model, opt_domHelper);

  /**
   * @type {string}
   */
  this.name = 'Settings Panel';
};
goog.inherits(anychart.chartEditor2Module.SettingsPanel, anychart.chartEditor2Module.ComponentWithKey);


/** @inheritDoc */
anychart.chartEditor2Module.SettingsPanel.prototype.createDom = function() {
  anychart.chartEditor2Module.SettingsPanel.base(this, 'createDom');

  var element = /** @type {Element} */(this.getElement());
  goog.dom.classlist.add(element, 'settings-panel');

  var dom = this.getDomHelper();

  if (this.canBeEnabled()) {
    this.enabledCheckbox = new anychart.chartEditor2Module.checkbox.Base();
    this.enabledCheckbox.init(model, this.getKey());
    this.addChild(this.enabledCheckbox, true);
  }

  this.contentEl = dom.createDom(goog.dom.TagName.DIV, 'content');
  element.appendChild(dom.createDom(goog.dom.TagName.DIV, 'top',
      dom.createDom(goog.dom.TagName.H4, 'title', this.name),
      this.enabledCheckbox ? this.enabledCheckbox.getElement() : null
  ));
  element.appendChild(this.contentEl);
};


/** @inheritDoc */
anychart.chartEditor2Module.SettingsPanel.prototype.onChartDraw = function(evt) {
  var model = /** @type {anychart.chartEditor2Module.EditorModel} */(this.getModel());

  if (evt.rebuild) {
    if (this.canBeEnabled())
      this.enabledCheckbox.setValueByTarget(evt.chart);
  }
};


/**
 * @return {string}
 */
anychart.chartEditor2Module.SettingsPanel.prototype.getName = function() {
  return this.name;
};


/**
 * Checks if this panel can be enabled/disabled.
 * If panel can be enabled, the this.key property of panel should contain '*.enable()' key.
 *
 * @return {boolean}
 */
anychart.chartEditor2Module.SettingsPanel.prototype.canBeEnabled = function() {
  return Boolean(this.key.length);
};
