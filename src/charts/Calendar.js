goog.provide('anychart.charts.Calendar');

goog.require('anychart'); // otherwise we can't use anychart.chartTypesMap object.
goog.require('anychart.core.SeparateChart');
goog.require('anychart.core.settings');
goog.require('anychart.format');



/**
 * AnyChart Calendar chart class.
 * @param {(anychart.data.View|anychart.data.Set|Array|string)=} opt_data Data for the chart.
 * @param {Object.<string, (string|boolean)>=} opt_csvSettings If CSV string is passed, you can pass CSV parser settings here as a hash map.
 * @extends {anychart.core.SeparateChart}
 * @implements {anychart.core.settings.IObjectWithSettings}
 * @constructor
 */
anychart.charts.Calendar = function(opt_data, opt_csvSettings) {
  anychart.charts.Calendar.base(this, 'constructor');

  /**
   * Settings storage.
   * @type {Object}
   */
  this.ownSettings = {};

  /**
   * Theme settings storage.
   * @type {Object}
   */
  this.themeSettings = {};

  this.data(opt_data || null, opt_csvSettings);
};
goog.inherits(anychart.charts.Calendar, anychart.core.SeparateChart);


//region --- STATES/SIGNALS ---
/**
 * Supported signals.
 * @type {number}
 */
anychart.charts.Calendar.prototype.SUPPORTED_SIGNALS =
    anychart.core.SeparateChart.prototype.SUPPORTED_SIGNALS |
    anychart.Signal.NEED_UPDATE_COLOR_RANGE;


/**
 * Supported consistency states.
 * @type {number}
 */
anychart.charts.Calendar.prototype.SUPPORTED_CONSISTENCY_STATES =
    anychart.core.SeparateChart.prototype.SUPPORTED_CONSISTENCY_STATES |
    anychart.ConsistencyState.APPEARANCE |
    anychart.ConsistencyState.CALENDAR_COLOR_SCALE |
    anychart.ConsistencyState.CALENDAR_COLOR_RANGE |
    anychart.ConsistencyState.CALENDAR_DATA;
//endregion


//region --- INHERITED API ---
/** @inheritDoc */
anychart.charts.Calendar.prototype.getType = function() {
  return anychart.enums.ChartTypes.CALENDAR;
};


/** @inheritDoc */
anychart.charts.Calendar.prototype.getAllSeries = function() {
  return [];
};


/** @inheritDoc */
anychart.charts.Calendar.prototype.createLegendItemsProvider = function() {
  return [];
};
//endregion


//region --- IObjectWithSettings ---
/** @inheritDoc */
anychart.charts.Calendar.prototype.getOwnOption = function(name) {
  return this.ownSettings[name];
};


/** @inheritDoc */
anychart.charts.Calendar.prototype.hasOwnOption = function(name) {
  return goog.isDef(this.ownSettings[name]);
};


/** @inheritDoc */
anychart.charts.Calendar.prototype.getThemeOption = function(name) {
  return this.themeSettings[name];
};


/** @inheritDoc */
anychart.charts.Calendar.prototype.getOption = function(name) {
  return goog.isDef(this.ownSettings[name]) ? this.ownSettings[name] : this.themeSettings[name];
};


/** @inheritDoc */
anychart.charts.Calendar.prototype.setOption = function(name, value) {
  this.ownSettings[name] = value;
};


/** @inheritDoc */
anychart.charts.Calendar.prototype.check = function(flags) {
  return true;
};
//endregion


//region --- PROPERTIES ---
/**
 * @type {!Object.<string, anychart.core.settings.PropertyDescriptor>}
 */
