goog.provide('anychart.chartEditor2Module.AxesPanelBase');

goog.require('anychart.chartEditor2Module.SettingsPanel');
goog.require('anychart.chartEditor2Module.settings.Axis');
goog.require('goog.ui.Button');



/**
 * @param {anychart.chartEditor2Module.EditorModel} model
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper; see {@link goog.ui.Component} for semantics.
 * @constructor
 * @extends {anychart.chartEditor2Module.SettingsPanel}
 */
anychart.chartEditor2Module.AxesPanelBase = function(model, opt_domHelper) {
  anychart.chartEditor2Module.AxesPanelBase.base(this, 'constructor', model, opt_domHelper);

  this.name = 'AxesPanelBase';

  this.stringId = 'axes';

  this.axes_ = [];

  /**
   * Axis prefix. Should be overriden.
   * @type {string}
   * @protected
   */
  this.xOrY = '';
};
goog.inherits(anychart.chartEditor2Module.AxesPanelBase, anychart.chartEditor2Module.SettingsPanel);


/** @inheritDoc */
anychart.chartEditor2Module.AxesPanelBase.prototype.createDom = function() {
  anychart.chartEditor2Module.AxesPanelBase.base(this, 'createDom');
  var element = /** @type {Element} */(this.getElement());
  var content = /** @type {Element} */(this.getContentElement());
  var dom = this.getDomHelper();
  goog.dom.classlist.add(element, 'settings-panel-axes');

  this.axisContainer_ = dom.createDom(goog.dom.TagName.DIV, null);
  content.appendChild(this.axisContainer_);

  this.addAxisBtn_ = new goog.ui.Button('Add axis');
  this.addChild(this.addAxisBtn_, true);
};


/** @inheritDoc */
anychart.chartEditor2Module.AxesPanelBase.prototype.enterDocument = function() {
  anychart.chartEditor2Module.AxesPanelBase.base(this, 'enterDocument');
  this.getHandler().listen(this.addAxisBtn_, goog.ui.Component.EventType.ACTION, this.onAddAxis_);
};


/** @inheritDoc */
anychart.chartEditor2Module.AxesPanelBase.prototype.update = function(evt) {
  anychart.chartEditor2Module.AxesPanelBase.base(this, 'update');
  this.removeAllAxes();
  this.createAxes();
};


/** @private */
anychart.chartEditor2Module.AxesPanelBase.prototype.onAddAxis_ = function() {
  var model = /** @type {anychart.chartEditor2Module.EditorModel} */(this.getModel());
  model.addAxis(this.xOrY);
};


/**
 * Create Axes settings panels.
 */
anychart.chartEditor2Module.AxesPanelBase.prototype.createAxes = function() {
  if (this.isExcluded()) return;

  var model = /** @type {anychart.chartEditor2Module.EditorModel} */(this.getModel());
  var options = model.getModel();
  var settings = options['chart']['settings'];

  var firstAxisEnabled = settings[this.xOrY + 'Axis(0).enabled()'];
  if (!goog.isDef(firstAxisEnabled)) {
    model.setValue([['chart'], ['settings'], this.xOrY + 'Axis(0).enabled()'], true, true);
  }

  var pattern = '^' + this.xOrY + 'Axis\\((\\d+)\\)\\.enabled\\(\\)$';
  var regExp = new RegExp(pattern);
  for (var key in settings) {
    var match = key.match(regExp);
    if (match) {
      var axisIndex = match[1];
      var axis = new anychart.chartEditor2Module.settings.Axis(model, this.xOrY, Number(axisIndex));
      axis.allowEnabled(true);
      axis.allowRemove(axisIndex > 0);
      this.axes_.push(axis);
      this.addChild(axis, true);
      this.axisContainer_.appendChild(axis.getElement());
    }
  }
};


/**
 * Removes all Axes panels elements from panel.
 * @private
 */
anychart.chartEditor2Module.AxesPanelBase.prototype.removeAllAxes = function() {
  for (var i = 0; i < this.axes_.length; i++) {
    this.removeChild(this.axes_[i], true);
    this.axes_[i].dispose();
  }
  this.axes_.length = 0;
};


/** @inheritDoc */
anychart.chartEditor2Module.AxesPanelBase.prototype.exitDocument = function() {
  this.removeAllAxes();
  anychart.chartEditor2Module.AxesPanelBase.base(this, 'exitDocument');
};


/** @override */
anychart.chartEditor2Module.AxesPanelBase.prototype.disposeInternal = function() {
  this.removeAllAxes();
  anychart.chartEditor2Module.AxesPanelBase.base(this, 'disposeInternal');
};
