goog.provide('anychart.chartEditor2Module.DataDialog');

goog.require('goog.ui.Dialog');


anychart.chartEditor2Module.DataDialog = function(opt_class, opt_useIframeMask, opt_domHelper) {
  anychart.chartEditor2Module.DataDialog.base(this, 'constructor', opt_class, opt_useIframeMask, opt_domHelper);
};
goog.inherits(anychart.chartEditor2Module.DataDialog, goog.ui.Dialog);


anychart.chartEditor2Module.DataDialog.prototype.update = function(dialogType, opt_dataType){
  this.type_ = dialogType;
  this.dataType_ = opt_dataType;

  var title;
  if (dialogType == 'file') {
    title = opt_dataType.toUpperCase() + ' file';
  } else if (dialogType == 'string') {
    title = opt_dataType.toUpperCase() + ' string';
  } else {
    title = 'Google Spreadsheet';
  }
  this.setTitle(title);

  var dom = this.getDomHelper();
  var contentEl = this.getContentElement();

  this.input_ = null;
  this.input2_ = null;
  while (contentEl.firstChild) {
    contentEl.removeChild(contentEl.firstChild);
  }

  var pholder = '';
  if (dialogType == 'file') {
    pholder = 'Enter URL to ' + opt_dataType.toUpperCase() + ' file';
    this.input_ = dom.createDom(goog.dom.TagName.INPUT, {class: 'input', placeholder: pholder});
    contentEl.appendChild(this.input_);

  } else if (dialogType == 'string') {
    pholder = 'Paste ' + opt_dataType.toUpperCase() + ' string';
    this.input_ = dom.createDom(goog.dom.TagName.TEXTAREA, {class: 'input', placeholder: pholder});
    contentEl.appendChild(this.input_);

  } else {
    pholder = 'ID or URL to spreadsheet';
    this.input_ = dom.createDom(goog.dom.TagName.INPUT, {class: 'input', placeholder: pholder});

    pholder = 'Sheet ID or index';
    this.input2_ = dom.createDom(goog.dom.TagName.INPUT, {class: 'input', placeholder: pholder});

    contentEl.appendChild(this.input_);
    contentEl.appendChild(this.input2_);
  }
};


anychart.chartEditor2Module.DataDialog.prototype.getType = function(){
  return this.type_;
};


anychart.chartEditor2Module.DataDialog.prototype.getDataType = function(){
  return this.dataType_;
};


anychart.chartEditor2Module.DataDialog.prototype.getInputValue = function(){
  return this.input_ && this.input_.value;
};


anychart.chartEditor2Module.DataDialog.prototype.getInput2Value = function(){
  return this.input2_ && this.input2_.value;
};
