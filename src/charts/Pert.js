goog.provide('anychart.charts.Pert');

goog.require('anychart.core.SeparateChart');
goog.require('anychart.core.utils.PertPointContextProvider');
goog.require('anychart.data.Tree');
goog.require('goog.array');



/**
 * Stock chart class.
 * @constructor
 * @extends {anychart.core.SeparateChart}
 */
anychart.charts.Pert = function() {
  anychart.charts.Pert.base(this, 'constructor');

  /**
   * Data tree.
   * @type {anychart.data.Tree}
   * @private
   */
  this.data_ = null;

  /**
   * Vertices map.
   * Allows to determine item's successors and predecessors.
   * @type {Object.<string, anychart.charts.Pert.Vertex>}
   * @private
   */
  this.verticesMap_ = {};


  /**
   * Activities map.
   * Contains calculated values as earliestStart, earliestFinish, latestStart, latestFinish, duration, slack.
   * @type {Object.<string, anychart.charts.Pert.Activity>}
   * @private
   */
  this.activitiesMap_ = {};


  /**
   * Levels data.
   * Contains IDs of activities by levels.
   * @type {Array.<Array.<string>>}
   * @private
   */
  this.levels_ = [];


  /**
   * Start activities.
   * NOTE: activities that do not depend on other activities.
   * @type {Array.<anychart.data.Tree.DataItem>}
   * @private
   */
  this.startActivities_ = [];

  /**
   * Finish activities.
   * NOTE: activities that are not dependent on other activities.
   * @type {Array.<anychart.data.Tree.DataItem>}
   * @private
   */
  this.finishActivities_ = [];

  /**
   * Function that calculates expected time.
   * @type {Function}
   * @private
   */
  this.expectedTimeCalculator_ = goog.nullFunction;

  /**
   *
   * @type {null}
   * @private
   */
  this.formatProvider_ = null;

};
goog.inherits(anychart.charts.Pert, anychart.core.SeparateChart);


/**
 * @typedef {{
 *    earliestStart: number,
 *    earliestFinish: number,
 *    latestStart: number,
 *    latestFinish: number,
 *    duration: number,
 *    slack: number
 * }}
 */
anychart.charts.Pert.Activity;


/**
 * @typedef {{
 *    item: anychart.data.Tree.DataItem,
 *    successors: Array.<anychart.data.Tree.DataItem>,
 *    predecessors: Array.<anychart.data.Tree.DataItem>,
 *    level: number
 * }}
 */
anychart.charts.Pert.Vertex;


/**
 * Supported signals.
 * @type {number}
 */
anychart.charts.Pert.prototype.SUPPORTED_SIGNALS = anychart.core.SeparateChart.prototype.SUPPORTED_SIGNALS;


/**
 * Supported consistency states.
 * @type {number}
 */
anychart.charts.Pert.prototype.SUPPORTED_CONSISTENCY_STATES =
    anychart.core.SeparateChart.prototype.SUPPORTED_CONSISTENCY_STATES |
    anychart.ConsistencyState.PERT_DATA |
    anychart.ConsistencyState.PERT_CALCULATIONS;


/** @inheritDoc */
anychart.charts.Pert.prototype.getType = function() {
  return anychart.enums.ChartTypes.PERT;
};


/**
 * Creates format provider and applies reference values.
 * @param {anychart.data.Tree.DataItem} item - Data item.
 * @param {anychart.charts.Pert.Activity=} opt_activityData - Activity data.
 * @return {anychart.core.utils.PertPointContextProvider} - Format provider.
 */
anychart.charts.Pert.prototype.createFormatProvider = function(item, opt_activityData) {
  if (!this.formatProvider_)
    this.formatProvider_ = new anychart.core.utils.PertPointContextProvider(this);
  this.formatProvider_.currentItem = item;
  this.formatProvider_.activityData = opt_activityData;
  this.formatProvider_.applyReferenceValues();
  return this.formatProvider_;
};


//----------------------------------------------------------------------------------------------------------------------
//
//  Data.
//
//----------------------------------------------------------------------------------------------------------------------
/**
 * Gets/sets chart data.
 * @param {(anychart.data.Tree|Array.<Object>)=} opt_data - Data tree or raw data.
 * @param {anychart.enums.TreeFillingMethod=} opt_fillMethod - Fill method.
 * @param {Array.<anychart.data.Tree.Dependency>=} opt_deps - Dependencies.
 * @return {(anychart.data.Tree|anychart.charts.Pert)} - Current value or itself for method chaining.
 */
anychart.charts.Pert.prototype.data = function(opt_data, opt_fillMethod, opt_deps) {
  if (goog.isDef(opt_data)) {
    if (opt_data instanceof anychart.data.Tree) {
      if (this.data_ != opt_data) {
        if (this.data_) this.data_.unlistenSignals(this.dataInvalidated_, this);
        this.data_ = opt_data;
      }
    } else {
      if (this.data_) this.data_.unlistenSignals(this.dataInvalidated_, this);
      this.data_ = new anychart.data.Tree(opt_data, opt_fillMethod, opt_deps);
    }
    this.data_.listenSignals(this.dataInvalidated_, this);
    this.invalidate(anychart.ConsistencyState.PERT_DATA, anychart.Signal.NEEDS_REDRAW);
    return this;
  }
  return this.data_;
};


