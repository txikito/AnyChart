goog.provide('anychart.chartEditor2Module.LegendPanel');

goog.require('anychart.chartEditor2Module.SettingsPanel');
goog.require('anychart.chartEditor2Module.select.Base');
goog.require('anychart.chartEditor2Module.settings.Title');



/**
 * @param {anychart.chartEditor2Module.EditorModel} model
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper; see {@link goog.ui.Component} for semantics.
 * @constructor
 * @extends {anychart.chartEditor2Module.SettingsPanel}
 */
anychart.chartEditor2Module.LegendPanel = function(model, opt_domHelper) {
  anychart.chartEditor2Module.LegendPanel.base(this, 'constructor', model, opt_domHelper);

  this.name = 'Legend';

  this.key = [['chart'], ['settings'], 'legend()'];
};
goog.inherits(anychart.chartEditor2Module.LegendPanel, anychart.chartEditor2Module.SettingsPanel);


/** @inheritDoc */
anychart.chartEditor2Module.LegendPanel.prototype.createDom = function() {
  anychart.chartEditor2Module.LegendPanel.base(this, 'createDom');

  var content = this.getContentElement();
  var model = /** @type {anychart.chartEditor2Module.EditorModel} */(this.getModel());

  var itemsHeader = goog.dom.createDom(
      goog.dom.TagName.DIV,
      goog.getCssName('anychart-chart-editor-settings-header'),
      'Appearance');
  goog.dom.appendChild(content, itemsHeader);

  //region Layout
  var layoutLabel = goog.dom.createDom(
      goog.dom.TagName.LABEL,
      [
        goog.ui.INLINE_BLOCK_CLASSNAME,
        goog.getCssName('anychart-chart-editor-settings-label')
      ],
      'Layout');
  goog.dom.appendChild(content, layoutLabel);

  var layoutSelect = new anychart.chartEditor2Module.select.Base();
  layoutSelect.addClassName(goog.getCssName('anychart-chart-editor-settings-control-medium'));
  layoutSelect.addClassName(goog.getCssName('anychart-chart-editor-settings-control-right'));
  layoutSelect.setOptions(['horizontal', 'vertical']);
  layoutSelect.setCaptions(['Horizontal', 'Vertical']);
  layoutSelect.init(model, [['chart'], ['settings'], 'legend().itemsLayout()']);
  this.addChild(layoutSelect, true);
  //endregion

  goog.dom.appendChild(content, goog.dom.createDom(
      goog.dom.TagName.DIV,
      goog.getCssName('anychart-chart-editor-settings-item-gap')));

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
  orientationSelect.addClassName(goog.getCssName('anychart-chart-editor-settings-control-medium'));
  orientationSelect.addClassName(goog.getCssName('anychart-chart-editor-settings-control-right'));
  orientationSelect.setOptions(['left', 'right', 'top', 'bottom']);
  orientationSelect.setCaptions(['Left', 'Right', 'Top', 'Bottom']);
  orientationSelect.init(model, [['chart'], ['settings'], 'legend().position()']);
  this.addChild(orientationSelect, true);
  //endregion

  goog.dom.appendChild(content, goog.dom.createDom(
      goog.dom.TagName.DIV,
      goog.getCssName('anychart-chart-editor-settings-item-gap')));

  //region Align
  var alignLabel = goog.dom.createDom(
      goog.dom.TagName.LABEL,
      [
        goog.ui.INLINE_BLOCK_CLASSNAME,
        goog.getCssName('anychart-chart-editor-settings-label')
      ],
      'Align');
  goog.dom.appendChild(content, alignLabel);

  var alignSelect = new anychart.chartEditor2Module.select.Base();
  alignSelect.addClassName(goog.getCssName('anychart-chart-editor-settings-control-medium'));
  alignSelect.addClassName(goog.getCssName('anychart-chart-editor-settings-control-right'));
  alignSelect.setOptions(['left', 'center', 'right']);
  alignSelect.setCaptions(['Left', 'Center', 'Right']);
  alignSelect.init(model, [['chart'], ['settings'], 'legend().align()']);
  this.addChild(alignSelect, true);
  //endregion

  goog.dom.appendChild(content, goog.dom.createDom(
      goog.dom.TagName.DIV,
      goog.getCssName('anychart-chart-editor-settings-item-gap')));

  var items = new anychart.chartEditor2Module.settings.Title(model);
  items.allowEnabled(false);
  items.allowEditTitle(false);
  items.allowEditPosition(false);
  items.allowEditAlign(false);
  items.allowEditColor(false);
  items.setKey([['chart'], ['settings'], 'legend()']);
  this.addChild(items, true);

  goog.dom.appendChild(content, goog.dom.createDom(
      goog.dom.TagName.DIV,
      goog.getCssName('anychart-chart-editor-settings-item-gap')));

  var title = new anychart.chartEditor2Module.settings.Title(model, 'Title');
  title.setPositionKey('orientation()');
  title.setKey([['chart'], ['settings'], 'legend().title()']);
  this.addChild(title, true);

  this.itemsLayout_ = layoutSelect;
  this.itemsOrientation_ = orientationSelect;
  this.itemsAlign_ = alignSelect;
  this.items_ = items;
  this.title_ = title;

  this.itemsHeader_ = itemsHeader;
  this.layoutLabel_ = layoutLabel;
  this.orientationLabel_ = orientationLabel;
  this.alignLabel_ = alignLabel;
};


/** @inheritDoc */
anychart.chartEditor2Module.LegendPanel.prototype.onChartDraw = function(evt) {
  anychart.chartEditor2Module.LegendPanel.base(this, 'onChartDraw', evt);

  this.itemsLayout_.setValueByTarget(evt.chart);
  this.itemsOrientation_.setValueByTarget(evt.chart);
  this.itemsAlign_.setValueByTarget(evt.chart);
};


/** @override */
anychart.chartEditor2Module.LegendPanel.prototype.setContentEnabled = function(enabled) {
  anychart.chartEditor2Module.LegendPanel.base(this, 'setContentEnabled', enabled);

  if (this.itemsHeader_) {
    goog.dom.classlist.enable(
        goog.asserts.assert(this.itemsHeader_),
        goog.getCssName('anychart-control-disabled'), !enabled);
  }

  if (this.layoutLabel_) {
    goog.dom.classlist.enable(
        goog.asserts.assert(this.layoutLabel_),
        goog.getCssName('anychart-control-disabled'), !enabled);
  }

  if (this.orientationLabel_) {
    goog.dom.classlist.enable(
        goog.asserts.assert(this.orientationLabel_),
        goog.getCssName('anychart-control-disabled'), !enabled);
  }

  if (this.alignLabel_) {
    goog.dom.classlist.enable(
        goog.asserts.assert(this.alignLabel_),
        goog.getCssName('anychart-control-disabled'), !enabled);
  }
};


/** @override */
anychart.chartEditor2Module.LegendPanel.prototype.disposeInternal = function() {
  this.itemsLayout_ = null;
  this.itemsOrientation_ = null;
  this.itemsAlign_ = null;
  this.title_ = null;
  this.items_ = null;

  anychart.chartEditor2Module.LegendPanel.base(this, 'disposeInternal');
};
