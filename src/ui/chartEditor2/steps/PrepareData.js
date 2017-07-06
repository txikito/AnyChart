goog.provide('anychart.ui.chartEditor2.steps.PrepareData');

goog.require('anychart.ui.chartEditor2.events');
goog.require('anychart.ui.chartEditor2.PredefinedDataSelector');
goog.require('anychart.ui.chartEditor2.GeoDataSelector');
goog.require('anychart.ui.chartEditor2.steps.Base');
goog.require('goog.dom.classlist');

goog.forwardDeclare('anychart.data.Mapping');


/**
 * Chart Editor Step Class.
 * @constructor
 * @param {number} index Step index
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @extends {anychart.ui.chartEditor2.steps.Base}
 */
anychart.ui.chartEditor2.steps.PrepareData = function(index, opt_domHelper) {
  anychart.ui.chartEditor2.steps.PrepareData.base(this, 'constructor', index, opt_domHelper);

  this.name('Prepare Data');
  this.title('Prepare Data');
};
goog.inherits(anychart.ui.chartEditor2.steps.PrepareData, anychart.ui.chartEditor2.steps.Base);


/**
 * CSS class name.
 * @type {string}
 */
anychart.ui.chartEditor2.steps.PrepareData.CSS_CLASS = goog.getCssName('step-prepare-data');


/**
 * DataSet index attribute.
 * @private
 */
anychart.ui.chartEditor2.steps.PrepareData.DATA_SET_DATA_ATTRIBUTE_ = 'data-index';


/** @override */
anychart.ui.chartEditor2.steps.PrepareData.prototype.createDom = function() {
  anychart.ui.chartEditor2.steps.PrepareData.base(this, 'createDom');

  var element = /** @type {Element} */(this.getElement());
  var dom = this.getDomHelper();

  var className = anychart.ui.chartEditor2.steps.PrepareData.CSS_CLASS;
  goog.dom.classlist.add(element, className);

  var uploadButtonsFormats = ['csv', 'xls', 'mysql', 'csv', 'xls', 'mysql'];
  var buttonsBar = dom.createDom(goog.dom.TagName.DIV, 'buttons');
  for(var i = 0; i < 6; i++) {
    var format = uploadButtonsFormats[i];
    var button = new anychart.ui.button.Base(format);
    button.setIcon(format);
    button.setValue(format);
    button.render(buttonsBar);
  }

  this.connectDataEl_ = dom.createDom(goog.dom.TagName.DIV, 'connect-data',
      dom.createDom(goog.dom.TagName.DIV, 'section-content',
          dom.createDom(goog.dom.TagName.DIV, 'inner',
              dom.createDom(goog.dom.TagName.DIV, 'top',
                  dom.createDom(goog.dom.TagName.H2, null, 'Connect your data')),
              buttonsBar,
              dom.createDom(goog.dom.TagName.DIV, 'uploaded',
                  dom.createDom(goog.dom.TagName.DIV, 'inner', 'Nothing uploaded yet...')),
              dom.createDom(goog.dom.TagName.DIV, 'cb'))));
  goog.dom.classlist.add(this.connectDataEl_, 'section');
  element.append(this.connectDataEl_);

  var predefinedDataSelector = new anychart.ui.chartEditor2.PredefinedDataSelector();
  //predefinedDataSelector.setParentEventTarget(this);
  predefinedDataSelector.render(element);
  goog.dom.classlist.add(predefinedDataSelector.getElement(), 'section');

  var geoDataSelector = new anychart.ui.chartEditor2.GeoDataSelector();
  //predefinedDataSelector.setParentEventTarget(this);
  geoDataSelector.render(element);
  goog.dom.classlist.add(geoDataSelector.getElement(), 'section');
};


/** @inheritDoc */
anychart.ui.chartEditor2.steps.PrepareData.prototype.enterDocument = function() {
  anychart.ui.chartEditor2.steps.PrepareData.base(this, 'enterDocument');

  // this.getHandler().listen(this.dataPreviewContentEl_, goog.events.EventType.WHEEL, this.handleWheel);
  //
  // this.getHandler().listen(this.dataSetsEl_, goog.events.EventType.CLICK, this.dataSetsClickHandler_);

  //console.log(this.dataSetsIndexJson_)
};


/** @inheritDoc */
anychart.ui.chartEditor2.steps.PrepareData.prototype.update = function() {

};