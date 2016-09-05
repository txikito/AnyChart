//region --- Requiring and Providing
goog.provide('anychart.core.axes.MapSettings');
//endregion



/**
 * Map axes settings.
 * @param {!anychart.charts.Map} map .
 * @extends {goog.Disposable}
 * @constructor
 */
anychart.core.axes.MapSettings = function(map) {
  /**
   * Map.
   * @private
   * @type {anychart.charts.Map}
   */
  this.map_ = map;

  /**
   * All axes.
   * @private
   * @type {Array.<anychart.core.axes.Map>}
   */
  this.axes_ = [];
};
goog.inherits(anychart.core.axes.MapSettings, goog.Disposable);


//region --- Axes
/**
 * Return all exist axes.
 * @return {Array.<anychart.core.axes.Map>}
 */
anychart.core.axes.MapSettings.prototype.getAxes = function() {
  return this.axes_;
};


anychart.core.axes.MapSettings.prototype.top = function(opt_value) {
  if (!this.topAxis_) {
    this.topAxis_ = new anychart.core.axes.Map();
    this.topAxis_.orientation(anychart.enums.Orientation.TOP);
    this.topAxis_.listenSignals(this.mapInvalidated_, this.map_);
    this.axes_.push(this.topAxis_);
    this.map_.registerDisposable(this.topAxis_);
  }

  if (goog.isDef(opt_value)) {
    this.topAxis_.setup(opt_value);
    return this;
  }
  return this.topAxis_;
};


anychart.core.axes.MapSettings.prototype.right = function(opt_value) {
  if (!this.rightAxis_) {
    this.rightAxis_ = new anychart.core.axes.Map();
    this.rightAxis_.orientation(anychart.enums.Orientation.RIGHT);
    this.rightAxis_.listenSignals(this.mapInvalidated_, this.map_);
    this.axes_.push(this.rightAxis_);
    this.map_.registerDisposable(this.rightAxis_);
  }

  if (goog.isDef(opt_value)) {
    this.rightAxis_.setup(opt_value);
    return this;
  }
  return this.rightAxis_;
};


anychart.core.axes.MapSettings.prototype.bottom = function(opt_value) {
  if (!this.bottomAxis_) {
    this.bottomAxis_ = new anychart.core.axes.Map();
    this.bottomAxis_.orientation(anychart.enums.Orientation.BOTTOM);
    this.bottomAxis_.listenSignals(this.mapInvalidated_, this.map_);
    this.axes_.push(this.bottomAxis_);
    this.map_.registerDisposable(this.bottomAxis_);
  }

  if (goog.isDef(opt_value)) {
    this.bottomAxis_.setup(opt_value);
    return this;
  }
  return this.bottomAxis_;
};


anychart.core.axes.MapSettings.prototype.left = function(opt_value) {
  if (!this.leftAxis_) {
    this.leftAxis_ = new anychart.core.axes.Map();
    this.leftAxis_.orientation(anychart.enums.Orientation.LEFT);
    this.leftAxis_.listenSignals(this.mapInvalidated_, this.map_);
    this.axes_.push(this.leftAxis_);
    this.map_.registerDisposable(this.leftAxis_);
  }

  if (goog.isDef(opt_value)) {
    this.leftAxis_.setup(opt_value);
    return this;
  }
  return this.leftAxis_;
};


anychart.core.axes.MapSettings.prototype.mapInvalidated_ = function(event) {
  this.invalidate(anychart.ConsistencyState.MAP_AXES, anychart.Signal.NEEDS_REDRAW);
};


//endregion
//region --- Common settings
/**
 * Sets enable/disable state for all axes.
 * @param {boolean=} opt_value .
 * @return {anychart.core.axes.MapSettings|boolean}
 */
anychart.core.axes.MapSettings.prototype.enabled = function(opt_value) {
  if (goog.isDef(opt_value)) {
    opt_value = !!opt_value;
    if (this.enabled_ != opt_value) {
      this.enabled_ = opt_value;
      for (var i = 0, len = this.axes_.length; i < len; i++) {
        var axis = this.axes_[i];
        axis.enabled(this.enabled_);
      }
    }
    return this;
  }
  return this.enabled_;
};


/**
 * Getter/setter for title.
 * @param {(null|boolean|Object|string)=} opt_value Axis title.
 * @return {!(anychart.core.ui.Title|anychart.core.axes.MapSettings)} Axis title or itself for method chaining.
 */
