goog.provide('anychart.chartEditor2Module.settings.Title');

goog.require('anychart.chartEditor2Module.SettingsPanel');
goog.require('anychart.chartEditor2Module.button.Bold');
goog.require('anychart.chartEditor2Module.button.Italic');
goog.require('anychart.chartEditor2Module.button.Underline');
goog.require('anychart.chartEditor2Module.checkbox.Base');
goog.require('anychart.chartEditor2Module.colorPicker.Base');
goog.require('anychart.chartEditor2Module.comboBox.Base');
goog.require('anychart.chartEditor2Module.input.Base');
goog.require('anychart.chartEditor2Module.select.Align');
goog.require('anychart.chartEditor2Module.select.Base');
goog.require('anychart.chartEditor2Module.select.FontFamily');
goog.require('goog.ui.ButtonSide');



/**
 * @param {anychart.chartEditor2Module.EditorModel} model
 * @param {?string=} opt_name
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper; see {@link goog.ui.Component} for semantics.
 * @constructor
 * @extends {anychart.chartEditor2Module.SettingsPanel}
 */
anychart.chartEditor2Module.settings.Title = function(model, opt_name, opt_domHelper) {
  anychart.chartEditor2Module.settings.Title.base(this, 'constructor', model, opt_domHelper);

  this.name = opt_name;
};
goog.inherits(anychart.chartEditor2Module.settings.Title, anychart.chartEditor2Module.SettingsPanel);


/**
 * Default CSS class.
 * @type {string}
 */
anychart.chartEditor2Module.settings.Title.CSS_CLASS = goog.getCssName('settings-title');


/**
 * @type {boolean}
 * @private
 */
anychart.chartEditor2Module.settings.Title.prototype.allowEditTitle_ = true;


/** @param {boolean} value */
anychart.chartEditor2Module.settings.Title.prototype.allowEditTitle = function(value) {
  this.allowEditTitle_ = value;
};


/**
 * @type {string}
 * @private
 */
anychart.chartEditor2Module.settings.Title.prototype.titleKey_ = 'text()';


/** @param {string} value */
anychart.chartEditor2Module.settings.Title.prototype.setTitleKey = function(value) {
  this.titleKey_ = value;
};


/**
 * @type {boolean}
 * @private
 */
anychart.chartEditor2Module.settings.Title.prototype.allowEditPosition_ = true;


/** @param {boolean} value */
anychart.chartEditor2Module.settings.Title.prototype.allowEditPosition = function(value) {
  this.allowEditPosition_ = value;
};


/**
 * @type {string}
 * @private
 */
anychart.chartEditor2Module.settings.Title.prototype.positionKey_ = 'position()';


/** @param {string} value */
anychart.chartEditor2Module.settings.Title.prototype.setPositionKey = function(value) {
  this.positionKey_ = value;
};


/**
 * @type {boolean}
 * @private
 */
anychart.chartEditor2Module.settings.Title.prototype.allowEditAlign_ = true;


/** @param {boolean} value */
anychart.chartEditor2Module.settings.Title.prototype.allowEditAlign = function(value) {
  this.allowEditAlign_ = value;
};


/**
 * @type {boolean}
 * @private
 */
anychart.chartEditor2Module.settings.Title.prototype.allowEditColor_ = true;


/** @param {boolean} value */
anychart.chartEditor2Module.settings.Title.prototype.allowEditColor = function(value) {
  this.allowEditColor_ = value;
};


/** @inheritDoc */
anychart.chartEditor2Module.settings.Title.prototype.setKey = function(key) {
  anychart.chartEditor2Module.settings.Title.base(this, 'setKey', key);
  this.updateKeys();
};


/**
 * @type {?string}
 * @private
 */
anychart.chartEditor2Module.settings.Title.prototype.orientationKey_ = null;


/** @param {string|Array.<string>} value */
anychart.chartEditor2Module.settings.Title.prototype.setOrientationKey = function(value) {
  this.orientationKey_ = goog.isArray(value) ? value[0] : value;
  this.updateKeys();
};

/** @override */
anychart.chartEditor2Module.settings.Title.prototype.disposeInternal = function() {
  this.textInput_ = null;
  this.positionSelect_ = null;
  this.alignSelect_ = null;
  this.fontFamilySelect_ = null;
  this.fontSizeSelect_ = null;
  this.boldBtn_ = null;
  this.italicBtn_ = null;
  this.underlineBtn_ = null;
  this.colorPicker_ = null;

  anychart.chartEditor2Module.settings.Title.base(this, 'disposeInternal');
};


