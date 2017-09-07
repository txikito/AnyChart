goog.provide('anychart.chartEditor2Module.DataSetPanel');

goog.require('anychart.chartEditor2Module.Component');
goog.require('goog.ui.Menu');
goog.require('goog.ui.MenuButton');
goog.require('goog.ui.MenuItem');
goog.require('goog.ui.MenuSeparator');


/**
 * Uploaded dataset's panel with dataset's name and with 'remove' button.
 *
 * @param {Object} dataSet Data set object
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper; see {@link goog.ui.Component} for semantics.
 * @constructor
 * @extends {anychart.chartEditor2Module.Component}
 */
anychart.chartEditor2Module.DataSetPanel = function(dataSet, opt_domHelper) {
  anychart.chartEditor2Module.DataSetPanel.base(this, 'constructor', opt_domHelper);

  this.disabled = false;

  this.dataSet_ = dataSet;

  this.menuItems_ = {};
};
goog.inherits(anychart.chartEditor2Module.DataSetPanel, anychart.chartEditor2Module.Component);


/** @inheritDoc */
anychart.chartEditor2Module.DataSetPanel.prototype.createDom = function() {
  goog.base(this, 'createDom');

  var self = this;
  var element = /** @type {Element} */(this.getElement());
  goog.dom.classlist.add(element, 'panel');

  var menu = new goog.ui.Menu();
  goog.array.forEach(['Join/Unjoin', 'Remove'],
      function(label) {
        var item;
        if (label) {
          item = new goog.ui.MenuItem(label + '...');
          // item.setId(label.toLowerCase());
          item.setDispatchTransitionEvents(goog.ui.Component.State.ALL, true);
          if (label == 'Join/Unjoin') {
            item.setEnabled(false);
          }

          self.menuItems_[label] = item;
        } else {
          item = new goog.ui.MenuSeparator();
        }
        menu.addChild(item, true);
      });

  var gearButton = new goog.ui.MenuButton('...', menu);
  gearButton.addClassName('gear');
  gearButton.setTooltip('Options');
  gearButton.setDispatchTransitionEvents(goog.ui.Component.State.ALL, true);
  goog.events.listen(gearButton, goog.ui.Component.EventType.ACTION,
      function(e) {
        if (e.target && e.target.getCaption() == 'Remove...') {
          self.removeDataSet();
        }
      });

  this.addChild(gearButton, true);

  var dom = this.getDomHelper();
  var fields = [];
  if (goog.isArray(this.dataSet_.fields)) {
    for (var i = 0; i < this.dataSet_.fields.length; i++) {
      fields.push(dom.createDom(goog.dom.TagName.DIV, {'class': 'field'}, this.dataSet_.fields[i].name));
    }
  }

  element.appendChild(dom.createDom(goog.dom.TagName.DIV, 'inner',
      dom.createDom(goog.dom.TagName.H4, null, this.dataSet_['title']),
      fields));
};


/**
 * Dispatches event to remove data set from model.
 */
anychart.chartEditor2Module.DataSetPanel.prototype.removeDataSet = function() {
  this.dispatchEvent({
    type: anychart.chartEditor2Module.events.EventType.DATA_REMOVE,
    setId: this.dataSet_.setId,
    dataType: this.dataSet_.type,
    setFullId: this.dataSet_.setFullId
  });
};


/**
 * Getter for data set's full Id.
 * @return {string}
 */
anychart.chartEditor2Module.DataSetPanel.prototype.getSetFullId = function() {
  return this.dataSet_.setFullId;
};


/**
 * @param {boolean} value
 */
anychart.chartEditor2Module.DataSetPanel.prototype.setDisabled = function(value) {
  if (this.disabled != value) {
    this.disabled = value;
    goog.dom.classlist.enable(this.getElement(), 'disabled', this.disabled);
  }
  this.menuItems_['Remove'].setEnabled(this.disabled);
};


/**
 * @param {boolean} isActiveGeo
 */
anychart.chartEditor2Module.DataSetPanel.prototype.setActiveGeo = function(isActiveGeo) {
  goog.dom.classlist.enable(this.getElement(), 'active-geo', isActiveGeo);
  if (isActiveGeo)
    this.menuItems_['Remove'].setEnabled(false);
};
