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

  /**
   * @type {boolean}
   * @private
   */
  this.enabled_ = true;
};
goog.inherits(anychart.chartEditor2Module.SettingsPanel, anychart.chartEditor2Module.ComponentWithKey);


/** @inheritDoc */
anychart.chartEditor2Module.SettingsPanel.prototype.createDom = function() {
  anychart.chartEditor2Module.SettingsPanel.base(this, 'createDom');

  var element = /** @type {Element} */(this.getElement());
  goog.dom.classlist.add(element, 'settings-panel');

  var dom = this.getDomHelper();

  if (this.canBeEnabled()) {
    var model = /** @type {anychart.chartEditor2Module.EditorModel} */(this.getModel());
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

  this.applyEnabled_(!this.canBeEnabled());
};


/** @inheritDoc */
anychart.chartEditor2Module.SettingsPanel.prototype.enterDocument = function() {
  anychart.chartEditor2Module.SettingsPanel.base(this, 'enterDocument');
};


/** @inheritDoc */
anychart.chartEditor2Module.SettingsPanel.prototype.onChartDraw = function(evt) {
  if (evt.rebuild && this.canBeEnabled()) {
    this.enabledCheckbox.setValueByTarget(evt.chart);
    this.setEnabled(this.enabledCheckbox.isChecked());
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


/**
 * Enables/Disables the group content controls.
 * @param {boolean} enabled Whether to enable (true) or disable (false) the
 *     group content controls.
 * @protected
 */
anychart.chartEditor2Module.SettingsPanel.prototype.setContentEnabled = function(enabled) {
  this.forEachChild(function(child) {
    if (goog.isFunction(child.setEnabled)) {
      child.setEnabled(enabled);
    }
  });
  this.enabledCheckbox.setEnabled(true);
};


/**
 * Enables/Disables the all group controls.
 * @param {boolean} enabled Whether to enable (true) or disable (false) the
 *     all group controls.
 * @protected
 */
anychart.chartEditor2Module.SettingsPanel.prototype.setEnabled = function(enabled) {
  if (this.isInDocument()) {
    this.applyEnabled_(enabled);
  }

  this.enabled_ = enabled;
};


/**
 * @param {boolean} enabled
 * @private
 */
anychart.chartEditor2Module.SettingsPanel.prototype.applyEnabled_ = function(enabled) {
  if (this.canBeEnabled())
    this.enabledCheckbox.setEnabled(enabled);

  this.setContentEnabled(enabled);

  this.enabled_ = enabled;
};