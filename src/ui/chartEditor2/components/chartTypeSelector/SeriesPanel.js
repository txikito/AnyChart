goog.provide('anychart.ui.chartEditor2.SeriesPanel');

goog.require('anychart.ui.chartEditor2.controls.FieldSelect');
goog.require('anychart.ui.chartEditor2.controls.MenuItemWithTwoValues');
goog.require('goog.ui.Component');
goog.require('goog.ui.Select');
goog.require('goog.ui.MenuItem');


/**
 * @constructor
 * @extends {goog.ui.Component}
 */
anychart.ui.chartEditor2.SeriesPanel = function(editor, chartType, seriesType, index) {
  anychart.ui.chartEditor2.SeriesPanel.base(this, 'constructor');

  /**
   * @type {anychart.ui.Editor2}
   * @private
   */
  this.editor_  = editor;

  this.index_ = index;

  this.chartType_ = chartType;

  this.seriesType_ = seriesType;

  /**
   * @type {Array.<anychart.ui.chartEditor2.controls.FieldSelect>}
   * @private
   */
  this.fields_ = [];

  /**
   * @type {?String}
   * @private
   */
  this.currentSetId_ = null;
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

  this.typeSelect_ = new anychart.ui.chartEditor2.controls.FieldSelect('Series type');
  this.addChild(this.typeSelect_, true);

  var seriesTypes = anychart.ui.chartEditor2.EditorModel.chartTypes[this.chartType_]['series'];
  for (var i = 0; i < seriesTypes.length; i++) {
    var item = new goog.ui.MenuItem(seriesTypes[i], seriesTypes[i]);
    this.typeSelect_.addItem(item);
  }
};


/** @inheritDoc */
anychart.ui.chartEditor2.SeriesPanel.prototype.enterDocument = function() {
  anychart.ui.chartEditor2.SeriesPanel.base(this, 'enterDocument');

  if (this.close_)
    this.getHandler().listen(this.close_, goog.events.EventType.CLICK, this.onClose_);

  this.getHandler().listen(this.getParent(), anychart.ui.chartEditor2.events.EventType.DATA_USE, this.onDataUse_);
  this.getHandler().listen(this.typeSelect_, goog.ui.Component.EventType.CHANGE, this.onChangeType_);

  if (!this.currentSetId_) {
    // todo: Do more deliberate choice
    this.typeSelect_.setSelectedIndex(0);

    this.createFields();
  }
};


anychart.ui.chartEditor2.SeriesPanel.prototype.createFields = function() {
  var self = this;

  for (var a = this.fields_.length; a--;) {
    this.removeChild(this.fields_[a], true);
    this.fields_[a].dispose();
  }
  this.fields_.length = 0;

  var fieldsMap = anychart.ui.chartEditor2.EditorModel.series[this.seriesType_]['fields'];
  goog.object.forEach(fieldsMap,
      function(item) {
        var fieldName = item['name'] ? item['name'] : item['field'];
        var fieldSelect = new anychart.ui.chartEditor2.controls.FieldSelect(fieldName);
        self.fields_.push(fieldSelect);
        self.addChild(fieldSelect, true);
      });
};


anychart.ui.chartEditor2.SeriesPanel.prototype.createFieldsOptions = function(opt_currentSetId) {
  if (goog.isDef(opt_currentSetId))
    this.currentSetId_ = opt_currentSetId;

  var preparedData = this.editor_.getDataModel().getPreparedData();
  var data;
  for (var a = preparedData.length; a--;) {
    if (preparedData[a]['type'] + preparedData[a]['setId'] == this.currentSetId_) {
      data = preparedData[a];
      break;
    }
  }

  if (data) {
    for (var i = 0; i < this.fields_.length; i++) {
      for (var b = this.fields_[i].getItemCount(); b--;) {
        this.fields_[i].removeItemAt(b);
      }

      var dataFields = data['fields'];
      for (var j = 0; j < dataFields.length; j++) {
        var caption = data['name'] + ' - ' + dataFields[j]['name'];
        var option = new anychart.ui.chartEditor2.controls.MenuItemWithTwoValues(caption, dataFields[j]['key'], this.currentSetId_);
        this.fields_[i].addItem(option);
      }

      // todo: Do more deliberate choice
      this.fields_[i].setSelectedIndex(0);
    }
  }
};


anychart.ui.chartEditor2.SeriesPanel.prototype.onDataUse_ = function(evt) {
  if (this.currentSetId_ != evt.setFullId) {
    this.currentSetId_ = evt.setFullId;
    this.createFieldsOptions();
  }
};


anychart.ui.chartEditor2.SeriesPanel.prototype.onChangeType_ = function(evt) {
  var type = evt.target.getValue();
  if (type && type != this.seriesType_) {
    this.seriesType_ = type;
    this.createFields();
    this.createFieldsOptions();
  }
};


anychart.ui.chartEditor2.SeriesPanel.prototype.index = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (goog.isNumber(opt_value)) {
      this.index_ = opt_value;
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