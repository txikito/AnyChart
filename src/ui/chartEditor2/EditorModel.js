goog.provide('anychart.ui.chartEditor2.EditorModel');

goog.require('goog.events.EventTarget');


/**
 *
 * @constructor
 * @extends {goog.events.EventTarget}
 */
anychart.ui.anychart.ui.chartEditor2.EditorModel = function() {
  goog.base(this);

  this.inputs_ = {
    /**
     * Format:
      // category = 'chart'
      'chart': [
        // group = 0
        {
          // key = 'type', value = 'line'
          'type': 'line'
        }
      ],
      // category = 'series'
      'series': [
        // group = 0
        {
          // key = 'type', value = 'ohlc'
          'type': 'ohlc',

          // key = 'open', value = 'field0'
          'open': 'field0',

          // so on...
          'high': 'field1',
          'low': 'field2',
          'close': 'field3'
        }
      ],
     ...
     */
    'chart': [
      {'type': null}
    ],
    'plot': [
      {
        'setId': null,
        'xValue': null
      }
    ],
    'series': [
      {
        'type': null,
        'xValue': null
      }
    ]
  };
};
goog.inherits(anychart.ui.chartEditor2.EditorModel, goog.events.EventTarget);


/**
 * Setter for input's state
 * @param {String} category
 * @param {String} key
 * @param {String} value
 * @param {?number} opt_group Default is 0
 */
anychart.ui.anychart.ui.chartEditor2.EditorModel.prototype.setInput = function(category, key, value, opt_group) {
  var group = goog.isDef(opt_group) ? opt_group : 0;
  if (this.inputs_[category].length <= group) {
    if (this.inputs_[category].length == group) {
      this.inputs_[category].push({});
    }
    this.inputs_[category][group][key] = value;
  } else {
    console.warn('Bad group! EditorModel.setInput(\'', category, key, value, opt_group, '\'');
  }
};


/**
 * Getter for input's value
 * @param {String} category
 * @param {String} key
 * @param {?number} opt_group Default is 0
 * @return {String} Input's value
 */
anychart.ui.anychart.ui.chartEditor2.EditorModel.prototype.getInput = function(category, key, opt_group) {
  return this.inputs_[category][goog.isDef(opt_group) ? opt_group : 0][key];
};


/**
 * @param {String} category
 * @param {number} group
 */
anychart.ui.anychart.ui.chartEditor2.EditorModel.prototype.removeInputsGroup = function(category, group) {
  goog.array.splice(this.inputs_[category], group, 1);
};
