goog.provide('anychart.magic');
goog.require('anychart.core.Base');
goog.require('anychart.core.Chart');
goog.require('anychart.core.ui.Background');
goog.require('anychart.format');
goog.require('goog.dom');
goog.require('goog.dom.forms');


/**
 @namespace
 @name anychart.magic
 */


anychart.magic.charts = {};

/**
 *
 * @param {(Object|string)} targetOrPath
 * @param {(string|number)} pathOrPathArgs
 * @param {(string|number)=} var_args
 * @return {*}
 */
anychart.magic.get = function(targetOrPath, pathOrPathArgs, var_args) {
  var target = targetOrPath;
  var path = pathOrPathArgs;
  var pathArgsIndex = 2;

  if (goog.isString(targetOrPath)) {
    target = window;
    path = targetOrPath;
    pathArgsIndex = 1;
  }

  var pathParsed = window['anychart']['magic']._parsePath(path);
  if (pathParsed) {
    var pathArgs = [].slice.call(arguments).slice(pathArgsIndex);
    target = window['anychart']['magic']._applyPath(target, pathParsed, pathArgs);
  }

  return target;
};


/**
 *
 * @param {(Object|string)} targetOrPath
 * @param {(string|number|boolean)} pathOrValue
 * @param {(string|number|boolean)} valueOrPathArgs
 * @param {(string|number)=} var_args
 * @return {*}
 */
anychart.magic.set = function(targetOrPath, pathOrValue, valueOrPathArgs, var_args) {
  var target = targetOrPath;
  var path = pathOrValue;
  var value = valueOrPathArgs;
  var pathArgsIndex = 3;

  if (goog.isString(targetOrPath)) {
    target = window;
    path = targetOrPath;
    value = pathOrValue;
    pathArgsIndex = 2;
  }

  var pathParts = window['anychart']['magic']._parsePath(path);
  if (pathParts) {
    var pathArgs = [].slice.call(arguments).slice(pathArgsIndex);
    return window['anychart']['magic']._applyPath(target, pathParts, pathArgs, value);
  }

  return false;
};


/**
 * Parses settings path for get() or set() methods.
 * @param path
 * @return {(Array|boolean)} Array of settings with it's arguments or false in case of wrong path format.
 * @private
 */
