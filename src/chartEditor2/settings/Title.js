goog.provide('anychart.chartEditor2Module.settings.Title');

goog.require('anychart.chartEditor2Module.button.Bold');
goog.require('anychart.chartEditor2Module.button.Italic');
goog.require('anychart.chartEditor2Module.button.Underline');

goog.require('anychart.chartEditor2Module.checkbox.Base');
goog.require('anychart.chartEditor2Module.colorPicker.Base');
goog.require('anychart.chartEditor2Module.comboBox.Base');
goog.require('anychart.chartEditor2Module.select.Align');
goog.require('anychart.chartEditor2Module.select.Base');
goog.require('anychart.chartEditor2Module.select.FontFamily');
goog.require('anychart.chartEditor2Module.input.Base');

goog.require('goog.ui.ButtonSide');
goog.require('anychart.chartEditor2Module.Component');



/**
 * @constructor
 * @extends {anychart.chartEditor2Module.Component}
 */
anychart.chartEditor2Module.settings.Title = function() {
  anychart.chartEditor2Module.settings.Title.base(this, 'constructor');

  this.enabled_ = true;
};
goog.inherits(anychart.chartEditor2Module.settings.Title, anychart.chartEditor2Module.Component);


/**
 * Default CSS class.
 * @type {string}
 */
anychart.chartEditor2Module.settings.Title.CSS_CLASS = goog.getCssName('anychart-chart-editor-settings-title');


/**
 * Container for enabled button.
 * @type {Element}
 * @private
 */
anychart.chartEditor2Module.settings.Title.prototype.enabledButtonContainer_ = null;


/**
 * Set container for enabled button.
 * @param {Element} enabledButtonContainer
 */
anychart.chartEditor2Module.settings.Title.prototype.setEnabledButtonContainer = function(enabledButtonContainer) {
  this.enabledButtonContainer_ = enabledButtonContainer;
};


/**
 * @type {string}
 * @private
 */
anychart.chartEditor2Module.settings.Title.prototype.headerText_ = 'Title';


/** @param {string} value */
anychart.chartEditor2Module.settings.Title.prototype.setHeaderText = function(value) {
  this.headerText_ = value;
};


/**
 * @type {boolean}
 * @private
 */
anychart.chartEditor2Module.settings.Title.prototype.allowEnabled_ = true;


/** @param {boolean} value */
anychart.chartEditor2Module.settings.Title.prototype.allowEnabled = function(value) {
  this.allowEnabled_ = value;
};


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


/**
 * @type {string|Array.<string>}
 * @private
 */
anychart.chartEditor2Module.settings.Title.prototype.key_ = '';


/** @param {string|Array.<string>} value */
anychart.chartEditor2Module.settings.Title.prototype.setKey = function(value) {
  if (this.key_ != value) {
    this.key_ = value;
    this.updateKeys();
  }
};


/**
 * @param {string} opt_completion
 * @return {anychart.chartEditor2Module.EditorModel.Key}
 */
