goog.provide('anychart.magic');
goog.require('goog.dom');
goog.require('goog.dom.forms');
goog.require('goog.events');


/**
 @namespace
 @name anychart.magic
 */


/** Enable tracking. */
window['anychart']['trackIdentifiedCharts'](true);


/**
 *
 * @param {(Object|string)} targetOrPath
 * @param {(string|number)} pathOrPathArgs
 * @param {...(string|number)} var_args
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

  var pathParsed = anychart.magic.parsePath_(path);
  if (pathParsed) {
    var pathArgs = [];
    for (var i = pathArgsIndex; i < arguments.length; i++) {
      pathArgs.push(arguments[i]);
    }
    target = anychart.magic.applyPath_(/** @type {Object} */(target), /** @type {Array} */(pathParsed), pathArgs);
  }

  return target;
};


/**
 *
 * @param {(Object|string)} targetOrPath
 * @param {(string|number|boolean)} pathOrValue
 * @param {(string|number|boolean)} valueOrPathArgs
 * @param {...(string|number)} var_args
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

  var pathParsed = anychart.magic.parsePath_(path);
  if (pathParsed) {
    var pathArgs = [];
    for (var i = pathArgsIndex; i < arguments.length; i++) {
      pathArgs.push(arguments[i]);
    }
    return anychart.magic.applyPath_(/** @type {Object} */(target), /** @type {Array} */(pathParsed), pathArgs, value);
    // return anychart.magic.applyPath_(target, pathParts, pathArgs, value);
  }

  return false;
};


/**
 * Parses settings path for get() or set() methods.
 * @param {string} path
 * @return {(Array|boolean)} Array of settings with it's arguments or false in case of wrong path format.
 * @private
 */
anychart.magic.parsePath_ = function(path) {
  var elementExp = /\s*\.?\s*(([\w_]+)(\(\s*(,?\s*([\d\.]+|\".+\"|\'.+\'|\{\d+\}))*\s*\))?)/;
  var result = [];
  var error = false;
  var match;
  do {
    match = path.match(elementExp);
    if (!match) {
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
 * Tries to apply settings returned by this.parsePath_() method in chaining style starting from target object.
 * @param {Object} target
 * @param {Array.<Array>} path
 * @param {Array.<(string|number)>} pathArguments
 * @param {(string|number|boolean)=} opt_lastArgument
 * @return {*}
 * @private
 */
anychart.magic.applyPath_ = function(target, path, pathArguments, opt_lastArgument) {
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
          var tmp = args[j].replace(/^["']{1}(.*)["']{1}$/, '$1');
          if (tmp == args[j]) {
            var substMatch = args[j].match(/^\{(\d+)\}$/);
            if (substMatch) {
              var a = Number(substMatch[1]);
              args[j] = goog.isDef(pathArguments[a]) ? pathArguments[a] : void 0;
            }
          } else {
            args[j] = tmp;
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
    var message = 'Can not apply key \'' + name + '\'';
    if (call) message += '()';
    if (args) message += ' with arguments [' + args + ']';

    // anychart.core.reporting.warning(anychart.enums.WarningCode.BAD_REQUEST, null, [message], true);
    // todo: ?
    console.warn(message);
    return null;
  }

  return target;
};


/**
 *
 * @param {(string|Element|Array.<Element|string>|*)=} opt_value
 * @return {*}
 */
anychart.magic.init = function(opt_value) {
  if (!goog.isDef(opt_value)) opt_value = 'ac-control';

  if (goog.dom.isElement(opt_value)) {
    var element = /** @type {Element} */(opt_value);
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
    switch (type) {
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
      var trackingCharts = window['anychart']['getTrackingCharts']();
      var value = anychart.magic.get(trackingCharts[chartId], key);
      if (goog.isDefAndNotNull(value)) {
        switch (type) {
          case goog.dom.InputType.COLOR:
            if (goog.isFunction(value)) {
              // if user uses fill() key which value is a function
              // value = "#ffffff";
            } else if (goog.isObject(value) && goog.isFunction(value['fill'])) {
              // if value instanceof anychart.core.ui.Background
              value = value['fill']();
            }
            break;
          case goog.dom.InputType.DATE:
            value = window['anychart']['format']['dateTime'](value, 'yyyy-MM-dd');
            break;
          default:
            value = goog.isBoolean(value) ? value : String(value);
            break;
        }

        if (!goog.isFunction(value))
          goog.dom.forms.setValue(element, value);
      }
    }
    goog.events.listen(element, event, anychart.magic.onElementChange_, false, anychart.magic);

  } else if (goog.isString(opt_value)) {
    var elements = goog.dom.getElementsByClass(opt_value);
    anychart.magic.init(elements);

  } else if (goog.isArray(opt_value) || goog.dom.isNodeList(/** @type {Object} */(opt_value))) {
    for (var i = 0; i < opt_value.length; i++) {
      anychart.magic.init(opt_value[i]);
    }
  }
};


/**
 * Input's change event handler.
 * @param {Event} event
 * @return {null}
 * @private
 */
anychart.magic.onElementChange_ = function(event) {
  /** @type {!HTMLInputElement} */
  var element = event.target;
  var chartId = event.target.getAttribute('ac-chart-id');
  var key = event.target.getAttribute('ac-key');
  var trackingCharts = window['anychart']['getTrackingCharts']();

  if (chartId && trackingCharts[chartId] && key) {
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
        value = window['anychart']['format']['parseDateTime'](value, 'yyyy-MM-dd');
        break;
    }

    anychart.magic.set(trackingCharts[chartId], key, value);
  }
};


//exports
(function() {
  goog.exportSymbol('anychart.magic.get', anychart.magic.get);
  goog.exportSymbol('anychart.magic.set', anychart.magic.set);
  goog.exportSymbol('anychart.magic.init', anychart.magic.init);
})();
