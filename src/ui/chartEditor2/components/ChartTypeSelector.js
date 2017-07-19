goog.provide('anychart.ui.chartEditor2.ChartTypeSelector');

goog.require('goog.ui.Component');
goog.require('anychart.ui.chartEditor2.PlotPanel');
goog.require('anychart.ui.chartEditor2.select.ChartType');


/**
 * Chart type selection widget.
 * Allows to choose chart type and contains PlotPanel widget(s).
 * @constructor
 * @extends {anychart.ui.Container}
 */
anychart.ui.chartEditor2.ChartTypeSelector = function(dataModel) {
  anychart.ui.chartEditor2.ChartTypeSelector.base(this, 'constructor');

  /**
   * @type {anychart.ui.chartEditor2.DataModel}
   * @private
   */
  this.dataModel_ = dataModel;

  /**
   * @type {Array.<anychart.ui.chartEditor2.PlotPanel>}
   * @private
   */
  this.plots_ = [];

};
goog.inherits(anychart.ui.chartEditor2.ChartTypeSelector, goog.ui.Component);


anychart.ui.chartEditor2.ChartTypeSelector.chartTypes = {
  'line': {
    'value': 'line',
    'name': 'Line Chart',
    'icon': 'line-chart-1.svg', // 'http://www.anychart.com/_design/img/upload/charts/types/'
    'series': ['line', 'spline', 'column', 'area'] // first value is default
  },
  'column': {
    'value': 'column',
    'name': 'Column Chart',
    'icon': 'column-chart.svg',
    'series': ['column', 'line', 'spline', 'area']
  },
  'area': {
    'value': 'area',
    'name': 'Area Chart',
    'icon': 'area-chart.svg',
    'series': ['area', 'line', 'spline', 'column']
  },
  'stock': {
    'value': 'stock',
    'name': 'Stock Chart',
    'icon': 'stock-chart.svg',
    'series': ['ohlc', 'line', 'column', 'area']
  }
};


anychart.ui.chartEditor2.ChartTypeSelector.series = {
  'line': {
    'fields': [{name: 'Y Value', field: 'y'}]
  },
  'spline': {
    'fields': [{name: 'Y Value', field: 'y'}]
  },
  'column': {
    'fields': [{name: 'Y Value', field: 'y'}]
  },
  'area': {
    'fields': [{name: 'Y Value', field: 'y'}]
  },
  'ohlc': {
    'fields': [
      {field: 'open'},
      {field: 'high'},
      {field: 'low'},
      {field: 'close'}]
  }
};


/** @inheritDoc */
anychart.ui.chartEditor2.ChartTypeSelector.prototype.createDom = function() {
  anychart.ui.chartEditor2.ChartTypeSelector.base(this, 'createDom');

  goog.dom.classlist.add(this.getElement(), 'chart-type-selector');
  var dom = this.getDomHelper();

  this.chartTypeSelect_ = new anychart.ui.chartEditor2.select.ChartType();
  this.chartTypeSelect_.setOptions(goog.object.getValues(anychart.ui.chartEditor2.ChartTypeSelector.chartTypes));

  this.typeIcon_ = dom.createDom(goog.dom.TagName.IMG, {
    'class': 'type-image',
    'src': this.chartTypeSelect_.getIcon()
  });
  dom.appendChild(this.getElement(), this.typeIcon_);
  this.addChild(this.chartTypeSelect_, true);

  this.chartType_ = 'line';
  this.setChartType();
};


anychart.ui.chartEditor2.ChartTypeSelector.prototype.enterDocument = function() {
  anychart.ui.chartEditor2.ChartTypeSelector.base(this, 'enterDocument');
  this.listen(anychart.ui.chartEditor2.events.EventType.CLOSE_PANEL, this.onClosePlot_);
  this.getHandler().listen(this.chartTypeSelect_, goog.events.EventType.CHANGE, this.onChangeChartType_);
  this.getHandler().listen(this.dataModel_, anychart.ui.chartEditor2.events.EventType.UPDATE_DATA_MODEL, this.update);

  this.update(null);
};


anychart.ui.chartEditor2.ChartTypeSelector.prototype.onChangeChartType_ = function(evt) {
  this.typeIcon_.setAttribute('src', this.chartTypeSelect_.getIcon());
  this.chartType_ = this.chartTypeSelect_.getSelectedItem().getModel();
  this.setChartType();
};


anychart.ui.chartEditor2.ChartTypeSelector.prototype.onAddPlot_ = function() {
  var i = this.getChildCount();
  if (i > 0) i--;
  var plot = new anychart.ui.chartEditor2.PlotPanel(this.dataModel_, this.chartType_, this.plots_.length);
  this.plots_.push(plot);
  this.addChildAt(plot, i, true);
};


anychart.ui.chartEditor2.ChartTypeSelector.prototype.onClosePlot_ = function(evt) {

  if (evt.panelType == 'plot') {
    var plot = goog.array.splice(this.plots_, evt.index, 1)[0];
    this.removeChild(plot, true);
    plot.dispose();

    for (var i = 0; i < this.plots_.length; i++) {
      this.plots_[i].index(i);
    }
  }
};


anychart.ui.chartEditor2.ChartTypeSelector.prototype.setChartType = function() {
  for (var i = 0; i < this.plots_.length; i++) {
    this.removeChild(this.plots_[i], true);
    this.plots_[i].dispose();
  }

  this.plots_.length = 0;
  var plot = new anychart.ui.chartEditor2.PlotPanel(this.dataModel_, this.chartType_, 0);
  this.plots_.push(plot);
  this.addChild(plot, true);

  if (this.chartType_ == 'stock') {
    this.addPlotBtn_ = new goog.ui.Button('Add plot');
    this.addChildAt(this.addPlotBtn_, this.getChildCount(), true);
    this.getHandler().listen(this.addPlotBtn_, goog.ui.Component.EventType.ACTION, this.onAddPlot_);
  } else if (this.addPlotBtn_) {
    // Убрать кнопку
    this.removeChild(this.addPlotBtn_, true);
    this.addPlotBtn_.dispose();
    this.addPlotBtn_ = null;
  }
};


anychart.ui.chartEditor2.ChartTypeSelector.prototype.update = function(evt) {
  // TODO: надо ли что-то делать?
};


