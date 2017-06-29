goog.provide('anychart.ui.chartEditor2.steps.PrepareData');

goog.require('anychart.ui.chartEditor2.events');
goog.require('anychart.ui.chartEditor2.steps.Base');
goog.require('goog.dom.classlist');
goog.require('goog.net.XhrIo');

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

  /**
   * @type {?Object}
   * @private
   */
  this.dataSetsIndexJson_ = null;

  this.loadDataSetsIndexJson_();
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

  this.dataSetsEl_ = dom.createDom(goog.dom.TagName.DIV, 'data-sets',
      dom.createDom(goog.dom.TagName.H2, null, 'Use one of our data sets'));

  this.contentEl_.appendChild(this.dataSetsEl_);
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
  //this.updateDataSets_();
};

anychart.ui.chartEditor2.steps.PrepareData.prototype.loadDataSetsIndexJson_ = function() {
  if (!this.dataSetsIndexJson_) {
    var self = this;
    var indexUrl = 'https://cdn.anychart.com/anydata/common/index.json';
    goog.net.XhrIo.send(indexUrl,
        function(e) {
          var xhr = e.target;
          self.dataSetsIndexJson_ = xhr.getResponseJson();
          self.showDataSets_();
        });
  }
};

anychart.ui.chartEditor2.steps.PrepareData.prototype.showDataSets_ = function() {
  for (var i = 0; i < this.dataSetsIndexJson_['sets'].length; i++) {
    var dataSetJson = this.dataSetsIndexJson_['sets'][i];
    var imgUrl = dataSetJson['logo'].replace('./', 'https://cdn.anychart.com/anydata/common/');
    var dom = this.getDomHelper();
    var item = dom.createDom(
        goog.dom.TagName.DIV, 'data-set',
        dom.createDom(goog.dom.TagName.DIV, 'content',
            dom.createDom(goog.dom.TagName.IMG, {'src': imgUrl}),
            dom.createDom(goog.dom.TagName.DIV, 'title', dataSetJson['name']),
            dom.createTextNode(dataSetJson['description']),
            dom.createDom(goog.dom.TagName.DIV, 'buttons',
                dom.createDom(goog.dom.TagName.A,
                    {
                      // 'href': dataSetJson['download'],
                      'class': 'anychart-button anychart-button-success download'
                    },
                    'Download'),
                dom.createDom(goog.dom.TagName.A,
                    {
                      'href': dataSetJson['sample'],
                      'class': 'anychart-button anychart-button-primary sample',
                      'target': 'blank_'
                    },
                    'View sample'))));

    item.setAttribute('data-set-id', dataSetJson['id']);
    this.dataSetsEl_.appendChild(item);
  }
};