/**
 * Listener for data invalidation.
 * @param {anychart.SignalEvent} event - Invalidation event.
 * @private
 */
anychart.charts.Pert.prototype.dataInvalidated_ = function(event) {
  this.invalidate(anychart.ConsistencyState.PERT_DATA, anychart.Signal.NEEDS_REDRAW);
};


//----------------------------------------------------------------------------------------------------------------------
//
//  Abstract methods implementation.
//
//----------------------------------------------------------------------------------------------------------------------
/** @inheritDoc */
anychart.charts.Pert.prototype.createLegendItemsProvider = function(sourceMode, itemsTextFormatter) {
  //TODO (A.Kudryavtsev): Implement.
  return [];
};


/** @inheritDoc */
anychart.charts.Pert.prototype.getAllSeries = function() {
  //TODO (A.Kudryavtsev): Implement.
  return [];
};


//----------------------------------------------------------------------------------------------------------------------
//
//  Calculations.
//
//----------------------------------------------------------------------------------------------------------------------
/**
 * Gets/sets function to calculate expected time.
 * @param {function:number=} opt_value - Value to be set.
 * @return {function:number|anychart.charts.Pert} - Current value or itself for method chainig.
 */
anychart.charts.Pert.prototype.expectedTimeCalculator = function(opt_value) {
  if (goog.isDef(opt_value)) {
    this.expectedTimeCalculator_ = opt_value;
    this.invalidate(anychart.ConsistencyState.PERT_CALCULATIONS);
    return this;
  }
  return this.expectedTimeCalculator_;
};


/** @inheritDoc */
anychart.charts.Pert.prototype.calculate = function() {
  if (this.hasInvalidationState(anychart.ConsistencyState.PERT_DATA)) {
    this.verticesMap_ = {};
    this.startActivities_.length = 0;
    this.finishActivities_.length = 0;

    if (this.data_ && !this.data_.isDisposed()) {
      var items = this.data_.getChildrenUnsafe(); //TODO (A.Kudryavtsev): do we process deeper (child) items somehow?
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var id = String(item.get(anychart.enums.DataField.ID));

        if (!this.verticesMap_.hasOwnProperty(id)) {
          this.verticesMap_[id] = {
            item: item,
            successors: [],
            predecessors: [],
            level: -1
          };
          this.finishActivities_.push(item); //Has no successors - add.
        }

        var deps = item.get(anychart.enums.DataField.DEPENDS_ON);
        if (goog.isDef(deps) && goog.typeOf(deps) == 'array') {
          for (var j = 0; j < deps.length; j++) {
            var dependsOn = String(deps[j]);
            if (this.verticesMap_.hasOwnProperty(dependsOn)) {
              if (dependsOn != id) {
                this.verticesMap_[dependsOn].successors.push(item);
                this.verticesMap_[id].predecessors.push(this.verticesMap_[dependsOn].item);
                goog.array.remove(this.finishActivities_, this.verticesMap_[dependsOn].item); //Has successor - remove.
              }
            } else {
              var found = this.data_.find(anychart.enums.DataField.ID, dependsOn)[0];
              if (found) {
                var foundId = String(found.get(anychart.enums.DataField.ID));
                this.verticesMap_[foundId] = {
                  item: found,
                  successors: [item],
                  predecessors: [],
                  level: -1
                };
                goog.array.remove(this.finishActivities_, found); //Has successor - remove.
                this.verticesMap_[id].predecessors.push(found);
              }
            }
          }
        } else {
          this.startActivities_.push(item);
        }
      }

      this.calculateLevels_();
      this.calculateActivities_();

    }
    this.markConsistent(anychart.ConsistencyState.PERT_DATA);
  }
};


/**
 * Calculates levels.
 * @private
 */
anychart.charts.Pert.prototype.calculateLevels_ = function() {
  this.levels_.length = 0;
  for (var i = 0; i < this.finishActivities_.length; i++) {
    this.calculateLevel_(String(this.finishActivities_[i].get(anychart.enums.DataField.ID)));
  }
};


/**
 * Calculates level of activity.
 * @param {string} id - Activity id.
 * @private
 */
anychart.charts.Pert.prototype.calculateLevel_ = function(id) {
  var vertexData = this.verticesMap_[id];
  if (vertexData.level < 0) { //Needs to be calculated.
    var max = 0;
    if (vertexData.predecessors.length) {
      for (var i = 0; i < vertexData.predecessors.length; i++) {
        var pred = vertexData.predecessors[i];
        var predId = String(pred.get(anychart.enums.DataField.ID));
        var predVertexData = this.verticesMap_[predId];
        if (predVertexData.level < 0)
          this.calculateLevel_(predId);
        max = Math.max(max, this.verticesMap_[predId].level);
      }
      max++;
    }
    if (!this.levels_[max])
      this.levels_[max] = [];
    this.levels_[max].push(id);
    vertexData.level = max;
  }
};


