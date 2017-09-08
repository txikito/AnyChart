goog.provide('anychart.chartEditor2Module.SettingsPanel');

goog.require('anychart.chartEditor2Module.Component');
goog.require('goog.ui.Menu');
goog.require('goog.ui.MenuButton');
goog.require('goog.ui.MenuItem');
goog.require('goog.ui.MenuSeparator');


/**
 * @param {anychart.chartEditor2Module.EditorModel} model
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper; see {@link goog.ui.Component} for semantics.
 * @constructor
 * @extends {anychart.chartEditor2Module.Component}
 */
anychart.chartEditor2Module.SettingsPanel = function(model, opt_domHelper) {
  anychart.chartEditor2Module.SettingsPanel.base(this, 'constructor', opt_domHelper);

  this.setModel(model);

  /**
   * @type {string}
   */
  this.name = 'Settings Panel';
};
goog.inherits(anychart.chartEditor2Module.SettingsPanel, anychart.chartEditor2Module.Component);


/** @inheritDoc */
anychart.chartEditor2Module.SettingsPanel.prototype.createDom = function() {
  anychart.chartEditor2Module.SettingsPanel.base(this, 'createDom');

  var element = /** @type {Element} */(this.getElement());
  goog.dom.classlist.add(element, 'settings-panel');

  var dom = this.getDomHelper();


  this.contentEl = dom.createDom(goog.dom.TagName.DIV, 'content');
  element.appendChild(dom.createDom(goog.dom.TagName.DIV, 'top', dom.createDom(goog.dom.TagName.H4, 'title', this.name)));
  element.appendChild(this.contentEl);
};


/** @inheritDoc */
// anychart.chartEditor2Module.SettingsPanel.prototype.enterDocument = function() {
//   anychart.chartEditor2Module.SettingsPanel.base(this, 'enterDocument');
//
//   this.update();
//   this.getHandler().listen(/** @type {anychart.chartEditor2Module.EditorModel} */(this.editor_.getModel()),
//       anychart.chartEditor2Module.events.EventType.EDITOR_MODEL_UPDATE, this.update);
// };



/**
 * @return {string}
 */
anychart.chartEditor2Module.SettingsPanel.prototype.getName = function() {
  return this.name;
};


/**
 * Checks if this panel can be enabled/disabled.
 *
 * @return {boolean}
 */
anychart.chartEditor2Module.SettingsPanel.prototype.canBeEnabled = function() {
  return Boolean(this.key.length);
};