anychart.core.axes.MapSettings.prototype.title = function(opt_value) {
  if (!this.title_) {
    this.title_ = new anychart.core.ui.Title();
    this.title_.listenSignals(this.titleInvalidated_, this);
    this.registerDisposable(this.title_);
  }

  if (goog.isDef(opt_value)) {
    this.title_.setup(opt_value);
    return this;
  }
  return this.title_;
};


/**
 * Internal title invalidation handler.
 * @param {anychart.SignalEvent} event Event object.
 * @private
 */
anychart.core.axes.MapSettings.prototype.titleInvalidated_ = function(event) {
  // var state = 0;
  // var signal = 0;
  // if (event.hasSignal(anychart.Signal.BOUNDS_CHANGED)) {
  //   state = this.ALL_VISUAL_STATES;
  //   signal = anychart.Signal.BOUNDS_CHANGED | anychart.Signal.NEEDS_REDRAW;
  // } else if (event.hasSignal(anychart.Signal.NEEDS_REDRAW)) {
  //   state = anychart.ConsistencyState.AXIS_TITLE;
  //   signal = anychart.Signal.NEEDS_REDRAW;
  // }
  // this.invalidate(state, signal);
};


/**
 * Getter/setter for labels.
 * @param {(Object|boolean|null)=} opt_value Axis labels.
 * @return {!(anychart.core.ui.LabelsFactory|anychart.core.axes.MapSettings)} Axis labels of itself for method chaining.
 */
anychart.core.axes.MapSettings.prototype.labels = function(opt_value) {
  if (!this.labels_) {
    this.labels_ = new anychart.core.ui.LabelsFactory();
    this.labels_.listenSignals(this.labelsInvalidated_, this);
    this.registerDisposable(this.labels_);
  }

  if (goog.isDef(opt_value)) {
    if (goog.isObject(opt_value) && !('enabled' in opt_value))
      opt_value['enabled'] = true;
    this.labels_.setup(opt_value);
    return this;
  }
  return this.labels_;
};


/**
 * Internal label invalidation handler.
 * @param {anychart.SignalEvent} event Event object.
 * @private
 */
anychart.core.axes.MapSettings.prototype.labelsInvalidated_ = function(event) {
  // var state = 0;
  // var signal = 0;
  // if (event.hasSignal(anychart.Signal.BOUNDS_CHANGED)) {
  //   state = this.ALL_VISUAL_STATES;
  //   signal = anychart.Signal.BOUNDS_CHANGED | anychart.Signal.NEEDS_REDRAW;
  // } else if (event.hasSignal(anychart.Signal.NEEDS_REDRAW)) {
  //   state = anychart.ConsistencyState.AXIS_LABELS | anychart.ConsistencyState.AXIS_TICKS;
  //   signal = anychart.Signal.NEEDS_REDRAW;
  // }
  // this.dropStaggeredLabelsCache_();
  // this.dropBoundsCache();
  // this.invalidate(state, signal);
};


/**
 * Getter/setter for minorLabels.
 * @param {(Object|boolean|null)=} opt_value Axis labels.
 * @return {!(anychart.core.ui.LabelsFactory|anychart.core.axes.MapSettings)} Axis labels of itself for method chaining.
 */
anychart.core.axes.MapSettings.prototype.minorLabels = function(opt_value) {
  if (!this.minorLabels_) {
    this.minorLabels_ = new anychart.core.ui.LabelsFactory();
    this.minorLabels_.listenSignals(this.minorLabelsInvalidated_, this);
    this.registerDisposable(this.minorLabels_);
  }

  if (goog.isDef(opt_value)) {
    if (goog.isObject(opt_value) && !('enabled' in opt_value))
      opt_value['enabled'] = true;
    this.minorLabels_.setup(opt_value);
    return this;
  }
  return this.minorLabels_;
};


/**
 * Internal minor label invalidation handler.
 * @param {anychart.SignalEvent} event Event object.
 * @private
 */
anychart.core.axes.MapSettings.prototype.minorLabelsInvalidated_ = function(event) {
  // var state = 0;
  // var signal = 0;
  // if (event.hasSignal(anychart.Signal.BOUNDS_CHANGED)) {
  //   state = this.ALL_VISUAL_STATES;
  //   signal = anychart.Signal.BOUNDS_CHANGED | anychart.Signal.NEEDS_REDRAW;
  // } else if (event.hasSignal(anychart.Signal.NEEDS_REDRAW)) {
  //   state = anychart.ConsistencyState.AXIS_LABELS;
  //   signal = anychart.Signal.NEEDS_REDRAW;
  // }
  // this.dropBoundsCache();
  // this.invalidate(state, signal);
};


