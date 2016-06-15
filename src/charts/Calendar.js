goog.provide('anychart.charts.Calendar');

goog.require('anychart'); // otherwise we can't use anychart.chartTypesMap object.
goog.require('anychart.core.SeparateChart');
goog.require('anychart.core.ui.ColorRange');



/**
 * AnyChart Calendar chart class.
 * @param {(anychart.data.View|anychart.data.Set|Array|string)=} opt_data Data for the chart.
 * @param {Object.<string, (string|boolean)>=} opt_csvSettings If CSV string is passed, you can pass CSV parser settings here as a hash map.
 * @extends {anychart.core.SeparateChart}
 * @constructor
 */
anychart.charts.Calendar = function(opt_data, opt_csvSettings) {
  anychart.charts.Calendar.base(this, 'constructor');

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
    anychart.ConsistencyState.CALENDAR_COLOR_SCALE |
    anychart.ConsistencyState.CALENDAR_COLOR_RANGE;
//endregion


/**
 * Getter/setter data.
 * @param {(anychart.data.View|anychart.data.Set|Array|string)=} opt_data Data for the chart.
 * @param {Object.<string, (string|boolean)>=} opt_csvSettings If CSV string is passed, you can pass CSV parser settings here as a hash map.
 */
anychart.charts.Calendar.prototype.data = function(opt_data, opt_csvSettings) {
  //
};


//region --- INHERITED API ---
/** @inheritDoc */
anychart.charts.Calendar.prototype.getAllSeries = function() {
  return [];
};


/** @inheritDoc */
anychart.charts.Calendar.prototype.createLegendItemsProvider = function() {
  return [];
};
//endregion


//region --- OWN API ---
/**
 * Color scale.
 * @param {(anychart.scales.LinearColor|anychart.scales.OrdinalColor)=} opt_value Scale to set.
 * @return {anychart.scales.OrdinalColor|anychart.scales.LinearColor|anychart.charts.Calendar} Default chart color scale value or itself for
 * method chaining.
 */
anychart.charts.Calendar.prototype.colorScale = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.colorScale_ != opt_value) {
      if (this.colorScale_)
        this.colorScale_.unlistenSignals(this.colorScaleInvalidated_, this);
      this.colorScale_ = opt_value;
      if (this.colorScale_)
        this.colorScale_.listenSignals(this.colorScaleInvalidated_, this);

      this.invalidate(anychart.ConsistencyState.CALENDAR_COLOR_SCALE,
          anychart.Signal.NEEDS_REDRAW | anychart.Signal.NEED_UPDATE_COLOR_RANGE);
    }
    return this;
  }
  return this.colorScale_;
};


/**
 * Chart scale invalidation handler.
 * @param {anychart.SignalEvent} event Event.
 * @private
 */
anychart.charts.Calendar.prototype.colorScaleInvalidated_ = function(event) {
  if (event.hasSignal(anychart.Signal.NEEDS_RECALCULATION | anychart.Signal.NEEDS_REAPPLICATION)) {
    this.invalidate(anychart.ConsistencyState.CALENDAR_COLOR_SCALE,
        anychart.Signal.NEEDS_REDRAW | anychart.Signal.NEED_UPDATE_COLOR_RANGE);
  }
};


/**
 * Getter/setter for color range.
 * @param {Object=} opt_value Color range settings to set.
 * @return {!(anychart.core.ui.ColorRange|anychart.charts.Calendar)} Color range or self for chaining.
 */
anychart.charts.Calendar.prototype.colorRange = function(opt_value) {
  if (!this.colorRange_) {
    this.colorRange_ = new anychart.core.ui.ColorRange();
    this.colorRange_.listenSignals(this.colorRangeInvalidated_, this);
    this.invalidate(anychart.ConsistencyState.CALENDAR_COLOR_RANGE | anychart.ConsistencyState.BOUNDS,
        anychart.Signal.NEEDS_REDRAW);
  }

  if (goog.isDef(opt_value)) {
    this.colorRange_.setup(opt_value);
    return this;
  } else {
    return this.colorRange_;
  }
};


/**
 * Internal marker palette invalidation handler.
 * @param {anychart.SignalEvent} event Event object.
 * @private
 */
anychart.charts.Calendar.prototype.colorRangeInvalidated_ = function(event) {
  var state = 0;
  var signal = 0;
  if (event.hasSignal(anychart.Signal.NEEDS_REDRAW)) {
    state |= anychart.ConsistencyState.CALENDAR_COLOR_RANGE |
        anychart.ConsistencyState.APPEARANCE;
    signal |= anychart.Signal.NEEDS_REDRAW;
  }
  if (event.hasSignal(anychart.Signal.BOUNDS_CHANGED)) {
    state |= anychart.ConsistencyState.BOUNDS;
    signal |= anychart.Signal.BOUNDS_CHANGED;
  }
  // if there are no signals, state == 0 and nothing happens.
  this.invalidate(state, signal);
};
//endregion


//region --- FACTORIES ---
anychart.charts.Calendar.prototype.labels = function() {};
anychart.charts.Calendar.prototype.hoverLabels = function() {};
anychart.charts.Calendar.prototype.selectLabels = function() {};
anychart.charts.Calendar.prototype.markers = function() {};
anychart.charts.Calendar.prototype.hoverMarkers = function() {};
anychart.charts.Calendar.prototype.selectMarkers = function() {};
//endregion


//region --- DRAWING ---
/** @inheritDoc */
anychart.charts.Calendar.prototype.drawContent = function(bounds) {
  if (this.isConsistent())
    return;

  if (this.hasInvalidationState(anychart.ConsistencyState.APPEARANCE)) {
    this.markConsistent(anychart.ConsistencyState.APPEARANCE);
  }
};
//endregion


//region --- SETUP/DISPOSE ---
/** @inheritDoc */
anychart.charts.Calendar.prototype.serialize = function() {
  var json = anychart.charts.Calendar.base(this, 'serialize');

  json['colorScale'] = this.colorScale().serialize();
  json['colorRange'] = this.colorRange().serialize();

  return json;
};


/** @inheritDoc */
anychart.charts.Calendar.prototype.setupByJSON = function(config) {
  anychart.charts.Calendar.base(this, 'setupByJSON', config);

  if ('colorScale' in config) {
    var json = config['colorScale'];
    var scale = null;
    if (goog.isString(json)) {
      scale = anychart.scales.Base.fromString(json, null);
    } else if (goog.isObject(json)) {
      scale = anychart.scales.Base.fromString(json['type'], null);
      if (scale)
        scale.setup(json);
    }
    if (scale)
      this.colorScale(/** @type {anychart.scales.LinearColor|anychart.scales.OrdinalColor} */ (scale));
  }

  if ('colorRange' in config)
    this.colorRange(config['colorRange']);
};


/** @inheritDoc */
anychart.charts.Calendar.prototype.disposeInternal = function() {
  anychart.charts.Calendar.base(this, 'disposeInternal');
};
//endregion

//exports
