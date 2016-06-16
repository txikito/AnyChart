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
   * Works map.
   * Allows to determine item's successors and predecessors.
   * @type {Object.<string, anychart.charts.Pert.Work>}
   * @private
   */
  this.worksMap_ = {};


  /**
   * Activity data map.
   * Contains calculated values as earliestStart, earliestFinish, latestStart, latestFinish, duration, slack.
   * @type {Object.<string, anychart.charts.Pert.ActivityData>}
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
   * Format provider.
   * @type {anychart.core.utils.PertPointContextProvider}
   * @private
   */
  this.formatProvider_ = null;

  /**
   * Finish milestone.
   * @type {?anychart.charts.Pert.Milestone}
   * @private
   */
  this.finishMilestone_ = null;

  /**
   * Start milestone.
   * @type {?anychart.charts.Pert.Milestone}
   * @private
   */
  this.startMilestone_ = null;

  /**
   * Location of milestone in a grid.
   * @type {Array.<Array.<anychart.charts.Pert.Milestone>>}
   * @private
   */
  this.milestones_ = [];

  /**
   * Index of filled columns in this.milestones_.
   * @type {number}
   * @private
   */
  this.xFill_ = 0;

  /**
   * Index of filled rows in this.milestones_.
   * @type {number}
   * @private
   */
  this.yFill_ = 0;

  /**
   * Milestones map.
   * @type {Object.<string, anychart.charts.Pert.Milestone>}
   * @private
   */
  this.milestonesMap_ = {};

};
goog.inherits(anychart.charts.Pert, anychart.core.SeparateChart);


/**
 * Cell pixel width.
 * @type {number}
 * @private
 */
anychart.charts.Pert.CELL_PIXEL_WIDTH_ = 75;


/**
 * Cell pixel height.
 * @type {number}
 * @private
 */
anychart.charts.Pert.CELL_PIXEL_HEIGHT_ = 35;


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
anychart.charts.Pert.ActivityData;


/**
 * TODO (A.Kudryavtsev): Describe fields!
 * @typedef {{
 *    id: string,
 *    label: string,
 *    successors: Array.<anychart.data.Tree.DataItem>,
 *    predecessors: Array.<anychart.data.Tree.DataItem>,
 *    mSuccessors: Array.<anychart.charts.Pert.Milestone>,
 *    mPredecessors: Array.<anychart.charts.Pert.Milestone>,
 *    level: number,
 *    xIndex: number,
 *    yIndex: number
 * }}
 */
anychart.charts.Pert.Milestone;


/**
 * @typedef {{
 *    item: anychart.data.Tree.DataItem,
 *    successors: Array.<anychart.data.Tree.DataItem>,
 *    predecessors: Array.<anychart.data.Tree.DataItem>,
 *    level: number,
 *    startMilestone: anychart.charts.Pert.Milestone,
 *    finishMilestone: anychart.charts.Pert.Milestone
 * }}
 */
