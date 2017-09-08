goog.provide('anychart.chartEditor2Module.select.Base');

goog.require('anychart.chartEditor2Module.events');
goog.require('anychart.chartEditor2Module.select.Renderer');

goog.require('goog.ui.Option');
goog.require('goog.ui.Select');



/**
 *
 * @param {goog.ui.ControlContent=} opt_caption Default caption or existing DOM
 *     structure to display as the button's caption when nothing is selected.
 *     Defaults to no caption.
 * @param {goog.ui.Menu=} opt_menu Menu containing selection options.
 * @param {goog.ui.ButtonRenderer=} opt_renderer Renderer used to render or
 *     decorate the control; defaults to {@link goog.ui.MenuButtonRenderer}.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
 *     document interaction.
 * @param {!goog.ui.MenuRenderer=} opt_menuRenderer Renderer used to render or
 *     decorate the menu; defaults to {@link goog.ui.MenuRenderer}.
 * @constructor
 * @extends {goog.ui.Select}
 */
anychart.chartEditor2Module.select.Base = function(opt_caption, opt_menu, opt_renderer, opt_domHelper, opt_menuRenderer) {
  anychart.chartEditor2Module.select.Base.base(this, 'constructor', opt_caption, opt_menu,
      opt_renderer || anychart.chartEditor2Module.select.Renderer.getInstance(),
      opt_domHelper, opt_menuRenderer);

  this.options_ = [];
  this.captions_ = [];
  this.icons_ = [];

  /**
   * @type {boolean}
   * @protected
   */
  this.suspendDispatch = false;

  /**
   * @type {boolean}
   * @protected
   */
  this.noRebuild = false;
};
goog.inherits(anychart.chartEditor2Module.select.Base, goog.ui.Select);


/**
 * @type {Array.<string>}
 * @private
 */
anychart.chartEditor2Module.select.Base.prototype.options_;


/**
 * @type {Array.<string>}
 * @private
 */
anychart.chartEditor2Module.select.Base.prototype.captions_;


/**
 * @type {Array.<string>}
 * @private
 */
anychart.chartEditor2Module.select.Base.prototype.icons_;


/**
 * Set model for options.
 * @param {Array.<Array|string>} options
 */
anychart.chartEditor2Module.select.Base.prototype.setOptions = function(options) {
  this.options_ = [];
  var updateCaption = false;
  for (var i = 0; i < options.length; i++) {
    var option = options[i];
    var caption;
    if (option) {
      if (goog.isArray(option)) {
        if (!updateCaption) {
          updateCaption = true;
          this.captions_ = [];
        }

        this.captions_.push(option[0]);
        this.options_.push(option[1]);
      } else
        this.options_.push(option);
    }
  }
};


/**
 * Set caption for options.
 * @param {Array.<?string>} captions
 */
anychart.chartEditor2Module.select.Base.prototype.setCaptions = function(captions) {
  this.captions_ = captions;
};


/**
 * Set caption for options.
 * @param {Array.<string>} icons
 */
anychart.chartEditor2Module.select.Base.prototype.setIcons = function(icons) {
  this.icons_ = icons;
};


/**
 * @type {string|Array.<string>}
 * @private
 */
anychart.chartEditor2Module.select.Base.prototype.key = '';


/** @param {string|Array.<string>} value */
anychart.chartEditor2Module.select.Base.prototype.setKey = function(value) {
  this.key = value;
};


/**
 * Gets key.
 * @return {string|Array.<string>}
 */
anychart.chartEditor2Module.select.Base.prototype.getKey = function() {
  return this.key;
};


/** @override */
anychart.chartEditor2Module.select.Base.prototype.createDom = function() {
  anychart.chartEditor2Module.select.Base.base(this, 'createDom');

  this.updateOptions();
};


/**
 * Update options.
 */
