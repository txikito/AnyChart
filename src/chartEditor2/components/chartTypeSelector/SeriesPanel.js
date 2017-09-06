goog.provide('anychart.chartEditor2Module.SeriesPanel');

goog.require('anychart.chartEditor2Module.Component');
goog.require('anychart.chartEditor2Module.controls.SelectWithLabel');
goog.require('goog.ui.Component');
goog.require('goog.ui.MenuItem');
goog.require('goog.ui.Select');


/**
 * Series panel on a Plot panel on Setup chart step.
 *
 * @param {anychart.chartEditor2Module.EditorModel} model
 * @param {number} index
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper; see {@link goog.ui.Component} for semantics.
 * @constructor
 * @extends {anychart.chartEditor2Module.Component}
 */
anychart.chartEditor2Module.SeriesPanel = function(model, index, opt_domHelper) {
  anychart.chartEditor2Module.SeriesPanel.base(this, 'constructor', opt_domHelper);

  this.setModel(model);

  /**
   * @type {number}
   * @private
   */
  this.index_ = index;

  /**
   * @type {Array.<anychart.chartEditor2Module.controls.SelectWithLabel>}
   * @private
   */
  this.fields_ = [];
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
  this.typeSelect_.setEditorModel(/** @type {anychart.chartEditor2Module.EditorModel} */(this.getModel()), this.getKey('ctor'), 'setSeriesType');
  this.addChild(this.typeSelect_, true);
};


/** @inheritDoc */
anychart.chartEditor2Module.SeriesPanel.prototype.update = function() {
  var chartType = /** @type {anychart.chartEditor2Module.EditorModel} */(this.getModel()).getValue([['chart'], 'type']);
  var seriesTypes = anychart.chartEditor2Module.EditorModel.chartTypes[chartType]['series'];
  for (var i = 0; i < seriesTypes.length; i++) {
    var type = seriesTypes[i];
    var caption = anychart.chartEditor2Module.EditorModel.series[type]['name'] ?
        anychart.chartEditor2Module.EditorModel.series[type]['name'] :
        goog.string.capitalize(type);
    var item = new goog.ui.MenuItem(caption, type);
    this.typeSelect_.addItem(item);
  }

  this.typeSelect_.setValueByModel();

  this.createFields();
  this.createFieldsOptions();
};


/** @inheritDoc */
anychart.chartEditor2Module.SeriesPanel.prototype.enterDocument = function() {
  this.update();

  this.getHandler().listen(/** @type {anychart.chartEditor2Module.EditorModel} */(this.getModel()),
      anychart.chartEditor2Module.events.EventType.EDITOR_MODEL_UPDATE, this.update);

  if (this.close_)
    this.getHandler().listen(this.close_, goog.events.EventType.CLICK, function() {
      /** @type {anychart.chartEditor2Module.EditorModel} */(this.getModel()).dropSeries(this.getParent().index(), this.index_);
    });

  goog.base(this, 'enterDocument');
};


/** @inheritDoc */
anychart.chartEditor2Module.SeriesPanel.prototype.exitDocument = function() {
  this.removeAllFields_();
  anychart.chartEditor2Module.SeriesPanel.base(this, 'exitDocument');
};


/**
 * Creates fields without options.
 */
anychart.chartEditor2Module.SeriesPanel.prototype.createFields = function() {
  var self = this;

  this.removeAllFields_();

  var seriesType = this.typeSelect_.getValue();
  var fieldsMap = anychart.chartEditor2Module.EditorModel.series[seriesType]['fields'];
  goog.object.forEach(fieldsMap,
      function(item) {
        var fieldLabel = item['name'] ? item['name'] : item['field'];
        var fieldSelect = new anychart.chartEditor2Module.controls.SelectWithLabel(item['field'], fieldLabel);
        var model = /** @type {anychart.chartEditor2Module.EditorModel} */(self.getModel());
        fieldSelect.setEditorModel(model, self.getKey([['mapping'], item['field']]));
        self.fields_.push(fieldSelect);
        self.addChild(fieldSelect, true);
      });
};


/**
 * Creates options for all fields.
 */
anychart.chartEditor2Module.SeriesPanel.prototype.createFieldsOptions = function() {
  var model = /** @type {anychart.chartEditor2Module.EditorModel} */(this.getModel());
  var activeDatasetId = model.getActive();
  var preparedData = model.getPreparedData();

  var data;
  for (var a = preparedData.length; a--;) {
    if (preparedData[a]['type'] + preparedData[a]['setId'] == activeDatasetId) {
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
        var caption = /*data['name'] + ' - ' + */dataFields[j]['name'];
        var option = new goog.ui.MenuItem(caption, dataFields[j]['key']);
        this.fields_[i].addItem(option);
      }
      this.fields_[i].setValueByModel();
    }
  }
};


/**
 * Removes all fields from panel.
 * @private
 */
anychart.chartEditor2Module.SeriesPanel.prototype.removeAllFields_ = function() {
  for (var a = this.fields_.length; a--;) {
    var field = this.fields_[a];
    this.removeChild(field, true);
    field.dispose();
  }
  this.fields_.length = 0;
};


/**
 * Getter/setter for index.
 *
 * @param {number=} opt_value
 * @return {number|anychart.chartEditor2Module.SeriesPanel}
 */
anychart.chartEditor2Module.SeriesPanel.prototype.index = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (goog.isNumber(opt_value)) {
      this.index_ = opt_value;
    }
    return this;
  }
  return this.index_;
};


/** @inheritDoc */
anychart.chartEditor2Module.SeriesPanel.prototype.getKey = function(opt_completion) {
  if (!this.key || !this.key.length) {
    if (!this.plotIndex_ && this.getParent())
      this.plotIndex_ = this.getParent().index();

    this.key = [['dataSettings'], ['mappings', this.plotIndex_], [this.index_]];
  }

  return anychart.chartEditor2Module.SeriesPanel.base(this, 'getKey', opt_completion);
};


/** @inheritDoc */
anychart.chartEditor2Module.SeriesPanel.prototype.dispose = function() {
  this.removeAllFields_();
  anychart.chartEditor2Module.SeriesPanel.base(this, 'dispose');
};