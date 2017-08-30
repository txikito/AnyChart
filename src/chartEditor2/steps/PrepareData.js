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
  this.dialogType_ = dialogType;
  this.dialogDataType_ = opt_dataType;

  if (!this.dataDialog_) {
    this.dataDialog_ = new anychart.chartEditor2Module.DataDialog('data-dialog');
    this.dataDialog_.setButtonSet(goog.ui.Dialog.ButtonSet.createOkCancel());
    goog.events.listen(this.dataDialog_, goog.ui.Dialog.EventType.SELECT, this.onCloseDialog, void 0, this);
  }

  this.dataDialog_.update(dialogType, opt_dataType);

  //this.dataDialog_.setTitle('My favorite LOLCat');
  this.dataDialog_.setVisible(true);
};


anychart.chartEditor2Module.steps.PrepareData.prototype.onCloseDialog = function(evt) {
  var dialog = evt.target;
  if (evt.key == 'ok') {
    var self = this;
    var dialogType = this.dialogType_;
    var dataType = this.dialogDataType_;

    var inputValue = dialog.getInputValue();
    if (inputValue) {
      if (dialogType == 'file') {
        var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
        var regex = new RegExp(expression);
        if (inputValue.match(regex)) {
          switch (dataType) {
            case 'json':
              anychart.data.loadJsonFile(inputValue, function(data) {
                self.onSuccessDataLoad(data, dataType);
              }, this.onErrorDataLoad);

              break;

            case 'csv':
              anychart.data.loadCsvFile(inputValue, function(data) {
                self.onSuccessDataLoad(data, dataType);
              }, this.onErrorDataLoad);
              break;

            case 'xml':
              anychart.data.loadXmlFile(inputValue, function(data) {
                self.onSuccessDataLoad(data, dataType);
              }, this.onErrorDataLoad);
              break;
          }
        } else {
          console.warn("Invalid url!")
        }

      } else if (dialogType == 'string') {
        this.addLoadedData(inputValue, dataType);
      }
    }
  }
};


anychart.chartEditor2Module.steps.PrepareData.prototype.addLoadedData = function(data, dataType) {
  var result = null;
  var typeOf = goog.typeOf(data);
  if (typeOf == 'object' || typeOf == 'array') {
    result = data;

  } else {
    var error = false;
    switch (dataType) {
      case 'json':
        if (typeOf == 'string') {
          try {
            result = goog.json.hybrid.parse(data);
          } catch (err) {
            // parsing error
            error = true;
          }
        }
        break;

      case 'csv':
        result = anychart.data.parseText(data);
        break;

      case 'xml':
        try {
          result = anychart.chartEditor2Module.steps.PrepareData.xmlStringToJson_(data);
        } catch (err) {
          // parsing error
          error = true;
        }

        break;
    }

    if (!result || error)
      console.warn("Invalid data!");
  }

  console.log(result);

  return result;
};


anychart.chartEditor2Module.steps.PrepareData.prototype.onSuccessDataLoad = function(data, dataType) {
  if (!data) return;
  this.addLoadedData(data, dataType);
};


anychart.chartEditor2Module.steps.PrepareData.prototype.onErrorDataLoad = function(errorCode) {
  console.warn("Invalid data!", errorCode);
};


anychart.chartEditor2Module.steps.PrepareData.xmlStringToJson_ = function(xmlString) {
  var wnd = goog.dom.getWindow();
  var parseXml;

  if (wnd.DOMParser) {
    var isParseError = function(parsedDocument) {
      // parser and parsererrorNS could be cached on startup for efficiency
      var parser = new DOMParser(),
          errorneousParse = parser.parseFromString('<', 'text/xml'),
          parsererrorNS = errorneousParse.getElementsByTagName("parsererror")[0].namespaceURI;

      if (parsererrorNS === 'http://www.w3.org/1999/xhtml') {
        // In PhantomJS the parseerror element doesn't seem to have a special namespace, so we are just guessing here :(
        return parsedDocument.getElementsByTagName("parsererror").length > 0;
      }
      return parsedDocument.getElementsByTagNameNS(parsererrorNS, 'parsererror').length > 0;
    };

    parseXml = function(xmlStr) {
      var parser = new DOMParser();
      var dom = parser.parseFromString(xmlStr, 'text/xml');
      if (isParseError(dom)) {
        throw new Error('Error parsing XML');
      }
      return dom;
    };
  } else if (typeof wnd.ActiveXObject != "undefined" && new wnd.ActiveXObject("Microsoft.XMLDOM")) {
    parseXml = function(xmlStr) {
      var xmlDoc = new wnd.ActiveXObject("Microsoft.XMLDOM");
      xmlDoc.async = "false";
      xmlDoc.loadXML(xmlStr);
      return xmlDoc;
    };
  } else {
    parseXml = function() {
      return null;
    }
  }

  var xmlDoc = parseXml(xmlString);
  if (xmlDoc) {
    return anychart.utils.xml2json(xmlDoc);
  }

  return null;
};
