goog.provide('anychart.ui.chartEditor2.SeriesPanel');

goog.require('goog.ui.Container');



/**
 * @constructor
 * @extends {goog.ui.Container}
 */
anychart.ui.chartEditor2.SeriesPanel = function(type, index) {
  goog.base(this);

  this.index_ = index;

  this.type_ = type;
};
goog.inherits(anychart.ui.chartEditor2.SeriesPanel, goog.ui.Container);


/** @inheritDoc */
anychart.ui.chartEditor2.SeriesPanel.prototype.createDom = function() {
  goog.base(this, 'createDom');

  goog.dom.classlist.add(this.getElement(), 'series-panel');
  goog.dom.classlist.add(this.getElement(), 'closable');

  var dom = this.getDomHelper();

  if (this.index_ > 0) {
    this.close_ = dom.createDom(goog.dom.TagName.DIV, 'close', 'X');
    this.getElement().appendChild(this.close_);
  }

  this.title_ = dom.createDom(goog.dom.TagName.H3, null, this.type_ + ' series ' + this.index_);
  this.getElement().appendChild(this.title_);
};


anychart.ui.chartEditor2.SeriesPanel.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  if (this.close_)
    this.getHandler().listen(this.close_, goog.events.EventType.CLICK, this.onClose_);
};


anychart.ui.chartEditor2.SeriesPanel.prototype.onClose_ = function(evt) {
  this.dispatchEvent({
    type: anychart.ui.chartEditor2.events.EventType.CLOSE_PANEL,
    panelType: 'series',
    index: this.index_
  })
};


anychart.ui.chartEditor2.SeriesPanel.prototype.index = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (goog.isNumber(opt_value)) {
      this.index_ = opt_value;
      this.title_.innerHTML = this.type_ + ' series ' + this.index_;
    }
    return this;
  }
  return this.index_;
};