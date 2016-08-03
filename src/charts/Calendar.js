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
    anychart.ConsistencyState.APPEARANCE |
    anychart.ConsistencyState.CALENDAR_COLOR_SCALE |
    anychart.ConsistencyState.CALENDAR_COLOR_RANGE;
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


//region --- OWN API ---
/**
 * Prepares data.
 */
anychart.charts.Calendar.prototype.prepareData = function() {
  goog.dispose(this.data_);
  delete this.iterator_;
  this.data_ = this.parentView_.sort('x', function(x1, x2) {
    return anychart.utils.normalizeTimestamp(x1) - anychart.utils.normalizeTimestamp(x2);
  });
  this.data_.listenSignals(this.dataInvalidated_, this);

  this.invalidate(anychart.ConsistencyState.APPEARANCE, anychart.Signal.NEEDS_REDRAW | anychart.Signal.NEEDS_RECALCULATION);
};


/**
 * Getter/setter for calendar data.
 * @param {?(anychart.data.View|anychart.data.Set|Array|string)=} opt_value Value to set.
 * @param {Object.<string, (string|boolean)>=} opt_csvSettings If CSV string is passed, you can pass CSV parser settings here as a hash map.
 * @return {(!anychart.charts.Calendar|!anychart.data.View)} Returns itself if used as a setter or the mapping if used as a getter.
 */
anychart.charts.Calendar.prototype.data = function(opt_value, opt_csvSettings) {
  if (goog.isDef(opt_value)) {
    if (this.rawData_ !== opt_value) {
      this.rawData_ = opt_value;
      goog.dispose(this.parentViewToDispose_);
      this.iterator_ = null;
      if (opt_value instanceof anychart.data.View)
        this.parentView_ = this.parentViewToDispose_ = opt_value.derive();
      else if (opt_value instanceof anychart.data.Set)
        this.parentView_ = this.parentViewToDispose_ = opt_value.mapAs();
      else
        this.parentView_ = (this.parentViewToDispose_ = new anychart.data.Set(
            (goog.isArray(opt_value) || goog.isString(opt_value)) ? opt_value : null, opt_csvSettings)).mapAs();
      this.prepareData();
    }

    return this;
  }
  return this.data_;
};


/**
 * Data invalidation handler.
 * @param {anychart.SignalEvent} e
 * @private
 */
anychart.charts.Calendar.prototype.dataInvalidated_ = function(e) {
  if (e.hasSignal(anychart.Signal.DATA_CHANGED)) {
    this.invalidate(anychart.ConsistencyState.APPEARANCE, anychart.Signal.NEEDS_REDRAW);
  }
};


/**
 * Returns current iterator.
 * @return {!anychart.data.Iterator}
 */
anychart.charts.Calendar.prototype.getIterator = function() {
  return this.iterator_ || this.getResetIterator();
};


/**
 * Returns reset iterator.
 * @return {!anychart.data.Iterator}
 */
anychart.charts.Calendar.prototype.getResetIterator = function() {
  return (this.iterator_ = this.data_.getIterator());
};


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


/**
 * Getter/setter for startMonth.
 * @param {number|string=} opt_value startMonth.
 * @return {number|string|anychart.charts.Calendar} startMonth or self for chaining.
 */
anychart.charts.Calendar.prototype.startMonth = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.startMonth_ != opt_value) {
      this.startMonth_ = opt_value;
      this.invalidate(anychart.ConsistencyState.APPEARANCE, anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  }
  return this.startMonth_;
};


/**
 * Getter/setter for endMonth.
 * @param {number|string=} opt_value endMonth.
 * @return {number|string|anychart.charts.Calendar} endMonth or self for chaining.
 */
anychart.charts.Calendar.prototype.endMonth = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.endMonth_ != opt_value) {
      this.endMonth_ = opt_value;
      this.invalidate(anychart.ConsistencyState.APPEARANCE, anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  }
  return this.endMonth_;
};


/**
 * Getter/setter for year.
 * @param {string=} opt_value year.
 * @return {string|anychart.charts.Calendar} year or self for chaining.
 */
anychart.charts.Calendar.prototype.year = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.year_ != opt_value) {
      this.year_ = opt_value;
      this.invalidate(anychart.ConsistencyState.APPEARANCE, anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  }
  return this.year_;
};


/**
 * Getter/setter for weekStart.
 * @param {number=} opt_value weekStart.
 * @return {number|anychart.charts.Calendar} weekStart or self for chaining.
 */
