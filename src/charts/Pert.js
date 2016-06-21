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
 * Cell pixel vertical space.
 * @type {number}
 * @private
 */
anychart.charts.Pert.CELL_PIXEL_VERTICAL_SPACE_ = 40;


/**
 * Cell pixel horizontal space.
 * @type {number}
 * @private
 */
anychart.charts.Pert.CELL_PIXEL_HORIZONTAL_SPACE_ = 80;


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
 *    yIndex: number,
 *    isCritical: boolean,
 *    left: number,
 *    top: number
 * }}
 */
anychart.charts.Pert.Milestone;


/**
 * Work is actually a wrapper over a TreeDataItem.
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


/**
 * Adds mSuccessor and mPredecessor.
 * @param {anychart.charts.Pert.Milestone} successorMilestone - Successor milestone.
 * @param {anychart.charts.Pert.Milestone} predecessorMilestone - Predecessor milestone.
 * @return {boolean} - Whether milestones are not the same.
 * @private
 */
anychart.charts.Pert.prototype.addMilestoneSuccessors_ = function(successorMilestone, predecessorMilestone) {
  if (successorMilestone == predecessorMilestone) return false;
  goog.array.insert(successorMilestone.mPredecessors, predecessorMilestone);
  goog.array.insert(predecessorMilestone.mSuccessors, successorMilestone);
  return true;
};


/**
 * Creates empty milestone object. Also registers milestone in milestones map.
 * @param {string=} opt_label - Optional label.
 * @return {anychart.charts.Pert.Milestone} - Empty object.
 * @private
 */
anychart.charts.Pert.prototype.createEmptyMilestone_ = function(opt_label) {
  var result = /** @type {anychart.charts.Pert.Milestone} */ ({
    label: opt_label || '',
    id: '',
    xIndex: NaN,
    yIndex: NaN,
    successors: [],
    predecessors: [],
    mSuccessors: [],
    mPredecessors: [],
    level: -1,
    isCritical: false,
    left: 0,
    top: 0
  });
  var hash = this.hash_('m', result);
  this.milestonesMap_[hash] = result;
  result.id = hash;
  return result;
};


/**
 * Creates ALL milestones (Also unnecessary milestones).
 * First passage.
 * @private
 */
anychart.charts.Pert.prototype.createAllMilestones_ = function() {
  this.startMilestone_ = this.createEmptyMilestone_('Start'); //TODO (A.Kudryavtsev): Hardcoded.
  this.startMilestone_.isCritical = true;
  this.finishMilestone_ = this.createEmptyMilestone_('Finish'); //TODO (A.Kudryavtsev): Hardcoded.
  this.finishMilestone_.isCritical = true;

  var i;

  for (var id in this.worksMap_) {
    var work = this.worksMap_[id];

    if (!work.startMilestone)
      work.startMilestone = this.createEmptyMilestone_('Start: ' + work.item.get(anychart.enums.DataField.NAME)); //TODO (A.Kudryavtsev): Hardcoded.

    if (!work.finishMilestone)
      work.finishMilestone = this.createEmptyMilestone_('Finish: ' + work.item.get(anychart.enums.DataField.NAME)); //TODO (A.Kudryavtsev): Hardcoded.

    goog.array.insert(work.startMilestone.successors, work.item);
    goog.array.insert(work.finishMilestone.predecessors, work.item);

    if (work.successors.length) {
      for (i = 0; i < work.successors.length; i++) {
        var succ = work.successors[i];
        var succId = String(succ.get(anychart.enums.DataField.ID));
        var succWork = this.worksMap_[succId];
        if (!succWork.startMilestone)
          succWork.startMilestone = this.createEmptyMilestone_('Start: ' + succWork.item.get(anychart.enums.DataField.NAME));
        if (!succWork.finishMilestone)
          succWork.finishMilestone = this.createEmptyMilestone_('Finish: ' + succWork.item.get(anychart.enums.DataField.NAME));
        this.addMilestoneSuccessors_(succWork.startMilestone, work.finishMilestone);
      }
    } else {
      this.addMilestoneSuccessors_(this.finishMilestone_, work.finishMilestone);
    }

    if (work.predecessors.length) {
      for (i = 0; i < work.predecessors.length; i++) {
        var pred = work.predecessors[i];
        var predId = String(pred.get(anychart.enums.DataField.ID));
        var predWork = this.worksMap_[predId];
        if (!predWork.startMilestone)
          predWork.startMilestone = this.createEmptyMilestone_('Start: ' + predWork.item.get(anychart.enums.DataField.NAME));
        if (!succWork.finishMilestone)
          predWork.finishMilestone = this.createEmptyMilestone_('Finish: ' + predWork.item.get(anychart.enums.DataField.NAME));
        this.addMilestoneSuccessors_(work.startMilestone, predWork.finishMilestone);
      }
    } else {
      this.addMilestoneSuccessors_(work.startMilestone, this.startMilestone_);
    }
  }
};


/**
 * Clears unnecessary milestones.
 * Second and third passage.
 * @private
 */
