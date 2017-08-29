goog.provide('anychart.chartEditor2Module.steps.PrepareData');

goog.require('anychart.chartEditor2Module.DataDialog');
goog.require('anychart.chartEditor2Module.GeoDataSelector');
goog.require('anychart.chartEditor2Module.PredefinedDataSelector');
goog.require('anychart.chartEditor2Module.events');
goog.require('anychart.chartEditor2Module.steps.Base');
goog.require('goog.dom.classlist');
goog.require('goog.ui.Button');

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

  /**
   * @type {?anychart.chartEditor2Module.DataDialog}
   * @private
   */
  this.dataDialog_ = null;
};
goog.inherits(anychart.chartEditor2Module.steps.PrepareData, anychart.chartEditor2Module.steps.Base);



/** @override */
anychart.chartEditor2Module.steps.PrepareData.prototype.createDom = function() {
  goog.base(this, 'createDom');

  var element = /** @type {Element} */(this.getElement());
  goog.dom.classlist.add(element, 'step-prepare-data');

  var dom = this.getDomHelper();

  var buttonsMap = [
    {name: 'file-csv', img: 'csv'},
    {name: 'file-json', img: 'json'},
    {name: 'file-xml', img: 'xml'},
    {name: 'string-csv', img: 'csv'},
    {name: 'string-json', img: 'json'},
    {name: 'string-xml', img: 'xml'},
    {name: 'spreadsheets', img: 'spreadsheets'}
  ];

  var buttonsBar = dom.createDom(goog.dom.TagName.DIV, 'buttons');
  for (var i = 0; i < buttonsMap.length; i++) {
    var name = buttonsMap[i].name;

    var button = new goog.ui.Button(name);
    button.setValue(name);

    button.render(buttonsBar);
    // goog.dom.classlist.add(button.getElement(), 'upload-' + format);

    button.listen(goog.ui.Component.EventType.ACTION, this.onUploadButtonClick, false, this);
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

anychart.chartEditor2Module.steps.PrepareData.prototype.onUploadButtonClick = function(evt) {
  var type = evt.target.getValue();
  var tmp = type.split('-');
  this.openDialog(tmp[0], tmp[1]);
};


anychart.chartEditor2Module.steps.PrepareData.prototype.openDialog = function(dialogType, opt_dataType) {
  console.log(dialogType, opt_dataType);

  if(!this.dataDialog_) {
    this.dataDialog_ = new anychart.chartEditor2Module.DataDialog('data-dialog');
    this.dataDialog_.setButtonSet(goog.ui.Dialog.ButtonSet.createOkCancel());

    goog.events.listen(this.dataDialog_, goog.ui.Dialog.EventType.SELECT, function(e) {
      console.log('You chose: ' + e.key);
    });
  }

  this.dataDialog_.setTitle('My favorite LOLCat');
  this.dataDialog_.setVisible(true);
};
