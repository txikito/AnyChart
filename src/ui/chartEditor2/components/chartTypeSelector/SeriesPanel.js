goog.provide('anychart.ui.chartEditor2.SeriesPanel');

goog.require('anychart.ui.chartEditor2.FieldSelect');
goog.require('anychart.ui.chartEditor2.MenuItemWithTwoValues');
goog.require('goog.ui.Component');
goog.require('goog.ui.Select');
goog.require('goog.ui.MenuItem');



/**
 * @constructor
 * @extends {goog.ui.Component}
 */
anychart.ui.chartEditor2.SeriesPanel = function(dataModel, chartType, seriesType, index) {
  anychart.ui.chartEditor2.SeriesPanel.base(this, 'constructor');

  /**
   * @type {anychart.ui.chartEditor2.DataModel}
   * @private
   */
  this.dataModel_ = dataModel;

  this.index_ = index;

  this.chartType_ = chartType;

  this.seriesType_ = seriesType;

  /**
   * @type {Array.<anychart.ui.chartEditor2.FieldSelect>}
   * @private
   */
  this.fields_ = [];
};
goog.inherits(anychart.ui.chartEditor2.SeriesPanel, goog.ui.Component);


/** @inheritDoc */
anychart.ui.chartEditor2.SeriesPanel.prototype.createDom = function() {
  anychart.ui.chartEditor2.SeriesPanel.base(this, 'createDom');

  goog.dom.classlist.add(this.getElement(), 'series-panel');
  goog.dom.classlist.add(this.getElement(), 'closable');

  var dom = this.getDomHelper();
  if (this.index_ > 0) {
    this.close_ = dom.createDom(goog.dom.TagName.DIV, 'close', 'X');
    this.getElement().appendChild(this.close_);
  }

  // this.title_ = dom.createDom(goog.dom.TagName.H3, null, this.seriesType_ + ' series ' + this.index_);
  // this.getElement().appendChild(this.title_);

  this.typeSelect_ = new anychart.ui.chartEditor2.FieldSelect('Series type');
  //this.typeSelect_ = new goog.ui.Select();
  this.addChild(this.typeSelect_, true);

  var seriesTypes = anychart.ui.chartEditor2.ChartTypeSelector.chartTypes[this.chartType_]['series'];
  for(var i = 0; i < seriesTypes.length; i++) {
    var item = new goog.ui.MenuItem(seriesTypes[i], seriesTypes[i]);
    this.typeSelect_.addItem(item);
  }
  // todo: Do more deliberate choice
  this.typeSelect_.setSelectedIndex(0);
};


anychart.ui.chartEditor2.SeriesPanel.prototype.enterDocument = function() {
  anychart.ui.chartEditor2.SeriesPanel.base(this, 'enterDocument');

  if (this.close_)
    this.getHandler().listen(this.close_, goog.events.EventType.CLICK, this.onClose_);
  this.getHandler().listen(this.dataModel_, anychart.ui.chartEditor2.events.EventType.DATA_UPDATE_MODEL, this.update);
  this.getHandler().listen(this.typeSelect_, goog.ui.Component.EventType.ACTION, this.onChangeType_);

  this.createFields();
  this.update(null);
};


anychart.ui.chartEditor2.SeriesPanel.prototype.createFields = function() {
  var self = this;
  var data = this.dataModel_.getPreparedData();
  for (var a = this.fields_.length; a--;) {
    this.removeChild(this.fields_[a], true);
    this.fields_[a].dispose();
  }
  this.fields_.length = 0;

  var fieldsMap = anychart.ui.chartEditor2.ChartTypeSelector.series[this.seriesType_]['fields'];
  goog.object.forEach(fieldsMap,
      function(item) {
        var fieldName = item['name'] ? item['name'] : item['field'];
        var fieldSelect = new anychart.ui.chartEditor2.FieldSelect(fieldName);
        self.fields_.push(fieldSelect);
        self.addChild(fieldSelect, true);

        for(var i = 0; i < data.length; i++) {
          var fields = data[i]['fields'];
          for(var j = 0; j < fields.length; j++) {
            var caption = data.length == 1 ? fields[j]['name'] : data[i]['name'] + ' - ' + fields[j]['name'];
            var option = new anychart.ui.chartEditor2.MenuItemWithTwoValues(caption, fields[j]['key'], data[i]['setId']);
            // todo: what is this?  item.setDispatchTransitionEvents(goog.ui.Component.State.ALL, true);
            fieldSelect.addItem(option);
          }
        }

        // todo: Do more deliberate choice
        fieldSelect.setSelectedIndex(0);
      });
};


anychart.ui.chartEditor2.SeriesPanel.prototype.update = function(evt) {
  var data = this.dataModel_.getPreparedData();

  console.log(data);
};


anychart.ui.chartEditor2.SeriesPanel.prototype.index = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (goog.isNumber(opt_value)) {
      this.index_ = opt_value;
      //this.title_.innerHTML = this.seriesType_ + ' series ' + this.index_;
    }
    return this;
  }
  return this.index_;
};


anychart.ui.chartEditor2.SeriesPanel.prototype.onClose_ = function(evt) {
  this.dispatchEvent({
    type: anychart.ui.chartEditor2.events.EventType.PANEL_CLOSE,
    panelType: 'series',
    index: this.index_
  });
};


anychart.ui.chartEditor2.SeriesPanel.prototype.onChangeType_ = function(evt) {
  var type = evt.target.getValue();
  if (type && type != this.seriesType_) {
    this.seriesType_ = type;
    this.createFields();
  }
};
