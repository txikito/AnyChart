goog.provide('anychart.chartEditor2Module.AppearanceSettings');

goog.require('anychart.chartEditor2Module.ChartTitlePanel');
goog.require('anychart.chartEditor2Module.Component');
goog.require('anychart.chartEditor2Module.CreditsPanel');
goog.require('anychart.chartEditor2Module.DataLabelsPanel');
goog.require('anychart.chartEditor2Module.EditorModel');
goog.require('anychart.chartEditor2Module.GeneralTheming');
goog.require('anychart.chartEditor2Module.LegendPanel');
goog.require('anychart.chartEditor2Module.SeriesSettingsPanel');


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
    {classFunc: anychart.chartEditor2Module.ChartTitlePanel, instance: null},
    {classFunc: anychart.chartEditor2Module.LegendPanel, instance: null},
    {classFunc: anychart.chartEditor2Module.DataLabelsPanel, instance: null},
    {classFunc: anychart.chartEditor2Module.SeriesSettingsPanel, instance: null}
    // {classFunc: anychart.chartEditor2Module.GeneralTheming, instance: null},
    // {classFunc: anychart.chartEditor2Module.CreditsPanel, instance: null}
  ];

  this.currentPanel_ = 0;

  this.buttons_ = [];
};
goog.inherits(anychart.chartEditor2Module.AppearanceSettings, anychart.chartEditor2Module.Component);


/** @inheritDoc */
anychart.chartEditor2Module.AppearanceSettings.prototype.createDom = function() {
  anychart.chartEditor2Module.AppearanceSettings.base(this, 'createDom');

  var element = /** @type {Element} */(this.getElement());
  goog.dom.classlist.add(element, 'appearance-settings');

  var dom = this.getDomHelper();
  this.buttonsEl_ = dom.createDom(goog.dom.TagName.DIV, 'buttons');
  element.appendChild(this.buttonsEl_);
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
  var dom = this.getDomHelper();
  var handler = this.getHandler();
  var panel;
  var button;

  for (var i = 0; i < this.panels_.length; i++) {
    panel = this.panels_[i].instance;
    if (!panel) {
      var classFunc = this.panels_[i].classFunc;
      panel = this.panels_[i].instance = new classFunc(model);
      this.addChild(panel, true);

      button = dom.createDom(goog.dom.TagName.DIV, 'button', panel.getName());
      button.setAttribute('data-index', i);
      this.buttons_.push(button);

      dom.appendChild(this.buttonsEl_, button);
    }

    // panel.update();
    goog.dom.classlist.enable(panel.getElement(), 'hidden', this.currentPanel_ != i);
  }

  for (var j = 0; j < this.buttons_.length; j++) {
    button = this.buttons_[j];
    goog.dom.classlist.enable(button, 'active', this.currentPanel_ == j);

    if (!goog.events.hasListener(button, goog.events.EventType.CLICK))
      handler.listen(button, goog.events.EventType.CLICK, this.onClickCategoryButton_);
  }
};


/**
 *
 * @param {Object} evt
 * @private
 */
anychart.chartEditor2Module.AppearanceSettings.prototype.onClickCategoryButton_ = function(evt) {
  var index = Number(evt.currentTarget.getAttribute('data-index'));
  if (this.currentPanel_ != index) {
    this.currentPanel_ = index;

    for (var i = 0; i < this.panels_.length; i++) {
      var panel = this.panels_[i].instance;
      goog.dom.classlist.enable(panel.getElement(), 'hidden', this.currentPanel_ != i);
      goog.dom.classlist.enable(this.buttons_[i], 'active', this.currentPanel_ == i);
    }
  }
};