anychart.chartEditor2Module.select.Base.prototype.updateOptions = function() {
  var optionsCount = this.options_.length;
  var count = Math.max(this.getChildCount(), optionsCount);

  for (var i = 0; i < count; i++) {
    var optionItem = this.getItemAt(i);

    if (i < optionsCount) {
      var option = this.options_[i];
      var caption = this.captions_[i];
      var icon = this.icons_[i];
      var content = this.createContentElements(option, caption, icon);

      if (!optionItem) {
        optionItem = new goog.ui.Option(content, option);
        this.addItemAt(optionItem, i);
      } else {
        optionItem.setContent(content);
        optionItem.setModel(option);
        optionItem.setVisible(true);
      }
    } else {
      optionItem.setVisible(false);
    }
  }
};


/**
 * @param {string} option
 * @param {string} caption
 * @param {string} icon
 * @return {Array|string}
 */
anychart.chartEditor2Module.select.Base.prototype.createContentElements = function(option, caption, icon) {
  if (!goog.isDefAndNotNull(option)) return this.getCaption();
  caption = goog.isDef(caption) ? caption : option.toString();
  var content = [];
  if (caption) content.push(caption);
  if (icon) content.push(goog.dom.createDom(goog.dom.TagName.I, [goog.getCssName('anychart-chart-editor-icon'), icon]));
  return content;
};


/** @param {anychart.chartEditor2Module.steps.Base.Model} model */
// anychart.chartEditor2Module.select.Base.prototype.update = function(model) {
//   //todo: rework, need silently update selects
//   goog.events.unlisten(this, goog.ui.Component.EventType.CHANGE, this.onChange, false, this);
//   var value = anychart.chartEditor2Module.Controller.getset(model, goog.isArray(this.key) ? this.key[0] : this.key);
//   var index = this.options_.indexOf(value);
//   this.setSelectedIndex(index);
//   goog.events.listen(this, goog.ui.Component.EventType.CHANGE, this.onChange, false, this);
// };


/** @override */
anychart.chartEditor2Module.select.Base.prototype.enterDocument = function() {
  anychart.chartEditor2Module.select.Base.base(this, 'enterDocument');

  goog.events.listen(this, goog.ui.Component.EventType.CHANGE, this.onChange, false, this);
};


/** @override */
anychart.chartEditor2Module.select.Base.prototype.exitDocument = function() {
  goog.events.unlisten(this, goog.ui.Component.EventType.CHANGE, this.onChange, false, this);

  anychart.chartEditor2Module.select.Base.base(this, 'exitDocument');
};


/**
 * @param {goog.events.Event} evt
 * @protected
 */
anychart.chartEditor2Module.select.Base.prototype.onChange = function(evt) {
  evt.preventDefault();
  evt.stopPropagation();

  if (!this.suspendDispatch && this.editorModel && goog.isDefAndNotNull(this.getValue())) {
    if (this.callback)
      this.editorModel.callbackByString(this.callback, this);
    else
      this.editorModel.setValue(this.key, this.getValue(), false, this.noRebuild);
  }
};


/**
 * Connects control with EditorMode.
 *
 * @param {anychart.chartEditor2Module.EditorModel} model Editor model instance to connect with.
 * @param {anychart.chartEditor2Module.EditorModel.Key} key Key of control's field in model's structure.
 * @param {string=} opt_callback Callback function that will be called on control's value change instead of simple change value in model.
 *  This function should be model's public method.
 * @param {?Object=} opt_target Object, who's property corresponds to control's key. Used to get the initial value of this control.
 * @param {boolean=} opt_noRebuild Should or not rebuild chart on change value of this control.
 */