/**
 * Getter/setter for ticks.
 * @param {(Object|boolean|null)=} opt_value Axis ticks.
 * @return {!(anychart.core.axes.MapTicks|anychart.core.axes.MapSettings)} Axis ticks or itself for method chaining.
 */
anychart.core.axes.MapSettings.prototype.ticks = function(opt_value) {
  if (!this.ticks_) {
    this.ticks_ = new anychart.core.axes.MapTicks();
    this.ticks_.listenSignals(this.ticksInvalidated_, this);
    this.registerDisposable(this.ticks_);
  }

  if (goog.isDef(opt_value)) {
    this.ticks_.setup(opt_value);
    return this;
  }
  return this.ticks_;
};


/**
 * Getter/setter for minorTicks.
 * @param {(Object|boolean|null)=} opt_value Axis ticks.
 * @return {!(anychart.core.axes.MapTicks|anychart.core.axes.MapSettings)} Axis ticks or itself for method chaining.
 */
anychart.core.axes.MapSettings.prototype.minorTicks = function(opt_value) {
  if (!this.minorTicks_) {
    this.minorTicks_ = new anychart.core.axes.MapTicks();
    this.minorTicks_.listenSignals(this.ticksInvalidated_, this);
    this.registerDisposable(this.minorTicks_);
  }

  if (goog.isDef(opt_value)) {
    this.minorTicks_.setup(opt_value);
    return this;
  }
  return this.minorTicks_;
};


/**
 * Internal ticks invalidation handler.
 * @param {anychart.SignalEvent} event Event object.
 * @private
 */
anychart.core.axes.MapSettings.prototype.ticksInvalidated_ = function(event) {
  // var state = 0;
  // var signal = 0;
  // if (event.hasSignal(anychart.Signal.BOUNDS_CHANGED)) {
  //   state = this.ALL_VISUAL_STATES;
  //   signal = anychart.Signal.BOUNDS_CHANGED | anychart.Signal.NEEDS_REDRAW;
  // } else if (event.hasSignal(anychart.Signal.NEEDS_REDRAW)) {
  //   state = anychart.ConsistencyState.AXIS_TICKS;
  //   signal = anychart.Signal.NEEDS_REDRAW;
  // }
  // this.invalidate(state, signal);
};


/**
 * Getter/setter for stroke.
 * @param {(acgraph.vector.Stroke|acgraph.vector.ColoredFill|string|null)=} opt_strokeOrFill Fill settings
 *    or stroke settings.
 * @param {number=} opt_thickness [1] Line thickness.
 * @param {string=} opt_dashpattern Controls the pattern of dashes and gaps used to stroke paths.
 * @param {acgraph.vector.StrokeLineJoin=} opt_lineJoin Line joint style.
 * @param {acgraph.vector.StrokeLineCap=} opt_lineCap Line cap style.
 * @return {!(anychart.core.axes.MapSettings|acgraph.vector.Stroke)} .
 */