/**
 * Calculates activities.
 * @private
 */
anychart.charts.Pert.prototype.calculateActivities_ = function() {
  this.activitiesMap_ = {};
  if (this.startActivities_.length && this.finishActivities_.length) {
    for (var i = 0; i < this.startActivities_.length; i++) {
      this.calculateActivity_(String(this.startActivities_[i].get(anychart.enums.DataField.ID)));
    }
  } //TODO (A.Kudryavtsev): Else warning.
  this.markConsistent(anychart.ConsistencyState.PERT_CALCULATIONS);
};


/**
 * Calculates earliest start and earliest finish, latest start and latest finish for given activity.
 * @param {string} id - Activity id.
 * @private
 */
anychart.charts.Pert.prototype.calculateActivity_ = function(id) {
  var vertexData = this.verticesMap_[id];
  var item = vertexData.item;


  if (!this.activitiesMap_.hasOwnProperty(id)) {
    this.activitiesMap_[id] = {};
  }

  var activity = this.activitiesMap_[id];

  if (!goog.isDef(activity.duration)) {
    var formatProvider = this.createFormatProvider(item);
    activity.duration = this.expectedTimeCalculator_.call(formatProvider, formatProvider);
  }

  var duration = activity.duration;

  var i = 0;

  //Calculating earliest start and earliest finish.
  if (!goog.isDef(activity.earliestStart)) {
    var max = 0;
    for (i = 0; i < vertexData.predecessors.length; i++) {
      var pred = vertexData.predecessors[i];
      var predId = pred.get(anychart.enums.DataField.ID);
      var predActivity = this.activitiesMap_[predId];
      if (!goog.isDef(predActivity) || !goog.isDef(predActivity.earliestFinish))
        this.calculateActivity_(predId);
      var predActivityEF = this.activitiesMap_[predId].earliestFinish;
      max = Math.max(max, predActivityEF);
    }
    activity.earliestStart = max;
    activity.earliestFinish = max + duration;
  }


  //Calculating latest start and finish.
  if (!goog.isDef(activity.latestFinish)) {
    var val;
    if (vertexData.successors.length) {
      val = Infinity;
      for (i = 0; i < vertexData.successors.length; i++) {
        var succ = vertexData.successors[i];
        var succId = succ.get(anychart.enums.DataField.ID);
        var succActivity = this.activitiesMap_[succId];
        if (!goog.isDef(succActivity) || !goog.isDef(succActivity.latestStart))
          this.calculateActivity_(succId);
        var succActivityLS = this.activitiesMap_[succId].latestStart;
        val = Math.min(val, succActivityLS);
      }
    } else {
      val = -Infinity;
      for (i = 0; i < this.finishActivities_.length; i++) {
        var fin = this.finishActivities_[i];
        var finId = fin.get(anychart.enums.DataField.ID);
        var finActivity = this.activitiesMap_[finId];
        if (!goog.isDef(finActivity) || !goog.isDef(finActivity.earliestFinish))
          this.calculateActivity_(finId);
        var finActivityEF = this.activitiesMap_[finId].earliestFinish;
        val = Math.max(val, finActivityEF);
      }
    }
    activity.latestFinish = val;
    activity.latestStart = val - duration;
    activity.slack = val - activity.earliestFinish;
  }

};


//----------------------------------------------------------------------------------------------------------------------
//
//  Drawing
//
//----------------------------------------------------------------------------------------------------------------------
/** @inheritDoc */
anychart.charts.Pert.prototype.drawContent = function(bounds) {
  this.calculate();

  if (this.hasInvalidationState(anychart.ConsistencyState.PERT_CALCULATIONS)) {
    this.calculateActivities_();
    this.markConsistent(anychart.ConsistencyState.PERT_CALCULATIONS);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.BOUNDS)) {

  }
};


//----------------------------------------------------------------------------------------------------------------------
//
//  Serialization / deserialization / disposing
//
//----------------------------------------------------------------------------------------------------------------------
/** @inheritDoc */
anychart.charts.Pert.prototype.disposeInternal = function() {
  this.startActivities_.length = 0;
  this.finishActivities_.length = 0;
  delete this.verticesMap_;
  delete this.data_;

  goog.base(this, 'disposeInternal');
};


/** @inheritDoc */
anychart.charts.Pert.prototype.serialize = function() {
  var json = goog.base(this, 'serialize');
  return json;
};


/** @inheritDoc */
anychart.charts.Pert.prototype.setupByJSON = function(config) {
  goog.base(this, 'setupByJSON', config);
  this.expectedTimeCalculator(config['expectedTimeCalculator']);
};