anychart.chartEditor2Module.select.Base.prototype.setEditorModel = function(model, key, opt_callback, opt_target, opt_noRebuild) {
  /**
   * @type {anychart.chartEditor2Module.EditorModel}
   * @protected
   */
  this.editorModel = model;

  /**
   * @type {anychart.chartEditor2Module.EditorModel.Key}
   * @protected
   */
  this.key = key;

  this.callback = opt_callback;
  this.noRebuild = !!opt_noRebuild;

  if (opt_target) {
    var stringKey = anychart.chartEditor2Module.EditorModel.getStringKey(key);
    var value = /** @type {string} */(anychart.bindingModule.exec(opt_target, stringKey));
    this.suspendDispatch = true;
    this.setValue(value);
    this.editorModel.setValue(this.key, value, true);
    this.suspendDispatch = false;
  }
};


/**
 * Sets value of this control to model's value.
 *
 * @param {?string=} opt_value2 Second value in case of using OptionWithTwoValues.
 */
anychart.chartEditor2Module.select.Base.prototype.setValueByModel = function(opt_value2) {
  var value;
  this.suspendDispatch = true;

  if (this.editorModel && this.key)
    value = this.editorModel.getValue(this.key);

  if (goog.isDef(value))
    this.setValue(value, opt_value2);

  if (!this.getSelectedItem()) {
    console.warn("no model value by key:", this.key);
  }

  this.suspendDispatch = false;
};


/**
 * @param {*} value
 * @param {?string=} opt_value2
 */
anychart.chartEditor2Module.select.Base.prototype.setValue = function(value, opt_value2) {
  var selectionModel = this.getSelectionModel();
  if (goog.isDefAndNotNull(value) && selectionModel) {
    for (var i = 0, item; item = selectionModel.getItemAt(i); i++) {
      if (item &&
          typeof item.getValue == 'function' && item.getValue() == value &&
          (!goog.isDef(opt_value2) || typeof item.getValue2 == 'function' && item.getValue2() == opt_value2)
      ) {
        this.setSelectedItem(/** @type {!goog.ui.MenuItem} */ (item));
        return;
      }
    }
  }

  this.setSelectedItem(null);
};


/**
 * Returns value2 of selected option (if option are anychart.chartEditor2Module.controls.MenuItemWithTwoValues instances.
 *
 * @return {?string}
 */
anychart.chartEditor2Module.select.Base.prototype.getValue2 = function() {
  var selectedItem = /** @type {?(goog.ui.MenuItem|anychart.chartEditor2Module.controls.MenuItemWithTwoValues)} */(this.getSelectedItem());
  return selectedItem ? selectedItem.getValue2() : null;
};


/**
 * Hides control by assigning 'hidden' class
 */
anychart.chartEditor2Module.select.Base.prototype.hide = function() {
  goog.dom.classlist.add(this.getElement(), 'hidden');
};


/**
 * Shows control by removing 'hidden' class
 */
anychart.chartEditor2Module.select.Base.prototype.show = function() {
  goog.dom.classlist.remove(this.getElement(), 'hidden');
};

/**
 * @override
 * @suppress {visibility}
 */
// anychart.chartEditor2Module.select.Base.prototype.updateCaption = function() {
//   var selectedIndex = this.getSelectedIndex();
//   var item = this.getSelectedItem();
//   var option = this.options_[selectedIndex];
//   var caption = this.captions_[selectedIndex];
//   var icon = this.icons_[selectedIndex];
//   var content = this.createContentElements(option, caption, icon);
//
//   this.setContent(content);
//
//   var contentElement = this.getRenderer().getContentElement(this.getElement());
//   // Despite the ControlRenderer interface indicating the return value is
//   // {Element}, many renderers cast element.firstChild to {Element} when it is
//   // really {Node}. Checking tagName verifies this is an {!Element}.
//   if (contentElement && this.getDomHelper().isElement(contentElement)) {
//     if (this.initialAriaLabel_ == null) {
//       this.initialAriaLabel_ = goog.a11y.aria.getLabel(contentElement);
//     }
//     var itemElement = item ? item.getElement() : null;
//     goog.a11y.aria.setLabel(contentElement, itemElement ?
//         goog.a11y.aria.getLabel(itemElement) : this.initialAriaLabel_);
//     this.updateAriaActiveDescendant_();
//   }
// };
