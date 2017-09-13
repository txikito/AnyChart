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
   * @protected
   */
  this.name = 'Settings Panel';

  /**
   * @type {boolean}
   * @protected
   */
  this.enabled = true;

  /**
   * @type {boolean}
   * @protected
   */
  this.enabledContent = true;
};
goog.inherits(anychart.chartEditor2Module.SettingsPanel, anychart.chartEditor2Module.ComponentWithKey);


/**
 * @return {boolean} Whether the title settings is enabled.
 */
anychart.chartEditor2Module.SettingsPanel.prototype.isEnabled = function() {
  return this.enabled;
};


/** @param {string} value */
anychart.chartEditor2Module.SettingsPanel.prototype.setName = function(value) {
  this.name = value;
};

/**
 * @type {boolean}
 * @private
 */
anychart.chartEditor2Module.SettingsPanel.prototype.allowEnabled_ = true;


/** @param {boolean} value */
anychart.chartEditor2Module.SettingsPanel.prototype.allowEnabled = function(value) {
  this.allowEnabled_ = value;
};


/**
 * Container for enabled button.
 * @type {Element}
 * @private
 */
anychart.chartEditor2Module.SettingsPanel.prototype.enabledButtonContainer_ = null;


/**
 * Set container for enabled button.
 * @param {Element} enabledButtonContainer
 */
anychart.chartEditor2Module.SettingsPanel.prototype.setEnabledButtonContainer = function(enabledButtonContainer) {
  this.enabledButtonContainer_ = enabledButtonContainer;
};


/**
 * @return {string}
 */
anychart.chartEditor2Module.SettingsPanel.prototype.getName = function() {
  return this.name;
};

/** @inheritDoc */
anychart.chartEditor2Module.SettingsPanel.prototype.createDom = function() {
  anychart.chartEditor2Module.SettingsPanel.base(this, 'createDom');

  var element = /** @type {Element} */(this.getElement());
  goog.dom.classlist.add(element, 'settings-panel');

  var dom = this.getDomHelper();

  if (this.canBeEnabled()) {
    var model = /** @type {anychart.chartEditor2Module.EditorModel} */(this.getModel());
    var enableContentCheckbox = new anychart.chartEditor2Module.checkbox.Base();
    enableContentCheckbox.init(model, this.genKey('enabled()'));

    if (this.enabledButtonContainer_) {
      enableContentCheckbox.render(this.enabledButtonContainer_);
      enableContentCheckbox.setParent(this);
    } else {
      this.addChild(enableContentCheckbox, true);
    }
    this.enableContentCheckbox = enableContentCheckbox;
  }

  this.contentEl = dom.createDom(goog.dom.TagName.DIV, 'content');

  if (this.name) {
    element.appendChild(dom.createDom(goog.dom.TagName.DIV, 'top',
        dom.createDom(goog.dom.TagName.H4, 'title', this.name),
        this.enableContentCheckbox && !this.enabledButtonContainer_ ? this.enableContentCheckbox.getElement() : null
    ));
  }

  element.appendChild(this.contentEl);
};


/** @inheritDoc */
anychart.chartEditor2Module.SettingsPanel.prototype.enterDocument = function() {
  anychart.chartEditor2Module.SettingsPanel.base(this, 'enterDocument');
  this.setEnabled(this.enabled);
};

/** @inheritDoc */
anychart.chartEditor2Module.SettingsPanel.prototype.onChartDraw = function(evt) {
  anychart.chartEditor2Module.SettingsPanel.base(this, 'onChartDraw', evt);

  if (evt.rebuild && this.canBeEnabled()) {
    this.enableContentCheckbox.setValueByTarget(evt.chart);
    this.setContentEnabled(this.enableContentCheckbox.isChecked());
  }
};


/**
 * Checks if this panel can be enabled/disabled.
 * If panel can be enabled, the this.key property of panel should contain '*.enable()' key.
 *
 * @return {boolean}
 */
anychart.chartEditor2Module.SettingsPanel.prototype.canBeEnabled = function() {
  return this.allowEnabled_ && Boolean(this.key.length);
};


/**
 * Enables/Disables the all group controls.
 * @param {boolean} enabled Whether to enable (true) or disable (false) the
 *     all group controls.
 * @protected
 */
anychart.chartEditor2Module.SettingsPanel.prototype.setEnabled = function(enabled) {
  // if (this.name == 'Title')
  //   debugger;

  this.enabled = enabled;
  if (!this.canBeEnabled())
    this.enabledContent = this.enabled;

  if (this.isInDocument())
    this.setContentEnabled(this.enabledContent);

  if (this.enableContentCheckbox)
    this.enableContentCheckbox.setEnabled(enabled);
};


/**
 * Enables/Disables the group content controls.
 * @param {boolean} enabled Whether to enable (true) or disable (false) the
 *     group content controls.
 * @protected
 */
anychart.chartEditor2Module.SettingsPanel.prototype.setContentEnabled = function(enabled) {
  this.enabledContent = this.enabled && enabled;

  // this should be to get child.setEnabled() working
  var tmp = this.enabled;
  this.enabled = true;
  for (var i = 0, count = this.getChildCount(); i < count; i++) {
    var child = this.getChildAt(i);
    if (goog.isFunction(child.setEnabled))
      child.setEnabled(this.enabledContent);
  }
  this.enabled = tmp;

  if (this.enableContentCheckbox)
    this.enableContentCheckbox.setEnabled(this.enabled);
};