/** @override */
anychart.chartEditor2Module.settings.Title.prototype.createDom = function() {
  anychart.chartEditor2Module.settings.Title.base(this, 'createDom');

  var element = this.getElement();
  goog.dom.classlist.add(element, anychart.chartEditor2Module.settings.Title.CSS_CLASS);

  var textInput = null;
  if (this.allowEditTitle_) {
    textInput = new anychart.chartEditor2Module.input.Base(/*'Chart title'*/);
    this.addChild(textInput, true);
    goog.dom.classlist.add(textInput.getElement(), 'title-text');
  }

  var colorPicker = null;
  if (this.allowEditColor_) {
    if (!this.allowEditTitle_) {
      var colorLabel = goog.dom.createDom(
          goog.dom.TagName.LABEL,
          [
            goog.ui.INLINE_BLOCK_CLASSNAME,
            goog.getCssName('anychart-chart-editor-settings-label')
          ],
          'Font color');
      goog.dom.appendChild(element, colorLabel);
    }

    colorPicker = new anychart.chartEditor2Module.colorPicker.Base();
    colorPicker.addClassName(goog.getCssName('title-color'));
    this.addChild(colorPicker, true);

    goog.dom.appendChild(element, goog.dom.createDom(
        goog.dom.TagName.DIV,
        goog.getCssName('anychart-chart-editor-settings-item-gap-mini')));
  }

  var fontFamily = new anychart.chartEditor2Module.select.FontFamily();
  fontFamily.addClassName(goog.getCssName('title-font-family'));
  this.addChild(fontFamily, true);

  var fontSizeSelect = new anychart.chartEditor2Module.comboBox.Base();
  fontSizeSelect.setOptions([10, 12, 14, 16, 18, 20, 22]);
  this.addChild(fontSizeSelect, true);
  goog.dom.classlist.add(fontSizeSelect.getElement(), goog.getCssName('title-font-size'));

  var buttonsWrapper = goog.dom.createDom(
      goog.dom.TagName.DIV,
      goog.getCssName('title-font-style-buttons'));
  goog.dom.appendChild(element, buttonsWrapper);

  var boldBtn = new anychart.chartEditor2Module.button.Bold();
  boldBtn.addClassName(goog.getCssName('anychart-chart-editor-settings-bold'));
  this.addChild(boldBtn, true);
  goog.dom.appendChild(buttonsWrapper, boldBtn.getElement());

  var italicBtn = new anychart.chartEditor2Module.button.Italic();
  this.addChild(italicBtn, true);
  goog.dom.appendChild(buttonsWrapper, italicBtn.getElement());

  var underlineBtn = new anychart.chartEditor2Module.button.Underline();
  this.addChild(underlineBtn, true);
  goog.dom.appendChild(buttonsWrapper, underlineBtn.getElement());

  // The setCollapsed method needs to be called after the toolbar is rendered
  // for it to pick up the directionality of the toolbar.
  boldBtn.setCollapsed(goog.ui.ButtonSide.END);
  italicBtn.setCollapsed(
      goog.ui.ButtonSide.END | goog.ui.ButtonSide.START);
  underlineBtn.setCollapsed(goog.ui.ButtonSide.START);

  var positionSelect = null;
  if (this.allowEditPosition_) {
    goog.dom.appendChild(element, goog.dom.createDom(
        goog.dom.TagName.DIV,
        goog.getCssName('anychart-chart-editor-settings-item-gap')));

    var positionLabel = goog.dom.createDom(
        goog.dom.TagName.LABEL,
        [
          goog.ui.INLINE_BLOCK_CLASSNAME,
          goog.getCssName('anychart-chart-editor-settings-label')
        ],
        'Orientation');
    goog.dom.appendChild(element, positionLabel);

    positionSelect = new anychart.chartEditor2Module.select.Base();
    positionSelect.addClassName(goog.getCssName('anychart-chart-editor-settings-control-select-image'));
    positionSelect.addClassName(goog.getCssName('anychart-chart-editor-settings-control-right'));

    var positionSelectMenu = positionSelect.getMenu();
    positionSelectMenu.setOrientation(goog.ui.Container.Orientation.HORIZONTAL);

    positionSelect.setOptions(['left', 'right', 'top', 'bottom']);
    positionSelect.setCaptions([null, null, null, null]);
    positionSelect.setIcons(['ac ac-position-left', 'ac ac-position-right', 'ac ac-position-top', 'ac ac-position-bottom']);
    this.addChild(positionSelect, true);
  }

  var alignSelect = null;
  if (this.allowEditAlign_) {
    goog.dom.appendChild(element, goog.dom.createDom(
        goog.dom.TagName.DIV,
        goog.getCssName('anychart-chart-editor-settings-item-gap')));

    var alignLabel = goog.dom.createDom(
        goog.dom.TagName.LABEL,
        [
          goog.ui.INLINE_BLOCK_CLASSNAME,
          goog.getCssName('anychart-chart-editor-settings-label')
        ],
        'Align');
    goog.dom.appendChild(element, alignLabel);

    alignSelect = new anychart.chartEditor2Module.select.Align();
    alignSelect.addClassName(goog.getCssName('anychart-chart-editor-settings-control-select-image'));
    alignSelect.addClassName(goog.getCssName('anychart-chart-editor-settings-control-right'));

    var alignSelectMenu = alignSelect.getMenu();
    alignSelectMenu.setOrientation(goog.ui.Container.Orientation.HORIZONTAL);

    this.addChild(alignSelect, true);
  }

  this.textInput_ = textInput;
  this.positionSelect_ = positionSelect;
  this.alignSelect_ = alignSelect;

  this.fontFamilySelect_ = fontFamily;
  this.fontSizeSelect_ = fontSizeSelect;
  this.boldBtn_ = boldBtn;
  this.italicBtn_ = italicBtn;
  this.underlineBtn_ = underlineBtn;
  this.colorPicker_ = colorPicker;

  this.colorLabel_ = colorLabel;
  this.positionLabel_ = positionLabel;
  this.alignLabel_ = alignLabel;

  this.updateKeys();
};