anychart.chartEditor2Module.settings.Title.prototype.genKey = function(opt_completion) {
  var result = [];

  for (var i = 0, count = this.key_.length; i < count; i++) {
    if (i == count - 1)
      result.push(this.key_[i] + '.' + opt_completion);
    else
      result.push(this.key_[i]);
  }

  return result;
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


/**
 * Enables/Disables the Title settings.
 * @param {boolean} enabled Whether to enable (true) or disable (false) the
 *     title settings.
 */
anychart.chartEditor2Module.settings.Title.prototype.setEnabled = function(enabled) {
  this.enabled_ = true;

  this.forEachChild(function(child) {
    child.setEnabled(enabled);
  });

  if (this.enabledBtn_) this.enabledBtn_.setEnabled(enabled);

  this.enabled_ = enabled;

  // if (this.titleHeader_) {
  //   goog.dom.classlist.enable(
  //       goog.asserts.assert(this.titleHeader_),
  //       goog.getCssName('anychart-control-disabled'), !enabled);
  // }
  //
  // if (this.colorLabel_) {
  //   goog.dom.classlist.enable(
  //       goog.asserts.assert(this.colorLabel_),
  //       goog.getCssName('anychart-control-disabled'), !enabled);
  // }

  if (this.positionLabel_) {
    goog.dom.classlist.enable(
        goog.asserts.assert(this.positionLabel_),
        goog.getCssName('anychart-control-disabled'), !enabled);
  }

  // if (this.alignLabel_) {
  //   goog.dom.classlist.enable(
  //       goog.asserts.assert(this.alignLabel_),
  //       goog.getCssName('anychart-control-disabled'), !enabled);
  // }
};


/**
 * @return {boolean} Whether the title settings is enabled.
 */
anychart.chartEditor2Module.settings.Title.prototype.isEnabled = function() {
  return this.enabled_;
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

  // if (this.allowEnabled_) {
  //   var enabledBtn = new anychart.chartEditor2Module.checkbox.Base();
  //   enabledBtn.addClassName(goog.getCssName('anychart-chart-editor-settings-control-right'));
  //   enabledBtn.addClassName(goog.getCssName('anychart-chart-editor-settings-enabled'));
  //   enabledBtn.setNormalValue(false);
  //   enabledBtn.setCheckedValue(true);
  //   if (this.enabledButtonContainer_) {
  //     enabledBtn.render(this.enabledButtonContainer_);
  //     enabledBtn.setParent(this);
  //   } else {
  //     var titleHeader = goog.dom.createDom(
  //         goog.dom.TagName.DIV,
  //         goog.getCssName('anychart-chart-editor-settings-header'),
  //         this.headerText_);
  //     goog.dom.appendChild(element, titleHeader);
  //
  //     enabledBtn.setLabel(titleHeader);
  //     enabledBtn.render(titleHeader);
  //     enabledBtn.setParent(this);
  //
  //     goog.dom.appendChild(element, goog.dom.createDom(
  //         goog.dom.TagName.DIV,
  //         goog.getCssName('anychart-chart-editor-settings-item-gap-mini')));
  //   }
  // }

  var textInput = null;
  if (this.allowEditTitle_) {
    textInput = new anychart.chartEditor2Module.input.Base(/*'Chart title'*/);
    this.addChild(textInput, true);
    goog.dom.classlist.add(textInput.getElement(), goog.getCssName('anychart-chart-editor-settings-chart-title'));
  }

  // var colorPicker = null;
  // if (this.allowEditColor_) {
  //   if (!this.allowEditTitle_) {
  //     var colorLabel = goog.dom.createDom(
  //         goog.dom.TagName.LABEL,
  //         [
  //           goog.ui.INLINE_BLOCK_CLASSNAME,
  //           goog.getCssName('anychart-chart-editor-settings-label')
  //         ],
  //         'Font color');
  //     goog.dom.appendChild(element, colorLabel);
  //   }
  //
  //   colorPicker = new anychart.chartEditor2Module.colorPicker.Base();
  //   colorPicker.addClassName(goog.getCssName('anychart-chart-editor-settings-control-right'));
  //   this.addChild(colorPicker, true);
  //
  //   goog.dom.appendChild(element, goog.dom.createDom(
  //       goog.dom.TagName.DIV,
  //       goog.getCssName('anychart-chart-editor-settings-item-gap-mini')));
  // }

  // var fontFamily = new anychart.chartEditor2Module.select.FontFamily();
  // fontFamily.addClassName(goog.getCssName('anychart-chart-editor-settings-font-family'));
  // this.addChild(fontFamily, true);
  //
  // var fontSizeSelect = new anychart.chartEditor2Module.comboBox.Base();
  // fontSizeSelect.setOptions([10, 12, 14, 16, 18, 20, 22]);
  // this.addChild(fontSizeSelect, true);
  // goog.dom.classlist.add(fontSizeSelect.getElement(), goog.getCssName('anychart-chart-editor-settings-font-size'));
  //
  // var buttonsWrapper = goog.dom.createDom(
  //     goog.dom.TagName.DIV,
  //     goog.getCssName('anychart-chart-editor-settings-control-right'));
  // goog.dom.appendChild(element, buttonsWrapper);
  //
  // var boldBtn = new anychart.chartEditor2Module.button.Bold();
  // boldBtn.addClassName(goog.getCssName('anychart-chart-editor-settings-bold'));
  // this.addChild(boldBtn, true);
  // goog.dom.appendChild(buttonsWrapper, boldBtn.getElement());
  //
  // var italicBtn = new anychart.chartEditor2Module.button.Italic();
  // this.addChild(italicBtn, true);
  // goog.dom.appendChild(buttonsWrapper, italicBtn.getElement());
  //
  // var underlineBtn = new anychart.chartEditor2Module.button.Underline();
  // this.addChild(underlineBtn, true);
  // goog.dom.appendChild(buttonsWrapper, underlineBtn.getElement());
  //
  // // The setCollapsed method needs to be called after the toolbar is rendered
  // // for it to pick up the directionality of the toolbar.
  // boldBtn.setCollapsed(goog.ui.ButtonSide.END);
  // italicBtn.setCollapsed(
  //     goog.ui.ButtonSide.END | goog.ui.ButtonSide.START);
  // underlineBtn.setCollapsed(goog.ui.ButtonSide.START);

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

  // var alignSelect = null;
  // if (this.allowEditAlign_) {
  //   goog.dom.appendChild(element, goog.dom.createDom(
  //       goog.dom.TagName.DIV,
  //       goog.getCssName('anychart-chart-editor-settings-item-gap')));
  //
  //   var alignLabel = goog.dom.createDom(
  //       goog.dom.TagName.LABEL,
  //       [
  //         goog.ui.INLINE_BLOCK_CLASSNAME,
  //         goog.getCssName('anychart-chart-editor-settings-label')
  //       ],
  //       'Align');
  //   goog.dom.appendChild(element, alignLabel);
  //
  //   alignSelect = new anychart.chartEditor2Module.select.Align();
  //   alignSelect.addClassName(goog.getCssName('anychart-chart-editor-settings-control-select-image'));
  //   alignSelect.addClassName(goog.getCssName('anychart-chart-editor-settings-control-right'));
  //
  //   var alignSelectMenu = alignSelect.getMenu();
  //   alignSelectMenu.setOrientation(goog.ui.Container.Orientation.HORIZONTAL);
  //
  //   this.addChild(alignSelect, true);
  // }

  // this.enabledBtn_ = enabledBtn;
  this.textInput_ = textInput;
  this.positionSelect_ = positionSelect;
  // this.alignSelect_ = alignSelect;
  // this.fontFamilySelect_ = fontFamily;
  // this.fontSizeSelect_ = fontSizeSelect;
  // this.boldBtn_ = boldBtn;
  // this.italicBtn_ = italicBtn;
  // this.underlineBtn_ = underlineBtn;
  // this.colorPicker_ = colorPicker;

  // this.titleHeader_ = titleHeader;
  // this.colorLabel_ = colorLabel;
  this.positionLabel_ = positionLabel;
  // this.alignLabel_ = alignLabel;

  this.updateKeys();
};


/**
 * Update controls.
 * @param {anychart.chartEditor2Module.steps.Base.Model} model
 */
anychart.chartEditor2Module.settings.Title.prototype.update = function(model) {
  // if (this.enabledBtn_) this.enabledBtn_.update(model);
  // if (this.textInput_) this.textInput_.update(model);

  // if (this.positionSelect_) this.positionSelect_.update(model);

  // if (this.alignSelect_) this.alignSelect_.update(model);
  // if (this.fontFamilySelect_) this.fontFamilySelect_.update(model);
  // if (this.fontSizeSelect_) this.fontSizeSelect_.update(model);
  // if (this.boldBtn_) this.boldBtn_.update(model);
  // if (this.italicBtn_) this.italicBtn_.update(model);
  // if (this.underlineBtn_) this.underlineBtn_.update(model);
  // if (this.colorPicker_) this.colorPicker_.update(model);
};


/**
 * Update model keys.
 */
anychart.chartEditor2Module.settings.Title.prototype.updateKeys = function() {
  // if (this.enabledBtn_) this.enabledBtn_.setKey(this.genKey('enabled()'));
  if (this.textInput_) this.textInput_.setKey(this.genKey(this.titleKey_));

  if (this.positionSelect_) this.positionSelect_.setKey(this.genKey(this.positionKey_));

  // if (this.alignSelect_) {
  //   this.alignSelect_.setOrientationKey(this.orientationKey_ ? this.orientationKey_ : this.genKey('orientation()'));
  //   this.alignSelect_.setKey(this.genKey('align()'));
  // }
  // if (this.fontFamilySelect_) this.fontFamilySelect_.setKey(this.genKey('fontFamily()'));
  // if (this.fontSizeSelect_) this.fontSizeSelect_.setKey(this.genKey('fontSize()'));
  // if (this.boldBtn_) this.boldBtn_.setKey(this.genKey('fontWeight()'));
  // if (this.italicBtn_) this.italicBtn_.setKey(this.genKey('fontStyle()'));
  // if (this.underlineBtn_) this.underlineBtn_.setKey(this.genKey('fontDecoration()'));
  // if (this.colorPicker_) this.colorPicker_.setKey(this.genKey('fontColor()'));
};
