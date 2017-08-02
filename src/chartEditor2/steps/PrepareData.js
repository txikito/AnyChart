goog.provide('anychart.chartEditor2Module.steps.PrepareData');

goog.require('anychart.ui.button.Base');
goog.require('anychart.chartEditor2Module.GeoDataSelector');
goog.require('anychart.chartEditor2Module.PredefinedDataSelector');
goog.require('anychart.chartEditor2Module.events');
goog.require('anychart.chartEditor2Module.steps.Base');
goog.require('goog.dom.classlist');

goog.forwardDeclare('anychart.data.Mapping');


/**
 * Chart Editor Step Class.
 * @constructor
 * @param {number} index Step index
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @extends {anychart.chartEditor2Module.steps.Base}
 */
anychart.chartEditor2Module.steps.PrepareData = function(index, opt_domHelper) {
  goog.base(this, index, opt_domHelper);

  this.name('Prepare Data');
  this.title('Prepare Data');
};
goog.inherits(anychart.chartEditor2Module.steps.PrepareData, anychart.chartEditor2Module.steps.Base);



/** @override */
anychart.chartEditor2Module.steps.PrepareData.prototype.createDom = function() {
  goog.base(this, 'createDom');

  var element = /** @type {Element} */(this.getElement());
  goog.dom.classlist.add(element, 'step-prepare-data');

  var dom = this.getDomHelper();
  var uploadButtonsFormats = ['csv', 'xls', 'mysql', 'csv', 'xls', 'mysql'];
  var buttonsBar = dom.createDom(goog.dom.TagName.DIV, 'buttons');
  for (var i = 0; i < 6; i++) {
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
  element.appendChild(this.connectDataEl_);

  var predefinedDataSelector = new anychart.chartEditor2Module.PredefinedDataSelector(this.getParent().getModel());
  this.addChild(predefinedDataSelector, true);
  goog.dom.classlist.add(predefinedDataSelector.getElement(), 'section');

  var geoDataSelector = new anychart.chartEditor2Module.GeoDataSelector(this.getParent().getModel());
  this.addChild(geoDataSelector, true);
  goog.dom.classlist.add(geoDataSelector.getElement(), 'section');
};