/** @inheritDoc */
anychart.chartEditor2Module.settings.Title.prototype.onChartDraw = function(evt) {
  anychart.chartEditor2Module.settings.Title.base(this, 'onChartDraw', evt);

  var target = evt.chart;
  if (this.textInput_) this.textInput_.setValueByTarget(target, true);
  if (this.positionSelect_) this.positionSelect_.setValueByTarget(target);
  if (this.alignSelect_) {
    if (this.positionSelect_)
      this.alignSelect_.updateIcons(this.positionSelect_.getValue());
    this.alignSelect_.setValueByTarget(target);
  }
  if (this.fontFamilySelect_) this.fontFamilySelect_.setValueByTarget(target);
  if (this.fontSizeSelect_) this.fontSizeSelect_.setValueByTarget(target);
  if (this.boldBtn_) this.boldBtn_.setValueByTarget(target);
  if (this.italicBtn_) this.italicBtn_.setValueByTarget(target);
  if (this.underlineBtn_) this.underlineBtn_.setValueByTarget(target);
  if (this.colorPicker_) this.colorPicker_.setValueByTarget(target);
};


/**
 * Update model keys.
 */
anychart.chartEditor2Module.settings.Title.prototype.updateKeys = function() {
  var model = /** @type {anychart.chartEditor2Module.EditorModel} */(this.getModel());

  if (this.enabledBtn_) this.enabledBtn_.init(model, this.genKey('enabled()'));
  if (this.textInput_) this.textInput_.init(model, this.genKey(this.titleKey_));
  if (this.positionSelect_) this.positionSelect_.init(model, this.genKey(this.positionKey_));
  if (this.alignSelect_) {
    this.alignSelect_.setOrientationKey(this.orientationKey_ ? this.orientationKey_ : this.genKey('orientation()'));
    this.alignSelect_.init(model, this.genKey('align()'));
  }
  if (this.fontFamilySelect_) this.fontFamilySelect_.init(model, this.genKey('fontFamily()'));
  if (this.fontSizeSelect_) this.fontSizeSelect_.init(model, this.genKey('fontSize()'));
  if (this.boldBtn_) this.boldBtn_.init(model, this.genKey('fontWeight()'));
  if (this.italicBtn_) this.italicBtn_.init(model, this.genKey('fontStyle()'));
  if (this.underlineBtn_) this.underlineBtn_.init(model, this.genKey('fontDecoration()'));
  if (this.colorPicker_) this.colorPicker_.init(model, this.genKey('fontColor()'));
};


anychart.chartEditor2Module.settings.Title.prototype.setEnabled = function(enabled) {
  anychart.chartEditor2Module.settings.Title.base(this, 'setEnabled', enabled);
};

/**
 * Enables/Disables the Title settings.
 * @param {boolean} enabled Whether to enable (true) or disable (false) the
 *     title settings.
 */
anychart.chartEditor2Module.settings.Title.prototype.setContentEnabled = function(enabled) {
  if (this.titleHeader_) {
    goog.dom.classlist.enable(
        goog.asserts.assert(this.titleHeader_),
        goog.getCssName('anychart-control-disabled'), !enabled);
  }

  if (this.colorLabel_) {
    goog.dom.classlist.enable(
        goog.asserts.assert(this.colorLabel_),
        goog.getCssName('anychart-control-disabled'), !enabled);
  }

  if (this.positionLabel_) {
    goog.dom.classlist.enable(
        goog.asserts.assert(this.positionLabel_),
        goog.getCssName('anychart-control-disabled'), !enabled);
  }

  if (this.alignLabel_) {
    goog.dom.classlist.enable(
        goog.asserts.assert(this.alignLabel_),
        goog.getCssName('anychart-control-disabled'), !enabled);
  }

  anychart.chartEditor2Module.settings.Title.base(this, 'setContentEnabled', enabled);
};