anychart.charts.Pert.prototype.clearExcessiveMilestones_ = function() {
  var uid, i, j, mSucc, mPred, milestone;
  var succId, succWork, predId, predWork, cantBeShortenedMap, milestoneToRemove, rem;

  var removeList = [];

  //First passage.
  for (uid in this.milestonesMap_) {
    milestone = this.milestonesMap_[uid];
    cantBeShortenedMap = {};

    for (i = 0; i < milestone.mSuccessors.length; i++) {
      mSucc = milestone.mSuccessors[i];

      if (mSucc.successors.length == 1 && mSucc.mPredecessors.length < 2 && !mSucc.predecessors.length) {
        succId = String(mSucc.successors[0].get(anychart.enums.DataField.ID));
        succWork = this.worksMap_[succId];
        var succFinishMilestone = succWork.finishMilestone;
        for (j = 0; j < milestone.mSuccessors.length; j++) {
          if (i != j) { //not same.
            var anotherSucc = milestone.mSuccessors[j];
            if (anotherSucc.successors.length == 1) {
              var anotherSuccId = String(anotherSucc.successors[0].get(anychart.enums.DataField.ID));
              var anotherSuccWork = this.worksMap_[anotherSuccId];
              var anotherSuccFinishMilestone = anotherSuccWork.finishMilestone;
              if (anotherSuccFinishMilestone == succFinishMilestone) {
                cantBeShortenedMap[succFinishMilestone.id] = succFinishMilestone;
              }
            }
          }
        }
      } else {
        cantBeShortenedMap[mSucc.id] = mSucc;
      }
    }

    removeList.length = 0;
    for (i = 0; i < milestone.mSuccessors.length; i++) {
      mSucc = milestone.mSuccessors[i];
      if (!(mSucc.id in cantBeShortenedMap)) {
        succId = String(mSucc.successors[0].get(anychart.enums.DataField.ID));
        succWork = this.worksMap_[succId];
        milestoneToRemove = succWork.startMilestone;
        succWork.startMilestone = milestone;
        goog.array.insert(milestone.successors, succWork.item);
        removeList.push(milestoneToRemove);
      }
    }

    for (i = 0; i < removeList.length; i++) {
      rem = removeList[i];
      goog.array.remove(milestone.mSuccessors, rem);
      delete this.milestonesMap_[rem.id];
    }
  }

  //Second passage.
  for (uid in this.milestonesMap_) {
    milestone = this.milestonesMap_[uid];
    cantBeShortenedMap = {};

    for (i = 0; i < milestone.mPredecessors.length; i++) {
      mPred = milestone.mPredecessors[i];

      if (mPred.predecessors.length == 1 && mPred.mSuccessors.length < 2 && !mPred.successors.length) {
        predId = String(mPred.predecessors[0].get(anychart.enums.DataField.ID));
        predWork = this.worksMap_[predId];
        var predStartMilestone = predWork.startMilestone;
        for (j = 0; j < milestone.mPredecessors.length; j++) {
          if (i != j) { //not same.
            var anotherPred = milestone.mPredecessors[j];
            if (anotherPred.predecessors.length == 1) {
              var anotherPredId = String(anotherPred.predecessors[0].get(anychart.enums.DataField.ID));
              var anotherPredWork = this.worksMap_[anotherPredId];
              var anotherPredStartMilestone = anotherPredWork.startMilestone;
              if (anotherPredStartMilestone == predStartMilestone) {
                cantBeShortenedMap[mPred.id] = mPred;
              }
            }
          }
        }
      } else {
        cantBeShortenedMap[mPred.id] = mPred;
      }
    }

    removeList.length = 0;
    for (i = 0; i < milestone.mPredecessors.length; i++) {
      mPred = milestone.mPredecessors[i];
      if (!(mPred.id in cantBeShortenedMap)) {
        predId = String(mPred.predecessors[0].get(anychart.enums.DataField.ID));
        predWork = this.worksMap_[predId];
        milestoneToRemove = predWork.finishMilestone;
        predWork.finishMilestone = milestone;
        goog.array.insert(milestone.predecessors, predWork.item);
        removeList.push(milestoneToRemove);
      }
    }

    for (i = 0; i < removeList.length; i++) {
      rem = removeList[i];
      goog.array.remove(milestone.mPredecessors, rem);
      delete this.milestonesMap_[rem.id];
    }
  }
};


/**
 * Putes milestone in s correct location.
 * @param {anychart.charts.Pert.Milestone} milestone - Milestone.
 * @private
 */
