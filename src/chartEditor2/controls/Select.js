goog.provide('anychart.chartEditor2Module.controls.Select');

goog.require('anychart.chartEditor2Module.controls.MenuItemWithTwoValues');
goog.require('goog.ui.MenuItem');
goog.require('goog.ui.MenuSeparator');
goog.require('goog.ui.Select');



/**
 * Extends select control to work with EditorModel.
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
 *
 * @constructor
 * @extends {goog.ui.Select}
 */
anychart.chartEditor2Module.controls.Select = function(opt_caption, opt_menu, opt_renderer, opt_domHelper, opt_menuRenderer) {
  anychart.chartEditor2Module.controls.Select.base(this, 'constructor', opt_caption, opt_menu, opt_renderer, opt_domHelper, opt_menuRenderer);

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
goog.inherits(anychart.chartEditor2Module.controls.Select, goog.ui.Select);


/** @inheritDoc */
anychart.chartEditor2Module.controls.Select.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.listen(goog.ui.Component.EventType.CHANGE, this.onChange);
};


/**
 * Updates EditorModel's state on value change.
 */
anychart.chartEditor2Module.controls.Select.prototype.onChange = function() {
  if (!this.suspendDispatch && this.editorModel && goog.isDefAndNotNull(this.getValue())) {
    if (this.callback)
      this.editorModel[this.callback].call(this.editorModel, this);
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
anychart.chartEditor2Module.controls.Select.prototype.setEditorModel = function(model, key, opt_callback, opt_target, opt_noRebuild) {
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
 * @return {anychart.chartEditor2Module.EditorModel.Key}
 */
anychart.chartEditor2Module.controls.Select.prototype.getKey = function() {
  return this.key;
};


/**
 * Sets value of this control to model's value.
 *
 * @param {string=} opt_value2 Second value in case of using OptionWithTwoValues.
 */
anychart.chartEditor2Module.controls.Select.prototype.setValueByModel = function(opt_value2) {
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
 * @param {string=} opt_value2
 */
anychart.chartEditor2Module.controls.Select.prototype.setValue = function(value, opt_value2) {
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
 * Sets options by array.
 * @param {Array.<(string|number|Array)>} options
 * @param {string=} opt_default
 */
anychart.chartEditor2Module.controls.Select.prototype.setOptions = function(options, opt_default) {
  var self = this;
  if (this.getItemCount() > 0) return;

  goog.array.forEach(options,
      function(option) {
        var item;
        var caption;
        var value;
        if (option) {
          if (goog.isArray(option)) {
            caption = option[0];
            value = option[1];
          } else
            caption = option;

          item = new goog.ui.MenuItem(caption, value);
        } else {
          item = new goog.ui.MenuSeparator();
        }
        self.addItem(item);
      });

  if (opt_default) {
    this.setValue(opt_default);
  }
};


/**
 * Hides control by assigning 'hidden' class
 */
anychart.chartEditor2Module.controls.Select.prototype.hide = function() {
  goog.dom.classlist.add(this.getElement(), 'hidden');
};


/**
 * Shows control by removing 'hidden' class
 */
anychart.chartEditor2Module.controls.Select.prototype.show = function() {
  goog.dom.classlist.remove(this.getElement(), 'hidden');
};
