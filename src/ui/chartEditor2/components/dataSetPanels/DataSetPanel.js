goog.provide('anychart.ui.chartEditor2.DataSetPanel');

goog.require('anychart.ui.Component');
goog.require('goog.ui.Menu');
goog.require('goog.ui.MenuButton');
goog.require('goog.ui.MenuItem');
goog.require('goog.ui.MenuSeparator');



/**
 * @constructor
 * @extends {anychart.ui.Component}
 */
anychart.ui.chartEditor2.DataSetPanel = function(data) {
  goog.base(this);

  this.data_ = data;
};
goog.inherits(anychart.ui.chartEditor2.DataSetPanel, anychart.ui.Component);


/** @inheritDoc */
anychart.ui.chartEditor2.DataSetPanel.prototype.createDom = function() {
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
          {'class': 'field', 'draggable': 'true'}, this.data_['fields'][i]['name']))
    }
  }

  element.appendChild(dom.createDom(goog.dom.TagName.DIV, 'inner',
      dom.createDom(goog.dom.TagName.H4, null, this.data_['name']),
      fields));
};


anychart.ui.chartEditor2.DataSetPanel.prototype.removeDataSet = function() {
  this.dispatchEvent({
    type: anychart.ui.chartEditor2.events.EventType.DATA_REMOVE,
    setId: this.data_['setId'],
    dataType: this.data_['type']
  });
};
