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


/** @inheritDoc */
anychart.ui.chartEditor2.ChartTypeSelector.prototype.createDom = function() {
  anychart.ui.chartEditor2.ChartTypeSelector.base(this, 'createDom');

  goog.dom.classlist.add(this.getElement(), 'chart-type-selector');

  var dom = this.getDomHelper();
  this.icon_ = dom.createDom(goog.dom.TagName.IMG, {'src': 'http://www.anychart.com/_design/img/upload/charts/types/percent-stacked-area-chart.svg'});

  this.chartTypeSelect_ = new anychart.ui.chartEditor2.select.ChartType();

  this.addChild(this.chartTypeSelect_);

  this.getElement().appendChild(
      dom.createDom(goog.dom.TagName.DIV, 'top',
          this.icon_,
          this.chartTypeSelect_.getElement()));
};


anychart.ui.chartEditor2.ChartTypeSelector.prototype.enterDocument = function() {
  anychart.ui.chartEditor2.ChartTypeSelector.base(this, 'enterDocument');
};