anychart.charts.Calendar.PROPERTY_DESCRIPTORS = (function() {
  var map = {};

  map[anychart.opt.START_MONTH] = {
    handler: anychart.enums.PropertyHandlerType.SINGLE_ARG,
    propName: anychart.opt.START_MONTH,
    normalizer: anychart.core.settings.numberOrStringNormalizer,
    consistency: 0,
    signal: anychart.Signal.NEEDS_REDRAW
  };

  map[anychart.opt.END_MONTH] = {
    handler: anychart.enums.PropertyHandlerType.SINGLE_ARG,
    propName: anychart.opt.END_MONTH,
    normalizer: anychart.core.settings.numberOrStringNormalizer,
    consistency: 0,
    signal: anychart.Signal.NEEDS_REDRAW
  };

  map[anychart.opt.WEEK_START] = {
    handler: anychart.enums.PropertyHandlerType.SINGLE_ARG,
    propName: anychart.opt.WEEK_START,
    normalizer: anychart.core.settings.numberNormalizer,
    consistency: 0,
    signal: anychart.Signal.NEEDS_REDRAW
  };

  map[anychart.opt.OUTLINE_COLOR] = {
    handler: anychart.enums.PropertyHandlerType.MULTI_ARG,
    propName: anychart.opt.OUTLINE_COLOR,
    normalizer: anychart.core.settings.strokeOrFunctionNormalizer,
    consistency: 0,
    signal: anychart.Signal.NEEDS_REDRAW
  };

  map[anychart.opt.UNUSED_OUTLINE_COLOR] = {
    handler: anychart.enums.PropertyHandlerType.MULTI_ARG,
    propName: anychart.opt.UNUSED_OUTLINE_COLOR,
    normalizer: anychart.core.settings.strokeOrFunctionNormalizer,
    consistency: 0,
    signal: anychart.Signal.NEEDS_REDRAW
  };

  map[anychart.opt.UNUSED_FILL] = {
    handler: anychart.enums.PropertyHandlerType.MULTI_ARG,
    propName: anychart.opt.UNUSED_FILL,
    normalizer: anychart.core.settings.fillOrFunctionNormalizer,
    consistency: 0,
    signal: anychart.Signal.NEEDS_REDRAW
  };

  map[anychart.opt.UNUSED_STROKE] = {
    handler: anychart.enums.PropertyHandlerType.MULTI_ARG,
    propName: anychart.opt.UNUSED_STROKE,
    normalizer: anychart.core.settings.strokeOrFunctionNormalizer,
    consistency: 0,
    signal: anychart.Signal.NEEDS_REDRAW
  };

  map[anychart.opt.YEAR] = {
    handler: anychart.enums.PropertyHandlerType.SINGLE_ARG,
    propName: anychart.opt.YEAR,
    normalizer: anychart.core.settings.asIsNormalizer,
    consistency: 0,
    signal: anychart.Signal.NEEDS_REDRAW
  };


  return map;
})();
anychart.core.settings.populate(anychart.charts.Calendar, anychart.charts.Calendar.PROPERTY_DESCRIPTORS);
//endregion


//region --- OWN API ---
/**
 * Prepares data.
 */
anychart.charts.Calendar.prototype.prepareData = function() {
  if (this.dataInternal)
    this.dataInternal.unlistenSignals(this.dataInvalidated_, this);
  goog.dispose(this.dataInternal);
  delete this.iterator_;
  this.dataInternal = this.parentView.filter(anychart.opt.X, function(xValue) {
    return !goog.isNull(anychart.format.parseDateTime(xValue));
  }).sort(anychart.opt.X, function(xValue1, xValue2) {
    return anychart.format.parseDateTime(xValue1).getTime() - anychart.format.parseDateTime(xValue2).getTime();
  });
  this.dataInternal.listenSignals(this.dataInvalidated_, this);
  this.invalidate(anychart.ConsistencyState.CALENDAR_DATA, anychart.Signal.NEEDS_RECALCULATION | anychart.Signal.NEEDS_REDRAW | anychart.Signal.DATA_CHANGED);
};


/**
 * Getter/setter for data.
 * @param {(anychart.data.View|anychart.data.Set|Array|string)=} opt_value Data for the chart.
 * @param {Object.<string, (string|boolean)>=} opt_csvSettings If CSV string is passed, you can pass CSV parser settings here as a hash map.
 * @return {(!anychart.charts.Calendar|!anychart.data.View)} Returns itself if used as a setter or the mapping if used as a getter.
 */
anychart.charts.Calendar.prototype.data = function(opt_value, opt_csvSettings) {
  if (goog.isDef(opt_value)) {
    if (this.rawData !== opt_value) {
      this.rawData = opt_value;
      goog.dispose(this.parentViewToDispose); // disposing a view created by the chart if any;
      if (opt_value instanceof anychart.data.View)
        this.parentView = this.parentViewToDispose = opt_value.derive(); // deriving a view to avoid interference with other view users
      else if (opt_value instanceof anychart.data.Set)
        this.parentView = this.parentViewToDispose = opt_value.mapAs();
      else
        this.parentView = (this.parentViewToDispose = new anychart.data.Set(
            (goog.isArray(opt_value) || goog.isString(opt_value)) ? opt_value : null, opt_csvSettings)).mapAs();
      this.prepareData();
    }
    return this;
  }
  return this.dataInternal;
};


/**
 * Listens to data invalidation.
 * @param {anychart.SignalEvent} e
 * @private
 */