anychart.core.axes.MapSettings.prototype.stroke = function(opt_strokeOrFill, opt_thickness, opt_dashpattern, opt_lineJoin, opt_lineCap) {
  if (goog.isDef(opt_strokeOrFill)) {
    opt_strokeOrFill = acgraph.vector.normalizeStroke.apply(null, arguments);
    if (this.stroke_ != opt_strokeOrFill) {
      var thicknessOld = goog.isObject(this.stroke_) ? this.stroke_['thickness'] || 1 : 1;
      var thicknessNew = goog.isObject(opt_strokeOrFill) ? opt_strokeOrFill['thickness'] || 1 : 1;
      this.stroke_ = opt_strokeOrFill;
      if (thicknessNew == thicknessOld)
        this.invalidate(anychart.ConsistencyState.APPEARANCE, anychart.Signal.NEEDS_REDRAW);
      else
        this.invalidate(this.ALL_VISUAL_STATES, anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    }
    return this;
  } else {
    return this.stroke_;
  }
};


//endregion
//region --- Setup and Dispose
/**
 * Special objects to setup current instance.
 * @param {...(Object|Array|number|string|undefined|boolean|null)} var_args
 * @return {boolean} If passed values were recognized as special setup values.
 * @protected
 */
anychart.core.axes.MapSettings.prototype.setupSpecial = function(var_args) {
  var arg0 = arguments[0];
  if (goog.isBoolean(arg0) || goog.isNull(arg0)) {
    this.enabled(!!arg0);
    return true;
  }
  return false;
};


/**
 * Setups the element using passed configuration value. It can be a JSON object or a special value that setups
 * instances of descendant classes.
 * Note: this method only changes element properties if they are supposed to be changed by the config value -
 * it doesn't reset other properties to their defaults.
 * @param {...(Object|Array|number|string|undefined|boolean|null)} var_args Arguments to setup the instance.
 * @return {anychart.core.axes.MapSettings} Returns itself for chaining.
 */
anychart.core.axes.MapSettings.prototype.setup = function(var_args) {
  var arg0 = arguments[0];
  if (goog.isDef(arg0)) {
    if (!this.setupSpecial.apply(this, arguments) && goog.isObject(arg0)) {
      //if (arg0 instanceof anychart.core.Base)
      //  throw 'Instance of object is passed to setter. You should use JSON instead';
      this.setupByJSON(/** @type {!Object} */(arguments[0]));
    }
  }
  return this;
};


/** @inheritDoc */
anychart.core.axes.MapSettings.prototype.setupByJSON = function(config) {
  this.enabled(config['enabled']);
  this.title(config['title']);
  this.stroke(config['stroke']);
  this.ticks(config['ticks']);
  this.minorTicks(config['minorTicks']);
  this.labels().setup(config['labels']);
  this.minorLabels().setup(config['minorLabels']);
  if (config['left']) {
    this.left(config['left']);
  }
  if (config['top']) {
    this.top(config['top']);
  }
  if (config['right']) {
    this.right(config['right']);
  }
  if (config['bottom']) {
    this.bottom(config['bottom']);
  }
};


/** @inheritDoc */
anychart.core.axes.MapSettings.prototype.serialize = function() {
  var json = {};

  if (this.leftAxis_) {
    json['left'] = this.leftAxis_.serialize();
  }
  if (this.topAxis_) {
    json['top'] = this.topAxis_.serialize();
  }
  if (this.rightAxis_) {
    json['right'] = this.rightAxis_.serialize();
  }
  if (this.bottomAxis_) {
    json['bottom'] = this.bottomAxis_.serialize();
  }
  json['enabled'] = this.enabled();
  json['title'] = this.title_.serialize();
  json['stroke'] = anychart.color.serialize(/** @type {acgraph.vector.Stroke} */(this.stroke()));
  json['ticks'] = this.ticks().serialize();
  json['minorTicks'] = this.minorTicks().serialize();
  json['labels'] = this.labels().serialize();
  json['minorLabels'] = this.minorLabels().serialize();
};


/** @inheritDoc */
anychart.core.axes.MapSettings.prototype.disposeInternal = function() {

};


//endregion
//region --- Exports
//exports
anychart.core.axes.MapSettings.prototype['left'] = anychart.core.axes.MapSettings.prototype.left;
anychart.core.axes.MapSettings.prototype['top'] = anychart.core.axes.MapSettings.prototype.top;
anychart.core.axes.MapSettings.prototype['right'] = anychart.core.axes.MapSettings.prototype.right;
anychart.core.axes.MapSettings.prototype['bottom'] = anychart.core.axes.MapSettings.prototype.bottom;
// anychart.core.axes.MapSettings.prototype['enabled'] = anychart.core.axes.MapSettings.prototype.enabled;
// anychart.core.axes.MapSettings.prototype['title'] = anychart.core.axes.MapSettings.prototype.title;
// anychart.core.axes.MapSettings.prototype['stroke'] = anychart.core.axes.MapSettings.prototype.stroke;
// anychart.core.axes.MapSettings.prototype['ticks'] = anychart.core.axes.MapSettings.prototype.ticks;
// anychart.core.axes.MapSettings.prototype['minorTicks'] = anychart.core.axes.MapSettings.prototype.minorTicks;
// anychart.core.axes.MapSettings.prototype['labels'] = anychart.core.axes.MapSettings.prototype.labels;
// anychart.core.axes.MapSettings.prototype['minorLabels'] = anychart.core.axes.MapSettings.prototype.minorLabels;
//endregion
