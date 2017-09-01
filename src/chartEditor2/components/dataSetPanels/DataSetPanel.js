goog.provide('anychart.chartEditor2Module.DataSetPanel');

goog.require('anychart.ui.Component');
goog.require('goog.ui.Menu');
goog.require('goog.ui.MenuButton');
goog.require('goog.ui.MenuItem');
goog.require('goog.ui.MenuSeparator');


/**
 * @constructor
 * @extends {anychart.ui.Component}
 */
anychart.chartEditor2Module.DataSetPanel = function(data) {
  goog.base(this);

  this.disabled = false;

  this.data_ = data;

  this.menuItems_ = {};
};
goog.inherits(anychart.chartEditor2Module.DataSetPanel, anychart.ui.Component);


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
  if (goog.isArray(this.data_['fields'])) {
    for (var i = 0; i < this.data_['fields'].length; i++) {
      fields.push(dom.createDom(goog.dom.TagName.DIV,
          {'class': 'field'}, this.data_['fields'][i]['name']))
    }
  }

  element.appendChild(dom.createDom(goog.dom.TagName.DIV, 'inner',
      dom.createDom(goog.dom.TagName.H4, null, this.data_['title']),
      fields));
};


anychart.chartEditor2Module.DataSetPanel.prototype.removeDataSet = function() {
  this.dispatchEvent({
    type: anychart.chartEditor2Module.events.EventType.DATA_REMOVE,
    setId: this.data_['setId'],
    dataType: this.data_['type'],
    setFullId: this.data_['setFullId']
  });
};


anychart.chartEditor2Module.DataSetPanel.prototype.getSetFullId = function() {
  return this.data_['setFullId'];
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
};
