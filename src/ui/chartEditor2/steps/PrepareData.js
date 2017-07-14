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



/** @override */
anychart.ui.chartEditor2.steps.PrepareData.prototype.createDom = function() {
  anychart.ui.chartEditor2.steps.PrepareData.base(this, 'createDom');

  var element = /** @type {Element} */(this.getElement());
  var dom = this.getDomHelper();

  goog.dom.classlist.add(element, 'step-prepare-data');

  var uploadButtonsFormats = ['csv', 'xls', 'mysql', 'csv', 'xls', 'mysql'];
  var buttonsBar = dom.createDom(goog.dom.TagName.DIV, 'buttons');
  for(var i = 0; i < 6; i++) {
    var format = uploadButtonsFormats[i];
    var button = new anychart.ui.button.Base(format);
    button.setIcon(format);
    button.setValue(format);
    button.render(buttonsBar);
    goog.dom.classlist.add(button.getElement(), 'upload-' + format);
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

  var predefinedDataSelector = new anychart.ui.chartEditor2.PredefinedDataSelector(this.getParent().getDataModel());
  this.addChild(predefinedDataSelector, true);
  goog.dom.classlist.add(predefinedDataSelector.getElement(), 'section');

  var geoDataSelector = new anychart.ui.chartEditor2.GeoDataSelector(this.getParent().getDataModel());
  this.addChild(geoDataSelector, true);
  goog.dom.classlist.add(geoDataSelector.getElement(), 'section');
};
