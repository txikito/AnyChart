goog.provide('anychart.chartEditor2Module.AppearanceSettings');

goog.require('anychart.chartEditor2Module.Component');
goog.require('anychart.chartEditor2Module.EditorModel');
goog.require('anychart.chartEditor2Module.SettingsPanel');


/**
 * Appearance settings widget.
 *
 * @param {anychart.chartEditor2Module.EditorModel} model
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper; see {@link goog.ui.Component} for semantics.
 * @constructor
 * @extends {anychart.chartEditor2Module.Component}
 */
anychart.chartEditor2Module.AppearanceSettings = function(model, opt_domHelper) {
  anychart.chartEditor2Module.AppearanceSettings.base(this, 'constructor', opt_domHelper);

  this.setModel(model);

  this.panels_ = [
    {classFunc: anychart.chartEditor2Module.SettingsPanel, instance: null},
    {classFunc: anychart.chartEditor2Module.SettingsPanel, instance: null}
  ];

  this.currentCategory_ = 0;
};
goog.inherits(anychart.chartEditor2Module.AppearanceSettings, anychart.chartEditor2Module.Component);


/** @inheritDoc */
anychart.chartEditor2Module.AppearanceSettings.prototype.createDom = function() {
  anychart.chartEditor2Module.AppearanceSettings.base(this, 'createDom');

  var element = /** @type {Element} */(this.getElement());
  goog.dom.classlist.add(element, 'appearance-settings');

  element.appendChild(this.getDomHelper().createDom('h2', null, 'AppearanceSettings'));
};


/** @inheritDoc */
anychart.chartEditor2Module.AppearanceSettings.prototype.enterDocument = function() {
  anychart.chartEditor2Module.AppearanceSettings.base(this, 'enterDocument');
  this.update();

  // this.getHandler().listen(/** @type {anychart.chartEditor2Module.EditorModel} */(this.getModel()),
  //     anychart.chartEditor2Module.events.EventType.EDITOR_MODEL_UPDATE, this.update);
};


/** @inheritDoc */
anychart.chartEditor2Module.AppearanceSettings.prototype.update = function() {
  var model = /** @type {anychart.chartEditor2Module.EditorModel} */(this.getModel());

  for (var i = 0; i < this.panels_.length; i++) {
    if (this.panels_[i].instance)
      this.panels_[i].instance.update();
    else {
      var classFunc = this.panels_[i].classFunc;
      this.panels_[i].instance = new classFunc(model);
      this.addChild(this.panels_[i].instance, true);
    }
  }
};
