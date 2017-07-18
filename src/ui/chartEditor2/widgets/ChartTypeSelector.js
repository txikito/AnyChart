goog.provide('anychart.ui.chartEditor2.ChartTypeSelector');

goog.require('goog.ui.Container');
goog.require('anychart.ui.chartEditor2.select.ChartType');



/**
 * Chart type selection widget.
 * Allows to choose chart type and contains PlotPanel widget(s).
 * @constructor
 * @extends {anychart.ui.Container}
 */
anychart.ui.chartEditor2.ChartTypeSelector = function() {
  anychart.ui.chartEditor2.ChartTypeSelector.base(this, 'constructor');

};
goog.inherits(anychart.ui.chartEditor2.ChartTypeSelector, goog.ui.Container);


anychart.ui.chartEditor2.ChartTypeSelector.chartTypes = {
  'line': {
    'value': 'line',
    'name': 'Line Chart',
    'icon': 'line-chart-1.svg', // 'http://www.anychart.com/_design/img/upload/charts/types/'
    'series': ['line', 'spline', 'column', 'area', 'spline-area'] // first value is default
  },
  'column': {
    'value': 'column',
    'name': 'Column Chart',
    'icon': 'column-chart.svg',
    'series': ['column', 'line', 'spline', 'area', 'spline-area']
  },
  'area': {
    'value': 'area',
    'name': 'Area Chart',
    'icon': 'area-chart.svg',
    'series': ['area', 'line', 'spline', 'column', 'spline-area']
  }
};

anychart.ui.chartEditor2.ChartTypeSelector.series = {
  'line': {
    'fields': [{name: 'Y Value', field: 'y'}]
  },
  'column': {
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
};


anychart.ui.chartEditor2.ChartTypeSelector.prototype.enterDocument = function() {
  anychart.ui.chartEditor2.ChartTypeSelector.base(this, 'enterDocument');
  this.getHandler().listen(this.chartTypeSelect_, goog.events.EventType.CHANGE, this.onChangeChartType_);
};


anychart.ui.chartEditor2.ChartTypeSelector.prototype.onChangeChartType_ = function(evt) {
  this.typeIcon_.setAttribute('src', this.chartTypeSelect_.getIcon());
  this.changeChartType();
};


anychart.ui.chartEditor2.ChartTypeSelector.prototype.changeChartType = function() {
  //
};