anychart.charts.Calendar.prototype.weekStart = function(opt_value) {
  if (goog.isDef(opt_value)) {
    opt_value = goog.math.clamp(anychart.utils.normalizeToNaturalNumber(opt_value, 1, true), 0, 6);
    if (this.weekStart_ != opt_value) {
      this.weekStart_ = opt_value;
      this.invalidate(anychart.ConsistencyState.APPEARANCE, anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  }
  return this.weekStart_;
};


/**
 * Calendar outline month stroke (stroke for month with data).
 * @param {(acgraph.vector.Stroke|acgraph.vector.ColoredFill|Function|string|null)=} opt_strokeOrFill Fill settings
 *    or stroke settings.
 * @param {number=} opt_thickness [1] Line thickness.
 * @param {string=} opt_dashpattern Controls the pattern of dashes and gaps used to stroke paths.
 * @param {acgraph.vector.StrokeLineJoin=} opt_lineJoin Line joint style.
 * @param {acgraph.vector.StrokeLineCap=} opt_lineCap Line cap style.
 * @return {(!anychart.charts.Calendar|acgraph.vector.Stroke|Function)} .
 */
anychart.charts.Calendar.prototype.outlineColor = function(opt_strokeOrFill, opt_thickness, opt_dashpattern, opt_lineJoin, opt_lineCap) {
  if (goog.isDef(opt_strokeOrFill)) {
    var stroke = goog.isFunction(opt_strokeOrFill) ?
        opt_strokeOrFill :
        acgraph.vector.normalizeStroke.apply(null, arguments);
    if (stroke != this.outlineColor_) {
      this.outlineColor_ = stroke;
      this.invalidate(anychart.ConsistencyState.APPEARANCE, anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  }
  return this.outlineColor_;
};


/**
 * Calendar hover outline month stroke (stroke for month with data).
 * @param {(acgraph.vector.Stroke|acgraph.vector.ColoredFill|Function|string|null)=} opt_strokeOrFill Fill settings
 *    or stroke settings.
 * @param {number=} opt_thickness [1] Line thickness.
 * @param {string=} opt_dashpattern Controls the pattern of dashes and gaps used to stroke paths.
 * @param {acgraph.vector.StrokeLineJoin=} opt_lineJoin Line joint style.
 * @param {acgraph.vector.StrokeLineCap=} opt_lineCap Line cap style.
 * @return {(!anychart.charts.Calendar|acgraph.vector.Stroke|Function)} .
 */
anychart.charts.Calendar.prototype.hoverOutlineColor = function(opt_strokeOrFill, opt_thickness, opt_dashpattern, opt_lineJoin, opt_lineCap) {
  if (goog.isDef(opt_strokeOrFill)) {
    this.hoverOutlineColor_ = goog.isFunction(opt_strokeOrFill) ?
        opt_strokeOrFill :
        acgraph.vector.normalizeStroke.apply(null, arguments);
    return this;
  }
  return this.hoverOutlineColor_;
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
anychart.charts.Calendar.prototype.calculate = function() {
  anychart.charts.Calendar.base(this, 'calculate');

  if (this.hasInvalidationState(anychart.ConsistencyState.CALENDAR_COLOR_SCALE)) {
    var scale = this.colorScale();
    if (scale && scale.needsAutoCalc()) {
      scale.startAutoCalc();

      var iterator = this.getIterator();
      while (iterator.advance()) {
        scale.extendDataRange(iterator.get('value'));
      }

      scale.finishAutoCalc();
    }
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
    //
    this.markConsistent(anychart.ConsistencyState.BOUNDS);
  }

  var weekStart, startMonth, endMonth;
  var iterator = this.getIterator();
  if (this.hasInvalidationState(anychart.ConsistencyState.APPEARANCE)) {
    while (iterator.advance()) {
      console.log(iterator.get('x'), iterator.get('value'));
    }



    this.markConsistent(anychart.ConsistencyState.APPEARANCE);
  }
};
//endregion


//region --- SETUP/DISPOSE ---
/** @inheritDoc */
anychart.charts.Calendar.prototype.serialize = function() {
  var json = anychart.charts.Calendar.base(this, 'serialize');
  json['type'] = this.getType();
  json['data'] = this.data().serialize();

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
  goog.dispose(this.rootLayer);
  goog.dispose(this.parentViewToDispose_);
  anychart.charts.Calendar.base(this, 'disposeInternal');
};
//endregion

//exports
