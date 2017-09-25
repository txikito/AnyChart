goog.provide('anychart.chartEditor2Module.settings.Axis');

goog.require('anychart.chartEditor2Module.IconButtonRenderer');
goog.require('anychart.chartEditor2Module.SettingsPanel');



/**
 * @param {anychart.chartEditor2Module.EditorModel} model
 * @param {string} xOrY
 * @param {number} index
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper; see {@link goog.ui.Component} for semantics.
 * @constructor
 * @extends {anychart.chartEditor2Module.SettingsPanel}
 */
anychart.chartEditor2Module.settings.Axis = function(model, xOrY, index, opt_domHelper) {
  anychart.chartEditor2Module.settings.Axis.base(this, 'constructor', model, opt_domHelper);
  this.xOrY_ = xOrY;
  this.index_ = index;
  this.name = this.xOrY_ + 'Axis(' + this.index_ + ')';
  this.key = [['chart'], ['settings'], this.xOrY_ + 'Axis(' + this.index_ + ')'];
};
goog.inherits(anychart.chartEditor2Module.settings.Axis, anychart.chartEditor2Module.SettingsPanel);


/**
 * Default CSS class.
 * @type {string}
 */
anychart.chartEditor2Module.settings.Axis.CSS_CLASS = goog.getCssName('settings-axis');


/** @override */
anychart.chartEditor2Module.settings.Axis.prototype.createDom = function() {
  anychart.chartEditor2Module.settings.Axis.base(this, 'createDom');

  var element = this.getElement();
  goog.dom.classlist.add(element, anychart.chartEditor2Module.settings.Axis.CSS_CLASS);
  goog.dom.classlist.add(element, this.index_ % 2 ? 'even' : 'odd');

  var content = this.getContentElement();
  var model = /** @type {anychart.chartEditor2Module.EditorModel} */(this.getModel());

  var invertedCheckbox = new anychart.chartEditor2Module.checkbox.Base();
  invertedCheckbox.setCaption('Inverted');
  this.addChild(invertedCheckbox, true);
  this.inverted_ = invertedCheckbox;

  goog.dom.appendChild(content, goog.dom.createDom(
      goog.dom.TagName.DIV,
      goog.getCssName('anychart-chart-editor-settings-item-gap-mini')));

  //region Orientation
  var orientationLabel = goog.dom.createDom(
      goog.dom.TagName.LABEL,
      [
        goog.ui.INLINE_BLOCK_CLASSNAME,
        goog.getCssName('anychart-chart-editor-settings-label')
      ],
      'Orientation');
  goog.dom.appendChild(content, orientationLabel);

  var orientationSelect = new anychart.chartEditor2Module.select.Base();
  orientationSelect.addClassName(goog.getCssName('anychart-chart-editor-settings-control-select-image'));
  orientationSelect.addClassName(goog.getCssName('anychart-chart-editor-settings-control-right'));
  var orientationSelectMenu = orientationSelect.getMenu();
  orientationSelectMenu.setOrientation(goog.ui.Container.Orientation.HORIZONTAL);
  orientationSelect.setOptions(['left', 'right', 'top', 'bottom']);
  orientationSelect.setCaptions([null, null, null, null]);
  orientationSelect.setIcons(['ac ac-position-left', 'ac ac-position-right', 'ac ac-position-top', 'ac ac-position-bottom']);
  this.addChild(orientationSelect, true);

  goog.dom.appendChild(content, goog.dom.createDom(
      goog.dom.TagName.DIV,
      goog.getCssName('anychart-chart-editor-settings-item-gap-mini')));
  //endregion

  this.orientationLabel_ = orientationLabel;
  this.orientation_ = orientationSelect;
};


/** @inheritDoc */
anychart.chartEditor2Module.settings.Axis.prototype.onRemoveAction = function(evt) {
  var model = /** @type {anychart.chartEditor2Module.EditorModel} */(this.getModel());
  model.dropAxis(this.xOrY_, this.index_);
};



/** @inheritDoc */
anychart.chartEditor2Module.settings.Axis.prototype.updateKeys = function() {
  if (!this.isExcluded()) {
    var stringKey = this.xOrY_ + 'Axis(' + this.index_ + ')';
    this.name = this.xOrY_ + 'Axis(' + this.index_ + ')';
    if (goog.isDef(this.plotIndex_)) {
      stringKey = 'plot(' + this.plotIndex_ + ').' + stringKey;
      this.name += this.name + ' :: Plot ' + this.plotIndex_;
    }
    this.key = [['chart'], ['settings'], stringKey];

    var model = /** @type {anychart.chartEditor2Module.EditorModel} */(this.getModel());
    if (this.orientation_) this.orientation_.init(model, this.genKey('orientation()'));
    if (this.inverted_) this.inverted_.init(model, [['chart'], ['settings'], this.xOrY_ + 'Scale().inverted()']);
  }

  anychart.chartEditor2Module.settings.Axis.base(this, 'updateKeys');
};


/** @inheritDoc */
anychart.chartEditor2Module.settings.Axis.prototype.onChartDraw = function(evt) {
  anychart.chartEditor2Module.settings.Axis.base(this, 'onChartDraw', evt);
  if (this.isExcluded()) return;

  var target = evt.chart;
  this.orientation_.setValueByTarget(target);
  this.inverted_.setValueByTarget(target);
};


/** @override */
anychart.chartEditor2Module.settings.Axis.prototype.disposeInternal = function() {
  this.orientation_ = null;
  this.inverted_ = null;

  anychart.chartEditor2Module.settings.Axis.base(this, 'disposeInternal');
};


/** @inheritDoc */
anychart.chartEditor2Module.settings.Axis.prototype.setContentEnabled = function(enabled) {
  if (this.orientationLabel_) {
    goog.dom.classlist.enable(
        goog.asserts.assert(this.orientationLabel_),
        goog.getCssName('anychart-control-disabled'), !enabled);
  }

  // if (this.invertedLabel_) {
  //   goog.dom.classlist.enable(
  //       goog.asserts.assert(this.invertedLabel_),
  //       goog.getCssName('anychart-control-disabled'), !enabled);
  // }

  anychart.chartEditor2Module.settings.Axis.base(this, 'setContentEnabled', enabled);
};
