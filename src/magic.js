goog.provide('anychart.magic');


/**
 @namespace
 @name anychart.magic
 */

/**
 * @param {?Object} target
 * @param {string} path
 * @param {string} var_args
 * @return {*}
 */
anychart.magic.get = function(target, path, var_args) {
  if (!target) target = window;

  var pathParts = this._parsePath(path);
  if (pathParts) {
    var part;
    var name;
    var call;
    var args;

    for (var i = 0; i < pathParts.length; i++) {
      part = pathParts[i];
      name = part[0];
      call = part[1];
      args = part[2];

      if (args) {
        for (var j = 0; j < args.length; j++) {
          args[j] = args[j].replace(/['"](.*)['"]/, '$1');
          var substMatch = args[j].match(/^\{(\d+)\}$/);
          if (substMatch) {
            var a = Number(substMatch[1]) + 2;
            args[j] = arguments[a] ? arguments[a] : void 0;
          }
        }
      }

      // console.log(args);
      //debugger;

      target = call ? target[name].apply(target, args) : target[name];
    }
  }

  return target;
};


anychart.magic.set = function(value, opt_default) {

};

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


//exports
goog.exportSymbol('anychart.magic.get', anychart.magic.get);
goog.exportSymbol('anychart.magic.set', anychart.magic.set);