anychart.magic._parsePath = function(path) {
  var elementExp = /\s*\.?\s*(([\w_]+)(\(\s*(,?\s*([\d\.]+|\"[^"]+\"|\'[^']+\'|\{\d+\}))*\s*\))?)/;
  var result = [];
  var error = false;
  var match;
  do {
    match = path.match(elementExp);
    if(!match) {
      error = true;
      break;
    }
    var call = match[3];
    var args = void 0;
    if (call) {
      var argsStr = /\(\s*(.*)\s*\)/.exec(call);
      if (argsStr[1]) {
        args = argsStr[1].split(/\s*,\s*/);
      }
      call = true;
    }
    result.push([match[2], call, args]);
    path = path.replace(match[0], '');
  } while (path.length);

  return error ? false : result;
};


/**
 * Tries to apply settings returned by this._parsePath() method in chaining style starting from target object.
 * @param {Object} target
 * @param {Array.<Array>} path
 * @param {Array.<(string|number)>} pathArguments
 * @param {(string|number)=} opt_lastArgument
 * @return {*}
 * @private
 */
anychart.magic._applyPath = function(target, path, pathArguments, opt_lastArgument) {
  var part;
  var name;
  var call;
  var args;

  try {
    for (var i = 0; i < path.length; i++) {
      part = path[i];

      name = part[0];
      call = part[1];
      args = part[2];

      if (args) {
        for (var j = 0; j < args.length; j++) {
          args[j] = args[j].replace(/['"](.*)['"]/, '$1');
          var substMatch = args[j].match(/^\{(\d+)\}$/);
          if (substMatch) {
            var a = Number(substMatch[1]);
            args[j] = pathArguments[a] ? pathArguments[a] : void 0;
          }
        }
      }

      if (opt_lastArgument != void 0 && i == path.length - 1) {
        args = args ? args : [];
        args.push(opt_lastArgument);
      }

      target = call ? target[name].apply(target, args) : target[name];
    }
  } catch (e) {
    // todo: work this out
    console.log('Can\'t get/set by key: \'', name, '\' and arguments: \'', args , '\'');
    anychart.core.reporting.warning(anychart.enums.WarningCode.BAD_REQUEST, null, null, true);
    return null;
  }

  return target;
};


/**
 *
 * @param {?(string|Element|Array.<Element|string>|*)} opt_value
 */
anychart.magic.init = function(opt_value) {
  if (!goog.isDef(opt_value)) opt_value = 'ac-control';

  if (goog.dom.isElement(opt_value)) {
    var element = opt_value;
    var type = element.type;

    if (!goog.isDef(type))
      return null;

    var chartId = element.getAttribute('ac-chart-id');
    var key = element.getAttribute('ac-key');
    var event = goog.events.EventType.CHANGE;
    var setValue = true;

    // if (key == 'xAxis(0).orientation()') {
    //    // debugger;
    // }

    type = type.toLowerCase();
    switch(type) {
      case goog.dom.InputType.BUTTON:
      case goog.dom.InputType.SUBMIT:
        setValue = false;
        event = goog.events.EventType.CLICK;
        break;
      case goog.dom.InputType.RADIO:
        setValue = false;
        break;
      case goog.dom.InputType.TEXT:
      case goog.dom.InputType.TEXTAREA:
      case goog.dom.InputType.RANGE:
        event = goog.events.EventType.INPUT;
        break;
    }

    if (chartId && key && setValue) {
      var value = window['anychart']['magic'].get(window['anychart']['magic'].charts[chartId], key);
      if (goog.isDefAndNotNull(value)) {
        switch (type) {
          case goog.dom.InputType.COLOR:
            if (goog.isFunction(value)) {
              // if user uses fill() key which has a function value
              value = "#ffffff";
            } else if (value instanceof anychart.core.ui.Background) {
              value = value['fill']();
            }
            break;
          case goog.dom.InputType.DATE:
            value = anychart.format.dateTime(value, "yyyy-MM-dd");
            break;
        }

        value = goog.isBoolean(value) ? value : String(value);
        goog.dom.forms.setValue(element, value);
      }
    }
    goog.events.listen(element, event, window['anychart']['magic']._onElementChange, false, this);

  } else if (goog.isString(opt_value)) {
    var elements = goog.dom.getElementsByClass(opt_value);
    window['anychart']['magic'].init(elements);

  } else if (goog.isArray(opt_value) || goog.dom.isNodeList(opt_value)){
    for(var i = 0; i < opt_value.length; i++) {
      window['anychart']['magic'].init(opt_value[i]);
    }
  }
};


anychart.magic._onElementChange = function(event) {
  /** @type {!HTMLInputElement} */
  var element = event.target;
  var chartId = event.target.getAttribute('ac-chart-id');
  var key = event.target.getAttribute('ac-key');
  //debugger;
  if (chartId && window['anychart']['magic'].charts[chartId] && key) {
    var type = element.type;
    if (!goog.isDef(type))
      return null;

    var value = goog.dom.forms.getValue(element);
    // if(type == 'date') debugger;
    switch (type.toLowerCase()) {
      case goog.dom.InputType.CHECKBOX:
        value = !!value;
        break;
      case goog.dom.InputType.DATE:
        value = anychart.format.parseDateTime(value, "yyyy-MM-dd");
        break;
    }

    window['anychart']['magic'].set(window['anychart']['magic'].charts[chartId], key, value);
  }
};

/**
 * Patch for anychart.core.Chart.prototype.id()
 * While setting id adds this chart instance to anychart.magic.chart
 * @param opt_value {?string}
 * @return {(anychart.core.Chart|string)} Returns chart id or chart itself for chaining.
 */
anychart.core.Chart.prototype.id = function(opt_value) {
  if (goog.isDefAndNotNull(opt_value) && this.id_ != opt_value) {
    if (anychart.magic.charts[opt_value]) {
      anychart.core.reporting.warning(anychart.enums.WarningCode.OBJECT_KEY_COLLISION, null, [opt_value], true);
      return this;
    }

    delete anychart.magic.charts[this.id_];
    this.id_ = opt_value;
    anychart.magic.charts[this.id_] = this;
    return this;
  }

  return this.id_;
};


/** @inheritDoc */
anychart.core.Chart.prototype.dispose = function() {
  delete anychart.magic.charts[this.id_];
  anychart.core.Chart.base(this, 'dispose');
};


//exports
(function() {
  var proto = anychart.core.Chart.prototype;
  proto['id'] = proto.id;
  proto['dispose'] = proto.dispose;

  goog.exportSymbol('anychart.magic.get', anychart.magic.get);
  goog.exportSymbol('anychart.magic.set', anychart.magic.set);
  goog.exportSymbol('anychart.magic.init', anychart.magic.init);
})();