anychart.charts.Pert.Work;


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
 * @param {anychart.charts.Pert.ActivityData=} opt_activityData - Activity data.
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
 * @param {function():number=} opt_value - Value to be set.
 * @return {function():number|anychart.charts.Pert} - Current value or itself for method chaining.
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
    this.worksMap_ = {};
    this.startActivities_.length = 0;
    this.finishActivities_.length = 0;

    if (this.data_ && !this.data_.isDisposed()) {
      var items = this.data_.getChildrenUnsafe(); //TODO (A.Kudryavtsev): do we process deeper (child) items somehow?
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var id = String(item.get(anychart.enums.DataField.ID));

        if (!(id in this.worksMap_)) {
          this.worksMap_[id] = {
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
            if (dependsOn in this.worksMap_) {
              if (dependsOn != id) {
                this.worksMap_[dependsOn].successors.push(item);
                this.worksMap_[id].predecessors.push(this.worksMap_[dependsOn].item);
                goog.array.remove(this.finishActivities_, this.worksMap_[dependsOn].item); //Has successor - remove.
              }
            } else {
              var found = this.data_.find(anychart.enums.DataField.ID, dependsOn)[0];
              if (found) {
                var foundId = String(found.get(anychart.enums.DataField.ID));
                this.worksMap_[foundId] = {
                  item: found,
                  successors: [item],
                  predecessors: [],
                  level: -1
                };
                goog.array.remove(this.finishActivities_, found); //Has successor - remove.
                this.worksMap_[id].predecessors.push(found);
              }
            }
          }
        } else {
          this.startActivities_.push(item);
        }
      }

      this.calculateLevels_();
      this.calculateActivities_();
      this.calculateMilestones_();

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
  var workData = this.worksMap_[id];
  if (workData.level < 0) { //Needs to be calculated.
    var max = 0;
    if (workData.predecessors.length) {
      for (var i = 0; i < workData.predecessors.length; i++) {
        var pred = workData.predecessors[i];
        var predId = String(pred.get(anychart.enums.DataField.ID));
        var predWorkData = this.worksMap_[predId];
        if (predWorkData.level < 0)
          this.calculateLevel_(predId);
        max = Math.max(max, this.worksMap_[predId].level);
      }
      max++;
    }
    if (!this.levels_[max])
      this.levels_[max] = [];
    this.levels_[max].push(id);
    workData.level = max;
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
  var workData = this.worksMap_[id];
  var item = workData.item;

  if (!(id in this.activitiesMap_)) {
    this.activitiesMap_[id] = /** @type {anychart.charts.Pert.ActivityData} */ ({});
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
    for (i = 0; i < workData.predecessors.length; i++) {
      var pred = workData.predecessors[i];
      var predId = String(pred.get(anychart.enums.DataField.ID));
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
    if (workData.successors.length) {
      val = Infinity;
      for (i = 0; i < workData.successors.length; i++) {
        var succ = workData.successors[i];
        var succId = String(succ.get(anychart.enums.DataField.ID));
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
        var finId = String(fin.get(anychart.enums.DataField.ID));
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


///**
// * Creates milestone.
// * @param {string|boolean} workIdOrStartFinish - Work id or boolean value. If "false", will create finish milestone,
// *  if "true" - creates start milestone.
// * @param {boolean=} opt_isStart - Whether milestone is start milestone for given activity.
// * @return {anychart.charts.Pert.Milestone} - Resulting milestone object. Also puts it to this.milestones_.
// * @private
// */
//anychart.charts.Pert.prototype.createMilestone_ = function(workIdOrStartFinish, opt_isStart) {
//  var id;
//  var name = '';
//  var work;
//  if (goog.isBoolean(workIdOrStartFinish)) {
//    id = workIdOrStartFinish ? 's' : 'f';
//    name = workIdOrStartFinish ? 'St' : 'Fin';
//  } else {
//    var add = opt_isStart ? '_s' : '_f';
//    name = opt_isStart ? 'Start: ' : 'Finish: '; //TODO (A.Kudryavtsev): Hardcoded!!! So bad.
//    work = /** @type {anychart.charts.Pert.Work} */ (this.worksMap_[workIdOrStartFinish]);
//    name += work.item.get(anychart.enums.DataField.NAME);
//    id = workIdOrStartFinish + add;
//  }
//
//  var level = 0, i = 0;
//  var pred, predId, predMilestone;
//
//  if (id in this.milestonesMap_) return this.milestonesMap_[id];
//
//  var result = /** @type {anychart.charts.Pert.Milestone} */ ({
//    label: name,
//    id: id,
//    xIndex: 0,
//    yIndex: 0,
//    successors: [],
//    predecessors: [],
//    mSuccessors: [],
//    mPredecessors: [],
//    level: -1
//  });
//
//
//  //TODO (A.Kudryavtsev): Calculate predecessors id here!!!
//
//  if (work) {
//    var source = opt_isStart ? work.successors : work.predecessors;
//    if (source.length > 1) {
//      var uid = '';
//      for (i = 0; i < work.predecessors.length; i++) {
//        pred = work.predecessors[i];
//        uid += this.hash_('v', pred);
//      }
//      if (uid in this.milestonesUIDMap_) {
//        return this.milestonesUIDMap_[uid];
//      } else {
//        this.milestonesUIDMap_[uid] = result;
//      }
//    }
//  }
//
//  this.milestonesMap_[id] = result;
//
//
//  if (goog.isBoolean(workIdOrStartFinish)) {
//    if (workIdOrStartFinish) {
//      //Creating start milestone.
//      this.startMilestone_ = result;
//      for (i = 0; i < this.startActivities_.length; i++) {
//        var stActivity = this.startActivities_[i];
//        result.successors.push(stActivity);
//      }
//      result.level = level;
//      this.xFill_ = this.milestones_.length;
//      //this.milestones_[this.xFill_][0] = result;
//      //TODO (A.Kudryavtsev): Add mSuccessors somehow here?
//    } else {
//      //Creating finish milestone.
//      this.finishMilestone_ = result;
//      for (i = 0; i < this.finishActivities_.length; i++) {
//        var finActivity = this.finishActivities_[i];
//        //level = Math.max(level, finActivity.level);
//        result.predecessors.push(finActivity);
//        var actId = String(finActivity.get(anychart.enums.DataField.ID));
//        predMilestone = this.createMilestone_(actId, true);
//        result.mPredecessors.push(predMilestone);
//      }
//      this.milestones_[0][0] = result;
//    }
//    result.level = level;
//  } else {
//
//
//
//
//    //if (work.successors.length) {
//    //  for (i = 0; i < work.successors.length; i++) {
//    //    var succ = work.successors[i];
//    //    var succId = String(succ.get(anychart.enums.DataField.ID));
//    //    var succMilestone = this.createMilestone_(succId, true);
//    //    result.successors.push(succ);
//    //    result.mSuccessors.push(succMilestone);
//    //  }
//    //} else {
//    //  //this.finishMilestone_ here exists anyway.
//    //  result.mSuccessors.push(this.finishMilestone_);
//    //}
//
//    if (work.predecessors.length) {
//      if (work.predecessors.length == 1) {
//        pred = work.predecessors[0];
//        predId = String(pred.get(anychart.enums.DataField.ID));
//        predMilestone = this.createMilestone_(predId, false);
//        if (!goog.array.contains(result.mPredecessors, predMilestone))
//          result.mPredecessors.push(predMilestone);
//        if (!goog.array.contains(predMilestone.mSuccessors, result))
//          predMilestone.mSuccessors.push(result);
//
//      } else {
//        for (i = 0; i < work.predecessors.length; i++) {
//          pred = work.predecessors[i];
//          predId = String(pred.get(anychart.enums.DataField.ID));
//          predMilestone = this.createMilestone_(predId, true);
//          result.mPredecessors.push(predMilestone);
//        }
//      }
//    } else {
//      if (!this.startMilestone_) this.createMilestone_(true);
//      result.mPredecessors.push(this.startMilestone_);
//    }
//  }
//
//  return this.milestonesMap_[id];
//};


/**
 * Creates milestone.
 * @param {string|boolean} workIdOrStartFinish - Work id or boolean value. If "false", will create finish milestone,
 *  if "true" - creates start milestone.
 * @param {boolean=} opt_isStart - Whether milestone is start milestone for given activity.
 * @return {anychart.charts.Pert.Milestone} - Resulting milestone object. Also puts it to this.milestones_.
 * @private
 */
anychart.charts.Pert.prototype.createMilestone_ = function(workIdOrStartFinish, opt_isStart) {
  //TODO (A.Kudryavtsev): REWORKING.
  var milestone, i, j, activity, id, work, hash, predecessor;
  var predId, predWork;

  if (goog.isBoolean(workIdOrStartFinish)) { //creating start or finish milestone.
    if (workIdOrStartFinish) { //create start milestone.
      if (this.startMilestone_) return this.startMilestone_;
      milestone = this.createEmptyMilestone_();
      this.startMilestone_ = milestone;
      for (i = 0; i < this.startActivities_.length; i++) {
        activity = this.startActivities_[i];
        id = String(activity.get(anychart.enums.DataField.ID));
        work = this.worksMap_[id];
        work.startMilestone = this.startMilestone_;
        this.startMilestone_.successors.push(activity);
        hash = this.hash_('m', this.startMilestone_);
        this.milestonesMap_[hash] = this.startMilestone_;
        this.startMilestone_.id = hash;
        this.startMilestone_.label = 'Start'; //TODO (A.Kudryavtsev): Hardcoded.
        //TODO (A.Kudryavtsev): Don't forget to add work finish milestone.
        //TODO (A.Kudryavtsev): Add xIndex and yIndex to this.startMilestone_.
      }

    } else { //create finish milestone.
      if (this.finishMilestone_) return this.finishMilestone_;
      milestone = this.createEmptyMilestone_();
      this.finishMilestone_ = milestone;
      for (i = 0; i < this.finishActivities_.length; i++) {
        activity = this.finishActivities_[i];
        id = String(activity.get(anychart.enums.DataField.ID));
        work = this.worksMap_[id];
        work.finishMilestone = this.finishMilestone_;
        this.finishMilestone_.predecessors.push(activity);
        hash = this.hash_('m', this.finishMilestone_);
        this.finishMilestone_.id = hash;
        this.finishMilestone_.label = 'Finish'; //TODO (A.Kudryavtsev): Hardcoded.
        this.finishMilestone_.xIndex = 0;
        this.finishMilestone_.yIndex = 0;
        this.milestonesMap_[hash] = this.finishMilestone_;

        if (!work.startMilestone)
          work.startMilestone = this.createMilestone_(id, true);

        this.addMilestoneSuccessors_(this.finishMilestone_, work.startMilestone);
      }
    }
  } else { //creating milestone by work id.
    work = /** @type {anychart.charts.Pert.Work} */ (this.worksMap_[workIdOrStartFinish]);
    if (opt_isStart) {
      if (work.startMilestone) return work.startMilestone;
    } else {
      if (work.finishMilestone) return work.finishMilestone;
    }

    milestone = this.createEmptyMilestone_();
    hash = this.hash_('m', milestone);
    this.milestonesMap_[hash] = milestone;
    milestone.id = hash;

    if (opt_isStart) { //creating start milestone.
      work.startMilestone = milestone;
      goog.array.insert(work.startMilestone.successors, work.item);
      milestone.label = 'Start: ' + work.item.get(anychart.enums.DataField.NAME); //TODO (A.Kudryavtsev): Hardcoded.

      if (work.predecessors.length) {
        if (work.predecessors.length == 1) {
          predecessor = work.predecessors[0];
          predId = String(predecessor.get(anychart.enums.DataField.ID));
          predWork = this.worksMap_[predId];
          predWork.finishMilestone = milestone;
          goog.array.insert(milestone.predecessors, predecessor);
          predWork.startMilestone = this.createMilestone_(predId, true);
          this.addMilestoneSuccessors_(milestone, predWork.startMilestone);
        } else {
          for (j = 0; j < work.predecessors.length; j++) {
            predecessor = work.predecessors[j];
            predId = String(predecessor.get(anychart.enums.DataField.ID));
            predWork = this.worksMap_[predId];

            if (predWork.successors.length > 1) { //NOTE: One successor is current work.
              for (var k = 0; k < predWork.successors.length; k++) {
                var predWorkSuccessor = predWork.successors[k];
                if (predWorkSuccessor != predWork.item) {
                  var predWorkSuccessorId = String(predWorkSuccessor.get(anychart.enums.DataField.ID));
                  var successorWork = this.worksMap_[predWorkSuccessorId];
                  successorWork.startMilestone = this.createMilestone_(predWorkSuccessorId, true);
                  predWork.finishMilestone = this.createMilestone_(predId, false);
                  if (successorWork.startMilestone != predWork.finishMilestone)
                    this.addMilestoneSuccessors_(successorWork.startMilestone, predWork.finishMilestone);
                }
              }
            } else { //Multiple successors (> 1).
              predWork.finishMilestone = this.createMilestone_(predId, false);
              this.addMilestoneSuccessors_(milestone, predWork.finishMilestone);
            }

          }
        }
      } else {
        work.startMilestone = /** @type {anychart.charts.Pert.Milestone} */ (this.startMilestone_);
      }
    } else { //creating finish milestone.
      work.finishMilestone = milestone;
      goog.array.insert(milestone.predecessors, work);
      milestone.label = 'Finish: ' + work.item.get(anychart.enums.DataField.NAME);

      if (work.predecessors.length) {
        work.startMilestone = this.createMilestone_(workIdOrStartFinish, true);
      } else {
        this.startMilestone_ = this.createMilestone_(true);
        work.startMilestone = this.startMilestone_;
        this.addMilestoneSuccessors_(work.finishMilestone, work.startMilestone);
      }
      goog.array.insert(work.startMilestone.successors, work.item);

    }
  }
  return milestone;
};


/**
 * Adds mSuccessor and mPredecessor.
 * @param {anychart.charts.Pert.Milestone} successorMilestone - Successor milestone.
 * @param {anychart.charts.Pert.Milestone} predecessorMilestone - Predecessor milestone.
 * @private
 */
anychart.charts.Pert.prototype.addMilestoneSuccessors_ = function(successorMilestone, predecessorMilestone) {
  goog.array.insert(successorMilestone.mPredecessors, predecessorMilestone);
  goog.array.insert(predecessorMilestone.mSuccessors, successorMilestone);
};


/**
 * Creates empty milestone object.
 * @return {anychart.charts.Pert.Milestone} - Empty object.
 * @private
 */
anychart.charts.Pert.prototype.createEmptyMilestone_ = function() {
  return /** @type {anychart.charts.Pert.Milestone} */ ({
    label: '',
    id: '',
    xIndex: NaN,
    yIndex: NaN,
    successors: [],
    predecessors: [],
    mSuccessors: [],
    mPredecessors: [],
    level: -1
  });
};


///**
// * Calculates milestone uid.
// * @param {string} workId - Related work id.
// * @param {boolean=} opt_isStart - Whether milestone is start.
// * @return {string} - UID.
// * @private
// */
//anychart.charts.Pert.prototype.getMilestoneUid_ = function(workId, opt_isStart) {
//  var work = this.worksMap_[workId];
//  var source = opt_isStart ? work.successors : work.predecessors;
//  var add = opt_isStart ? '_s' : '_f';
//
//  var uid = '';
//  if (source.length > 1) {
//    for (var i = 0; i < source.length; i++) {
//      var pred = source[i];
//      uid += this.hash_('v', pred);
//    }
//  }
//  return uid || workId + add;
//};


/**
 * Calculates milestones.
 * @private
 */
anychart.charts.Pert.prototype.calculateMilestones_ = function() {
  this.milestones_.length = 0;
  this.milestones_ = [];
  this.milestonesMap_ = {};
  this.createMilestone_(false);

  //debug
  //for (var i in this.milestonesMap_) {
  //  var mil = this.milestonesMap_[i];
  //  console.log(mil.label);
  //}
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
    //TODO (A.Kudryavtsev): rewritten shit!!!
  }
};


/**
 * Generates uid with prefix.
 * @param {string} prefix - UID prefix.
 * @param {Object} value - Value.
 * @return {string} - UID with prefix.
 * @private
 */
anychart.charts.Pert.prototype.hash_ = function(prefix, value) {
  return prefix + goog.getUid(value);
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
  delete this.worksMap_;
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
