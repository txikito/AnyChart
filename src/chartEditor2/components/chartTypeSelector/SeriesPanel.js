goog.provide('anychart.chartEditor2Module.SeriesPanel');

goog.require('anychart.chartEditor2Module.Component');
goog.require('anychart.chartEditor2Module.controls.SelectWithLabel');
goog.require('anychart.chartEditor2Module.controls.MenuItemWithTwoValues');
goog.require('goog.ui.Component');
goog.require('goog.ui.Select');
goog.require('goog.ui.MenuItem');


/**
 * @constructor
 * @extends {anychart.chartEditor2Module.Component}
 */
anychart.chartEditor2Module.SeriesPanel = function(editor, index) {
  anychart.chartEditor2Module.SeriesPanel.base(this, 'constructor');

  /**
   * @type {anychart.chartEditor2Module.Editor}
   * @private
   */
  this.editor_  = editor;

  this.index_ = index;

  /**
   * @type {Array.<anychart.chartEditor2Module.controls.SelectWithLabel>}
   * @private
   */
  this.fields_ = [];

  /**
   * @type {?String}
   * @private
   */
  this.currentSetId_ = null;
};
goog.inherits(anychart.chartEditor2Module.SeriesPanel, anychart.chartEditor2Module.Component);


/** @inheritDoc */
anychart.chartEditor2Module.SeriesPanel.prototype.createDom = function() {
  anychart.chartEditor2Module.SeriesPanel.base(this, 'createDom');

  goog.dom.classlist.add(this.getElement(), 'series-panel');
  goog.dom.classlist.add(this.getElement(), 'closable');

  var dom = this.getDomHelper();
  if (this.index_ > 0) {
    this.close_ = dom.createDom(goog.dom.TagName.DIV, 'close', 'X');
    this.getElement().appendChild(this.close_);
  }

  this.typeSelect_ = new anychart.chartEditor2Module.controls.SelectWithLabel('ctor', 'Series type');
  this.typeSelect_.setEditorModel(this.editor_.getModel(), this.getKey('ctor'), 'setSeriesType');
  this.addChild(this.typeSelect_, true);

  var chartType = this.editor_.getModel().getValue([['chart'], 'type']);
  var seriesTypes = anychart.chartEditor2Module.EditorModel.chartTypes[chartType]['series'];
  for (var i = 0; i < seriesTypes.length; i++) {
    var item = new goog.ui.MenuItem(seriesTypes[i], seriesTypes[i]);
    this.typeSelect_.addItem(item);
  }
};


anychart.chartEditor2Module.SeriesPanel.prototype.update = function() {
  var editorModel = this.editor_.getModel();

  editorModel.suspendDispatch();

  this.typeSelect_.setValueByModel();

  this.createFields();

  // this.createFieldsOptions();

  editorModel.resumeDispatch();
};


/** @inheritDoc */
anychart.chartEditor2Module.SeriesPanel.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.update();

  if (this.close_)
    this.getHandler().listen(this.close_, goog.events.EventType.CLICK, function() {
      this.editor_.getModel().dropSeries(this.getParent().index(), this.index_);
    });
};



anychart.chartEditor2Module.SeriesPanel.prototype.createFields = function() {
  var self = this;

  this.removeAllFields_();

  var seriesType = this.typeSelect_.getValue();
  var fieldsMap = anychart.chartEditor2Module.EditorModel.series[seriesType]['fields'];
  goog.object.forEach(fieldsMap,
      function(item) {
        var fieldLabel = item['name'] ? item['name'] : item['field'];
        var fieldSelect = new anychart.chartEditor2Module.controls.SelectWithLabel(item['field'], fieldLabel);
        fieldSelect.setEditorModel(self.editor_.getModel(), self.getKey([['mapping'], item['field']]));
        self.fields_.push(fieldSelect);
        self.addChild(fieldSelect, true);
      });
};


anychart.chartEditor2Module.SeriesPanel.prototype.createFieldsOptions = function(opt_currentSetId) {
  if (goog.isDef(opt_currentSetId))
    this.currentSetId_ = opt_currentSetId;

  //var datasetId =
  var preparedData = this.editor_.getModel().getPreparedData();
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
        var option = new anychart.chartEditor2Module.controls.MenuItemWithTwoValues(caption, dataFields[j]['key'], this.currentSetId_);
        this.fields_[i].addItem(option);
      }

      // todo: Do more deliberate choice
      this.fields_[i].setSelectedIndex(0);
    }
  }
};


anychart.chartEditor2Module.SeriesPanel.prototype.onDataUse_ = function(evt) {
  if (this.currentSetId_ != evt.setFullId) {
    this.currentSetId_ = evt.setFullId;
    this.createFieldsOptions();
  }
};


anychart.chartEditor2Module.SeriesPanel.prototype.removeAllFields_ = function() {
  for (var a = this.fields_.length; a--;) {
    var field = this.fields_[a];
    this.removeChild(field, true);
    field.dispose();
  }
  this.fields_.length = 0;
};


anychart.chartEditor2Module.SeriesPanel.prototype.index = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (goog.isNumber(opt_value)) {
      this.index_ = opt_value;
    }
    return this;
  }
  return this.index_;
};


anychart.chartEditor2Module.SeriesPanel.prototype.getKey = function(opt_completion) {
  if (!this.key_ || !this.key_.length) {
    if (!this.plotIndex_ && this.getParent())
      this.plotIndex_ = this.getParent().index();

    this.key_ = [['datasetSettings'], ['mappings', this.plotIndex_], [this.index_]];
  }

  return goog.base(this, 'getKey', opt_completion);
};


anychart.chartEditor2Module.SeriesPanel.prototype.dispose = function() {
  this.removeAllFields_();

  // this.editor_.getModel().removeByKey(this.getKey());
  goog.base(this, 'dispose');
};