anychart.charts.Calendar.prototype.dataInvalidated_ = function(e) {
  if (e.hasSignal(anychart.Signal.DATA_CHANGED)) {
    this.dispatchSignal(anychart.Signal.NEEDS_RECALCULATION | anychart.Signal.DATA_CHANGED);
  }
};


/**
 * Returns ATTACHED data iterator. Advancing this iterator also advances series iterator.
 * @return {!anychart.data.IIterator}
 */
anychart.charts.Calendar.prototype.getIterator = function() {
  return this.iterator || this.getResetIterator();
};


/**
 * Returns reset ATTACHED data iterator. Advancing this iterator also advances series iterator.
 * @return {!anychart.data.IIterator}
 */
anychart.charts.Calendar.prototype.getResetIterator = function() {
  return this.iterator = this.getDetachedIterator();
};


/**
 * @return {!anychart.data.IIterator}
 */
anychart.charts.Calendar.prototype.getDetachedIterator = function() {
  return this.data().getIterator();
};


/** @inheritDoc */
anychart.charts.Calendar.prototype.colorScale = function(opt_value) {
  //
};
//endregion


//region --- DRAWING ---
/** @inheritDoc */
anychart.charts.Calendar.prototype.calculate = function() {
  anychart.charts.Calendar.base(this, 'calculate');

  this.actualStartMonth_ = 0;
  this.actualEndMonth_ = 11;

  if (this.hasInvalidationState(anychart.ConsistencyState.CALENDAR_DATA)) {
    var iterator = this.getDetachedIterator();
    while (iterator.advance()) {
      console.log(iterator.get(anychart.opt.X), iterator.get(anychart.opt.VALUE));
    }
    this.markConsistent(anychart.ConsistencyState.CALENDAR_DATA);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.CALENDAR_COLOR_SCALE)) {
    /*var scale = this.colorScale();
    if (scale && scale.needsAutoCalc()) {
      scale.startAutoCalc();

      var iterator = this.getIterator();
      while (iterator.advance()) {
        scale.extendDataRange(iterator.get('value'));
      }

      scale.finishAutoCalc();
    }*/
    this.markConsistent(anychart.ConsistencyState.CALENDAR_COLOR_SCALE);
  }
};


/** @inheritDoc */
anychart.charts.Calendar.prototype.drawContent = function(bounds) {
  if (this.isConsistent())
    return;

  this.calculate();

  if (!this.rootLayer) {
    this.rootLayer = this.rootElement.layer();
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.BOUNDS)) {
    this.markConsistent(anychart.ConsistencyState.BOUNDS);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.APPEARANCE)) {
    this.markConsistent(anychart.ConsistencyState.APPEARANCE);
  }
};
//endregion


//region --- SETUP/DISPOSE ---
/** @inheritDoc */
anychart.charts.Calendar.prototype.serialize = function() {
  var json = anychart.charts.Calendar.base(this, 'serialize');
  json['type'] = this.getType();
  anychart.core.settings.serialize(this, anychart.charts.Calendar.PROPERTY_DESCRIPTORS, json);

  return {'chart': json};
};


/** @inheritDoc */
anychart.charts.Calendar.prototype.setupByJSON = function(config, opt_default) {
  anychart.charts.Calendar.base(this, 'setupByJSON', config);
  anychart.core.settings.deserialize(this, anychart.charts.Calendar.PROPERTY_DESCRIPTORS, config);
};


/** @inheritDoc */
anychart.charts.Calendar.prototype.disposeInternal = function() {
  goog.disposeAll(this.parentViewToDispose, this.parentView, this.dataInternal);
  anychart.charts.Calendar.base(this, 'disposeInternal');
};
//endregion

//exports
//anychart.charts.Calendar.prototype['startMonth'] = anychart.charts.Calendar.prototype.startMonth;
//anychart.charts.Calendar.prototype['endMonth'] = anychart.charts.Calendar.prototype.endMonth;
//anychart.charts.Calendar.prototype['weekStart'] = anychart.charts.Calendar.prototype.weekStart;
//anychart.charts.Calendar.prototype['outlineColor'] = anychart.charts.Calendar.prototype.outlineColor;
//anychart.charts.Calendar.prototype['unusedOutlineColor'] = anychart.charts.Calendar.prototype.unusedOutlineColor;
//anychart.charts.Calendar.prototype['unusedFill'] = anychart.charts.Calendar.prototype.unusedFill;
//anychart.charts.Calendar.prototype['unusedStroke'] = anychart.charts.Calendar.prototype.unusedStroke;