anychart.charts.Pert.prototype.placeMilestone_ = function(milestone) {
  var i, yIndex;
  var xIndex = milestone.xIndex + 1;
  if ((milestone.mSuccessors.length || milestone.successors.length) && !goog.isArray(this.milestones_[xIndex])) {
    this.milestones_[xIndex] = [];
  }

  for (i = 0; i < milestone.successors.length; i++) {
    yIndex = this.milestones_[xIndex].length + i;
    var succ = milestone.successors[i];
    var succId = String(succ.get(anychart.enums.DataField.ID));
    var succWork = this.worksMap_[succId];

    var succFinMilestone = succWork.finishMilestone;

    if (isNaN(succFinMilestone.xIndex)) {
      succFinMilestone.xIndex = xIndex;
      goog.array.insert(this.milestones_[xIndex], succFinMilestone);
    } else {
      if (xIndex > succFinMilestone.xIndex) {
        goog.array.remove(this.milestones_[succFinMilestone.xIndex], succFinMilestone);
        goog.array.insert(this.milestones_[xIndex], succFinMilestone);
        //goog.array.insertBefore(this.milestones_[xIndex], void 0, succFinMilestone);

        succFinMilestone.xIndex = xIndex;
      }
    }

    this.placeMilestone_(succFinMilestone);
  }


  for (i = 0; i < milestone.mSuccessors.length; i++) {
    yIndex = this.milestones_[xIndex].length + i;
    var mSucc = milestone.mSuccessors[i];

    if (isNaN(mSucc.xIndex)) {
      mSucc.xIndex = xIndex;
      goog.array.insert(this.milestones_[xIndex], mSucc);
    } else {
      if (xIndex > mSucc.xIndex) {
        goog.array.remove(this.milestones_[mSucc.xIndex], mSucc);
        goog.array.insert(this.milestones_[xIndex], mSucc);
        //goog.array.insertBefore(this.milestones_[xIndex], void 0, mSucc);
        mSucc.xIndex = xIndex;
      }
    }

    this.placeMilestone_(mSucc);
  }
};


/**
 * Calculates milestones.
 * @private
 */
anychart.charts.Pert.prototype.calculateMilestones_ = function() {
  this.milestones_.length = 0;
  this.milestones_ = [];
  this.milestonesMap_ = {};
  this.createAllMilestones_();
  this.clearExcessiveMilestones_();

  this.startMilestone_.xIndex = 0;
  this.startMilestone_.yIndex = 0;
  this.milestones_[0] = [this.startMilestone_];

  this.placeMilestone_(this.startMilestone_);
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
    var i, j;
    var l = acgraph.layer();
    var add = 0;
    l.parent(this.rootElement);
    var left = bounds.left;
    for (i = 0; i < this.milestones_.length; i++) {
      var milVertical = this.milestones_[i];
      if (milVertical) {
        var top = bounds.top + add;

        for (j = 0; j < milVertical.length; j++) {
          var milestone = milVertical[j];
          if (milestone) {
            var milPath = l.path().fill('none');
            milPath.moveTo(left, top)
                .lineTo(left + anychart.charts.Pert.CELL_PIXEL_WIDTH_, top)
                .lineTo(left + anychart.charts.Pert.CELL_PIXEL_WIDTH_, top + anychart.charts.Pert.CELL_PIXEL_HEIGHT_)
                .lineTo(left, top + anychart.charts.Pert.CELL_PIXEL_HEIGHT_)
                .close();

            var label = l.text(left + 2, top + 2, milestone.label);
            milestone.left = left;
            milestone.top = top;

          }
          top += (anychart.charts.Pert.CELL_PIXEL_HEIGHT_ + anychart.charts.Pert.CELL_PIXEL_VERTICAL_SPACE_);
        }
      }
      left += (anychart.charts.Pert.CELL_PIXEL_WIDTH_ + anychart.charts.Pert.CELL_PIXEL_HORIZONTAL_SPACE_);
      add += 20; //TODO (A.Kudryavtsev): :'(
    }

    for (var id in this.milestonesMap_) {
      var mil = this.milestonesMap_[id];
      for (i = 0; i < mil.successors.length; i++) {
        var succ = mil.successors[i];
        var succId = String(succ.get(anychart.enums.DataField.ID));
        var activity = this.activitiesMap_[succId];
        var succWork = this.worksMap_[succId];
        var destMilestone = succWork.finishMilestone;
        var path = l.path();
        var stroke = 'blue';
        if (!activity.slack) {
          stroke = '2 red';
          succWork.startMilestone.isCritical = true;
          succWork.finishMilestone.isCritical = true;
        }
        path.stroke(stroke);
        path.moveTo(mil.left + anychart.charts.Pert.CELL_PIXEL_WIDTH_, mil.top + anychart.charts.Pert.CELL_PIXEL_HEIGHT_ / 2)
            .lineTo(destMilestone.left, destMilestone.top + anychart.charts.Pert.CELL_PIXEL_HEIGHT_ / 2);
      }


    }

    for (var id in this.milestonesMap_) {
      var mil = this.milestonesMap_[id];
      for (i = 0; i < mil.mSuccessors.length; i++) {
        var mSucc = mil.mSuccessors[i];
        var path = l.path();

        var stroke = {'dash': '2 2', 'color': 'grey'};

        if (mil.isCritical && mSucc.isCritical) {
          stroke['color'] = 'red';
          stroke['thickness'] = 2;
        }

        path.stroke(stroke);

        path.moveTo(mil.left + anychart.charts.Pert.CELL_PIXEL_WIDTH_, mil.top + anychart.charts.Pert.CELL_PIXEL_HEIGHT_ / 2)
            .lineTo(mSucc.left, mSucc.top + anychart.charts.Pert.CELL_PIXEL_HEIGHT_ / 2);
      }
    }
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
