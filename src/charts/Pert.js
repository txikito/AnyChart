goog.provide('anychart.charts.Pert');

goog.require('acgraph.math.Coordinate');
goog.require('anychart.core.SeparateChart');
goog.require('anychart.core.pert.CriticalPath');
goog.require('anychart.core.pert.Milestones');
goog.require('anychart.core.pert.Tasks');
goog.require('anychart.core.utils.PertPointContextProvider');
goog.require('anychart.core.utils.TypedLayer');
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
  this.milestonesLocation_ = [];

  /**
   * Milestones map.
   * @type {Object.<string, anychart.charts.Pert.Milestone>}
   * @private
   */
  this.milestonesMap_ = {};

  /**
   * Milestones layer.
   * @type {anychart.core.utils.TypedLayer}
   * @private
   */
  this.milestonesLayer_ = null;

  /**
   * Activities layer.
   * @type {anychart.core.utils.TypedLayer}
   * @private
   */
  this.activitiesLayer_ = null;

  /**
   * Labels layer.
   * @type {acgraph.vector.Layer}
   * @private
   */
  this.labelsLayer_ = null;

  /**
   * Base layer.
   * @type {acgraph.vector.Layer}
   * @private
   */
  this.baseLayer_ = null;

  /**
   * Milestones settings object.
   * @type {anychart.core.pert.Milestones}
   * @private
   */
  this.milestones_ = null;

  /**
   * Tasks settings object.
   * @type {anychart.core.pert.Tasks}
   * @private
   */
  this.tasks_ = null;

  /**
   * Critical path settings object.
   * @type {anychart.core.pert.CriticalPath}
   * @private
   */
  this.criticalPath_ = null;

  /**
   * Selected works.
   * @type {Array.<anychart.charts.Pert.Work>}
   * @private
   */
  this.selectedWorks_ = [];

  /**
   * Selected milestones.
   * @type {Array.<anychart.charts.Pert.Milestone>}
   * @private
   */
  this.selectedMilestones_ = [];

  this.bindHandlersToComponent(this, this.handleMouseOverAndMove, this.handleMouseOut, this.clickHandler_,
      this.handleMouseOverAndMove, this.handleAll_, this.handleMouseDown);

};
goog.inherits(anychart.charts.Pert, anychart.core.SeparateChart);


/**
 * Base layer z-index.
 * @type {number}
 */
anychart.charts.Pert.BASE_LAYER_Z_INDEX = 2;


/**
 * Cell pixel size.
 * @type {number}
 * @private
 */
anychart.charts.Pert.CELL_PIXEL_SIZE_ = 80;


/**
 * Cell pixel vertical space.
 * @type {number}
 * @private
 */
anychart.charts.Pert.CELL_PIXEL_VERTICAL_SPACE_ = 20;


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
 *    top: number,
 *    isSelected: boolean,
 *    relatedPath: acgraph.vector.Path,
 *    relatedLabel: anychart.core.ui.LabelsFactory.Label,
 *    isStart: boolean,
 *    creator: (anychart.charts.Pert.Work|null)
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
 *    finishMilestone: anychart.charts.Pert.Milestone,
 *    isCritical: boolean,
 *    isSelected: boolean,
 *    relatedPath: acgraph.vector.Path,
 *    upperLabel: anychart.core.ui.LabelsFactory.Label,
 *    lowerLabel: anychart.core.ui.LabelsFactory.Label
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
    anychart.ConsistencyState.PERT_CALCULATIONS |
    anychart.ConsistencyState.PERT_APPEARANCE |
    anychart.ConsistencyState.PERT_LABELS;


/** @inheritDoc */
anychart.charts.Pert.prototype.getType = function() {
  return anychart.enums.ChartTypes.PERT;
};


/**
 * Creates format provider and applies reference values.
 * @param {boolean=} opt_force - Force create.
 * @param {anychart.charts.Pert.Work=} opt_work - Work data.
 * @param {anychart.charts.Pert.ActivityData=} opt_activityData - Activity data.
 * @param {anychart.charts.Pert.Milestone=} opt_milestone - Milestone data.
 * @return {anychart.core.utils.PertPointContextProvider} - Format provider.
 */
anychart.charts.Pert.prototype.createFormatProvider = function(opt_force, opt_work, opt_activityData, opt_milestone) {
  if (!this.formatProvider_ || opt_force)
    this.formatProvider_ = new anychart.core.utils.PertPointContextProvider(this);
  this.formatProvider_.work = opt_work;
  this.formatProvider_.activityData = opt_activityData;
  this.formatProvider_.milestone = opt_milestone;
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
 * @inheritDoc
 */
anychart.charts.Pert.prototype.resizeHandler = function(evt) {
  if (this.bounds().dependsOnContainerSize()) {
    this.invalidate(anychart.ConsistencyState.ALL & ~(anychart.ConsistencyState.CHART_ANIMATION | anychart.ConsistencyState.PERT_DATA),
        anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
  }
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
//  Mouse interactivity.
//
//----------------------------------------------------------------------------------------------------------------------
/**
 * Hides tooltips excepting one.
 * @param {anychart.core.ui.Tooltip=} opt_exception - Tooltip to be left.
 * @private
 */
anychart.charts.Pert.prototype.hideOtherTooltips_ = function(opt_exception) {
  if (opt_exception != this.milestones().tooltip()) this.milestones().tooltip().hide();
  if (opt_exception != this.tasks().tooltip()) this.tasks().tooltip().hide();
  if (opt_exception != this.criticalPath().milestones().tooltip()) this.criticalPath().milestones().tooltip().hide();
  if (opt_exception != this.criticalPath().tasks().tooltip()) this.criticalPath().tasks().tooltip().hide();
};


/** @inheritDoc */
anychart.charts.Pert.prototype.handleMouseOverAndMove = function(event) {
  var domTarget = event['domTarget'];
  var label;

  var fill, stroke, source;
  var work, activity, milestone;
  var tooltip;
  var position;
  var pos = new acgraph.math.Coordinate(event['clientX'], event['clientY']);
  var zeroPos = new acgraph.math.Coordinate(0, 0);
  var formatProvider;

  if (goog.isDefAndNotNull(domTarget.attr('m_id'))) {
    milestone = this.milestonesMap_[domTarget.attr('m_id')];
    source = milestone.isCritical ? this.criticalPath().milestones() : this.milestones();
    fill = milestone.isSelected ? source.selectFill() : source.hoverFill();
    stroke = milestone.isSelected ? source.selectStroke() : source.hoverStroke();
    domTarget.fill(fill).stroke(stroke);

    tooltip = source.tooltip();
    formatProvider = this.createFormatProvider(false, void 0, void 0, milestone);
    position = tooltip.isFloating() ? pos : zeroPos;
    tooltip.show(formatProvider, position);

    label = milestone.relatedLabel;
    if (label) {
      label.currentLabelsFactory(/** @type {anychart.core.ui.LabelsFactory} */ (milestone.isSelected ? source.selectLabels() : source.hoverLabels()));
      source.labels().draw();
    }

  } else if (goog.isDefAndNotNull(domTarget.attr('w_id'))) {
    var wId = domTarget.attr('w_id');
    work = this.worksMap_[wId];
    activity = this.activitiesMap_[wId];
    source = work.isCritical ? this.criticalPath().tasks() : this.tasks();
    fill = work.isSelected ? source.selectFill() : source.hoverFill();
    stroke = work.isSelected ? source.selectStroke() : source.hoverStroke();
    domTarget.fill(fill).stroke(stroke);

    work.upperLabel.currentLabelsFactory(/** @type {anychart.core.ui.LabelsFactory} */ (work.isSelected ? source.selectUpperLabels() : source.hoverUpperLabels()));
    work.lowerLabel.currentLabelsFactory(/** @type {anychart.core.ui.LabelsFactory} */ (work.isSelected ? source.selectLowerLabels() : source.hoverLowerLabels()));
    source.upperLabels().draw();
    source.lowerLabels().draw();

    tooltip = source.tooltip();
    formatProvider = this.createFormatProvider(false, work, activity, void 0);
    position = tooltip.isFloating() ? pos : zeroPos;
    tooltip.show(formatProvider, position);

  } else if (goog.isDefAndNotNull(domTarget.attr('d_crit'))) {
    var isCrit = domTarget.attr('d_crit') == 'true';
    source = isCrit ? this.criticalPath().tasks() : this.tasks();
    fill = source.hoverDummyFill();
    stroke = source.hoverDummyStroke();
    domTarget.fill(fill).stroke(stroke);
  }

  this.hideOtherTooltips_(/** @type {anychart.core.ui.Tooltip} */ (tooltip));
};


/**
 * Handler for mouseOut event.
 * @param {anychart.core.MouseEvent} event Event object.
 */
anychart.charts.Pert.prototype.handleMouseOut = function(event) {
  var domTarget = event['domTarget'];
  var fill, stroke, source;
  var render = false;
  var label;

  if (goog.isDefAndNotNull(domTarget.attr('m_id'))) {
    render = true;
    var milestone = this.milestonesMap_[domTarget.attr('m_id')];
    source = milestone.isCritical ? this.criticalPath().milestones() : this.milestones();
    fill = milestone.isSelected ? source.selectFill() : source.fill();
    stroke = milestone.isSelected ? source.selectStroke() : source.stroke();

    label = milestone.relatedLabel;
    if (label) {
      label.currentLabelsFactory(/** @type {anychart.core.ui.LabelsFactory} */ (milestone.isSelected ? source.selectLabels() : source.labels()));
      source.labels().draw();
    }
  } else if (goog.isDefAndNotNull(domTarget.attr('w_id'))) {
    render = true;
    var work = this.worksMap_[/** @type {string} */ (domTarget.attr('w_id'))];
    source = work.isCritical ? this.criticalPath().tasks() : this.tasks();
    fill = work.isSelected ? source.selectFill() : source.fill();
    stroke = work.isSelected ? source.selectStroke() : source.stroke();

    work.upperLabel.currentLabelsFactory(/** @type {anychart.core.ui.LabelsFactory} */ (work.isSelected ? source.selectUpperLabels() : source.upperLabels()));
    work.lowerLabel.currentLabelsFactory(/** @type {anychart.core.ui.LabelsFactory} */ (work.isSelected ? source.selectLowerLabels() : source.lowerLabels()));
    source.upperLabels().draw();
    source.lowerLabels().draw();

  } else if (goog.isDefAndNotNull(domTarget.attr('d_crit'))) {
    render = true;
    var isCrit = domTarget.attr('d_crit') == 'true';
    source = isCrit ? this.criticalPath().tasks() : this.tasks();
    fill = source.dummyFill();
    stroke = source.dummyStroke();
  }

  if (render) domTarget.fill(fill).stroke(stroke);
};


/**
 * Handler for mouseOut event.
 * @param {anychart.core.MouseEvent} event Event object.
 * @private
 */
anychart.charts.Pert.prototype.handleAll_ = function(event) {
  if (event['type'] == acgraph.events.EventType.DBLCLICK) {
    console.log(event);

  }

};


/**
 * Handler for click event.
 * @param {anychart.core.MouseEvent} event - Event object.
 * @private
 */
anychart.charts.Pert.prototype.clickHandler_ = function(event) {
  var ctrl = event.metaKey || event.ctrlKey;
  var i = 0;
  var milestone, work;

  var domTarget = /** @type {acgraph.vector.Element} */ (event.domTarget);
  if (domTarget instanceof acgraph.vector.Element) {
    if (goog.isDefAndNotNull(domTarget.attr('m_id'))) {
      milestone = this.milestonesMap_[/** @type {string} */ (domTarget.attr('m_id'))];
    } else if (goog.isDefAndNotNull(domTarget.attr('w_id'))) {
      work = this.worksMap_[/** @type {string} */ (domTarget.attr('w_id'))];
    }

    if (milestone || work) {
      if (ctrl) {
        if (milestone) {
          milestone.isSelected = !milestone.isSelected;
          if (milestone.isSelected) {
            goog.array.insert(this.selectedMilestones_, milestone);
          } else {
            goog.array.remove(this.selectedMilestones_, milestone);
          }
        }
        if (work) {
          work.isSelected = !work.isSelected;
          if (work.isSelected) {
            goog.array.insert(this.selectedWorks_, work);
          } else {
            goog.array.remove(this.selectedWorks_, work);
          }
        }
      } else {
        for (i = 0; i < this.selectedMilestones_.length; i++) {
          this.selectedMilestones_[i].isSelected = false;
        }
        for (i = 0; i < this.selectedWorks_.length; i++) {
          this.selectedWorks_[i].isSelected = false;
        }
        this.selectedMilestones_.length = 0;
        this.selectedWorks_.length = 0;
        if (milestone) {
          milestone.isSelected = true;
          this.selectedMilestones_.push(milestone);
        }
        if (work) {
          work.isSelected = true;
          this.selectedWorks_.push(work);
        }
      }
    } else {
      for (i = 0; i < this.selectedMilestones_.length; i++) {
        this.selectedMilestones_[i].isSelected = false;
      }
      for (i = 0; i < this.selectedWorks_.length; i++) {
        this.selectedWorks_[i].isSelected = false;
      }
      this.selectedMilestones_.length = 0;
      this.selectedWorks_.length = 0;
    }
    this.invalidate(anychart.ConsistencyState.PERT_APPEARANCE, anychart.Signal.NEEDS_REDRAW);

  }
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
    this.invalidate(anychart.ConsistencyState.PERT_CALCULATIONS, anychart.Signal.NEEDS_REDRAW);
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
            level: -1,
            isCritical: false
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
                  level: -1,
                  isCritical: false
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

  if (!(id in this.activitiesMap_)) {
    this.activitiesMap_[id] = /** @type {anychart.charts.Pert.ActivityData} */ ({});
  }

  var activity = this.activitiesMap_[id];

  if (!goog.isDef(activity.duration)) {
    var formatProvider = this.createFormatProvider(false, workData, activity);
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
 * @param {?anychart.charts.Pert.Work} creator - Work that creates milestone or null.
 * @param {boolean} isStart - Whether milestone is start.
 * @param {string=} opt_label - Optional label.
 * @return {anychart.charts.Pert.Milestone} - Empty object.
 * @private
 */
anychart.charts.Pert.prototype.createEmptyMilestone_ = function(creator, isStart, opt_label) {
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
    top: 0,
    isStart: isStart,
    creator: creator
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
  this.startMilestone_ = this.createEmptyMilestone_(null, true, 'Start'); //TODO (A.Kudryavtsev): Hardcoded.
  this.startMilestone_.isCritical = true;
  this.finishMilestone_ = this.createEmptyMilestone_(null, false, 'Finish'); //TODO (A.Kudryavtsev): Hardcoded.
  this.finishMilestone_.isCritical = true;

  var i;

  for (var id in this.worksMap_) {
    var work = this.worksMap_[id];
    var activity = this.activitiesMap_[id];

    if (!work.startMilestone) {
      work.startMilestone = this.createEmptyMilestone_(work, true, 'Start: ' + work.item.get(anychart.enums.DataField.NAME)); //TODO (A.Kudryavtsev): Hardcoded.
    }

    if (!work.finishMilestone) {
      work.finishMilestone = this.createEmptyMilestone_(work, false, 'Finish: ' + work.item.get(anychart.enums.DataField.NAME)); //TODO (A.Kudryavtsev): Hardcoded.
      work.finishMilestone.creator = work;
    }

    goog.array.insert(work.startMilestone.successors, work.item);
    goog.array.insert(work.finishMilestone.predecessors, work.item);

    if (!activity.slack) {
      work.isCritical = true;
      work.startMilestone.isCritical = true;
      work.finishMilestone.isCritical = true;
    }

    if (work.successors.length) {
      for (i = 0; i < work.successors.length; i++) {
        var succ = work.successors[i];
        var succId = String(succ.get(anychart.enums.DataField.ID));
        var succWork = this.worksMap_[succId];
        if (!succWork.startMilestone)
          succWork.startMilestone = this.createEmptyMilestone_(succWork, true, 'Start: ' + succWork.item.get(anychart.enums.DataField.NAME));
        if (!succWork.finishMilestone)
          succWork.finishMilestone = this.createEmptyMilestone_(succWork, false, 'Finish: ' + succWork.item.get(anychart.enums.DataField.NAME));
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
          predWork.startMilestone = this.createEmptyMilestone_(predWork, true, 'Start: ' + predWork.item.get(anychart.enums.DataField.NAME));
        if (!succWork.finishMilestone)
          predWork.finishMilestone = this.createEmptyMilestone_(predWork, false, 'Finish: ' + predWork.item.get(anychart.enums.DataField.NAME));
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
  if ((milestone.mSuccessors.length || milestone.successors.length) && !goog.isArray(this.milestonesLocation_[xIndex])) {
    this.milestonesLocation_[xIndex] = [];
  }

  for (i = 0; i < milestone.successors.length; i++) {
    yIndex = this.milestonesLocation_[xIndex].length + i;
    var succ = milestone.successors[i];
    var succId = String(succ.get(anychart.enums.DataField.ID));
    var succWork = this.worksMap_[succId];

    var succFinMilestone = succWork.finishMilestone;

    if (isNaN(succFinMilestone.xIndex)) {
      succFinMilestone.xIndex = xIndex;
      goog.array.insert(this.milestonesLocation_[xIndex], succFinMilestone);
    } else {
      if (xIndex > succFinMilestone.xIndex) {
        goog.array.remove(this.milestonesLocation_[succFinMilestone.xIndex], succFinMilestone);
        goog.array.insert(this.milestonesLocation_[xIndex], succFinMilestone);
        succFinMilestone.xIndex = xIndex;
      }
    }

    this.placeMilestone_(succFinMilestone);
  }


  for (i = 0; i < milestone.mSuccessors.length; i++) {
    yIndex = this.milestonesLocation_[xIndex].length + i;
    var mSucc = milestone.mSuccessors[i];

    if (isNaN(mSucc.xIndex)) {
      mSucc.xIndex = xIndex;
      goog.array.insert(this.milestonesLocation_[xIndex], mSucc);
    } else {
      if (xIndex > mSucc.xIndex) {
        goog.array.remove(this.milestonesLocation_[mSucc.xIndex], mSucc);
        goog.array.insert(this.milestonesLocation_[xIndex], mSucc);
        //goog.array.insertBefore(this.milestonesLocation_[xIndex], void 0, mSucc);
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
  this.milestonesLocation_.length = 0;
  this.milestonesLocation_ = [];
  this.milestonesMap_ = {};
  this.createAllMilestones_();
  this.clearExcessiveMilestones_();

  this.startMilestone_.xIndex = 0;
  this.startMilestone_.yIndex = 0;
  this.milestonesLocation_[0] = [this.startMilestone_];

  this.placeMilestone_(this.startMilestone_);
};


/**
 * Gets/sets milestones settings object.
 * @param {Object=} opt_value - Settings object.
 * @return {anychart.charts.Pert|anychart.core.pert.Milestones} - Chart itself or milestones settings object.
 */
anychart.charts.Pert.prototype.milestones = function(opt_value) {
  if (!this.milestones_) {
    this.milestones_ = new anychart.core.pert.Milestones();
    this.milestones_.listenSignals(this.onMilestonesSignal_, this);
  }

  if (goog.isDef(opt_value)) {
    this.milestones_.setup(opt_value);
    return this;
  }
  return this.milestones_;
};


/**
 * Listener for milestones invalidation.
 * @param {anychart.SignalEvent} event - Signal event.
 * @private
 */
anychart.charts.Pert.prototype.onMilestonesSignal_ = function(event) {
  var state = 0;
  if (event.hasSignal(anychart.Signal.NEEDS_REDRAW_LABELS)) {
    state |= anychart.ConsistencyState.PERT_LABELS;
  }

  if (event.hasSignal(anychart.Signal.NEEDS_REDRAW_APPEARANCE)) {
    state |= anychart.ConsistencyState.PERT_APPEARANCE;
  }

  if (event.hasSignal(anychart.Signal.NEEDS_REDRAW)) {
    state |= anychart.ConsistencyState.BOUNDS;
  }

  this.invalidate(state, anychart.Signal.NEEDS_REDRAW);
};


/**
 * Gets/sets tasks settings object.
 * @param {Object=} opt_value - Settings object.
 * @return {anychart.charts.Pert|anychart.core.pert.Tasks} - Chart itself or tasks settings object.
 */
anychart.charts.Pert.prototype.tasks = function(opt_value) {
  if (!this.tasks_) {
    this.tasks_ = new anychart.core.pert.Tasks();
    this.tasks_.listenSignals(this.onTasksSignal_, this);
  }

  if (goog.isDef(opt_value)) {
    this.tasks_.setup(opt_value);
    return this;
  }
  return this.tasks_;
};


/**
 * Listener for tasks invalidation.
 * @param {anychart.SignalEvent} event - Signal event.
 * @private
 */
anychart.charts.Pert.prototype.onTasksSignal_ = function(event) {
  var state = 0;
  if (event.hasSignal(anychart.Signal.NEEDS_REDRAW_LABELS)) {
    state |= anychart.ConsistencyState.PERT_LABELS;
  }

  if (event.hasSignal(anychart.Signal.NEEDS_REDRAW_APPEARANCE)) {
    state |= anychart.ConsistencyState.PERT_APPEARANCE;
  }

  this.invalidate(state, anychart.Signal.NEEDS_REDRAW);
};


/**
 * Gets/sets critical path settings object.
 * @param {Object=} opt_value - Settings object.
 * @return {anychart.charts.Pert|anychart.core.pert.CriticalPath} - Chart itself or critical path settings object.
 */
anychart.charts.Pert.prototype.criticalPath = function(opt_value) {
  if (!this.criticalPath_) {
    this.criticalPath_ = new anychart.core.pert.CriticalPath();
    this.criticalPath_.milestones().listenSignals(this.onMilestonesSignal_, this);
    this.criticalPath_.tasks().listenSignals(this.onTasksSignal_, this);
  }

  if (goog.isDef(opt_value)) {
    this.criticalPath_.setup(opt_value);
    return this;
  }
  return this.criticalPath_;
};


//----------------------------------------------------------------------------------------------------------------------
//
//  Drawing
//
//----------------------------------------------------------------------------------------------------------------------
/**
 * Milestone layer appearance callback.
 * @param {acgraph.vector.Element} element - Element.
 * @param {number} index - Index.
 * @private
 */
anychart.charts.Pert.prototype.milestonesLayerAppearanceCallback_ = function(element, index) {
  var fill, stroke;

  if (goog.isDefAndNotNull(element.attr('m_id'))) {
    var milestone = this.milestonesMap_[/** @type {string} */ (element.attr('m_id'))];
    var source = milestone.isCritical ? this.criticalPath().milestones() : this.milestones();

    fill = /** @type {acgraph.vector.Fill} */ (milestone.isSelected ? source.selectFill() : source.fill());
    stroke = /** @type {acgraph.vector.Stroke} */ (milestone.isSelected ? source.selectStroke() : source.stroke());
    /** @type {acgraph.vector.Path} */ (element).fill(fill).stroke(stroke);

    milestone.relatedLabel.currentLabelsFactory(/** @type {anychart.core.ui.LabelsFactory} */ (milestone.isSelected ? source.selectLabels() : source.labels()));
  }
};


/**
 * Work layer appearance callback.
 * @param {acgraph.vector.Element} element - Element.
 * @param {number} index - Index.
 * @private
 */
anychart.charts.Pert.prototype.worksLayerAppearanceCallback_ = function(element, index) {
  var fill, stroke;

  if (goog.isDefAndNotNull(element.attr('w_id'))) {
    var work = this.worksMap_[/** @type {string} */ (element.attr('w_id'))];
    var source = work.isCritical ? this.criticalPath().tasks() : this.tasks();
    fill = /** @type {acgraph.vector.Fill} */ (work.isSelected ? source.selectFill() : source.fill());
    stroke = /** @type {acgraph.vector.Stroke} */ (work.isSelected ? source.selectStroke() : source.stroke());
    /** @type {acgraph.vector.Path} */ (element).fill(fill).stroke(stroke);

    work.upperLabel.currentLabelsFactory(/** @type {anychart.core.ui.LabelsFactory} */ (work.isSelected ? source.selectUpperLabels() : source.upperLabels()));
    work.lowerLabel.currentLabelsFactory(/** @type {anychart.core.ui.LabelsFactory} */ (work.isSelected ? source.selectLowerLabels() : source.lowerLabels()));
  } else if (goog.isDefAndNotNull(element.attr('d_crit'))) {
    var attrVal = element.attr('d_crit');
    var isCrit = (attrVal == 'true') || (attrVal === true); //Rendered and not rendered cases.
    source = isCrit ? this.criticalPath().tasks() : this.tasks();
    fill = /** @type {acgraph.vector.Fill} */ (source.dummyFill());
    stroke = /** @type {acgraph.vector.Stroke} */ (source.dummyStroke());
    /** @type {acgraph.vector.Path} */ (element).fill(fill).stroke(stroke);
  }
};


/** @inheritDoc */
anychart.charts.Pert.prototype.drawContent = function(bounds) {
  this.calculate();

  if (this.hasInvalidationState(anychart.ConsistencyState.PERT_CALCULATIONS)) {
    this.calculateActivities_();
    this.markConsistent(anychart.ConsistencyState.PERT_CALCULATIONS);
  }

  if (!this.baseLayer_) { //Dom init.
    this.baseLayer_ = this.rootElement.layer();
    this.registerDisposable(this.baseLayer_);

    this.activitiesLayer_ = new anychart.core.utils.TypedLayer(function() {
      return acgraph.path();
    }, function(child) {
      (/** @type {acgraph.vector.Path} */ (child)).clear();
      (/** @type {acgraph.vector.Path} */ (child)).attr('a_crit', null);
      (/** @type {acgraph.vector.Path} */ (child)).attr('d_crit', null);
    });
    this.activitiesLayer_.zIndex(1); //TODO (A.Kudryavtsev): hardcoded.
    this.activitiesLayer_.parent(this.baseLayer_);

    this.milestonesLayer_ = new anychart.core.utils.TypedLayer(function() {
      return acgraph.path();
    }, function(child) {
      (/** @type {acgraph.vector.Path} */ (child)).clear();
      (/** @type {acgraph.vector.Path} */ (child)).attr('m_crit', null);
    });
    this.milestonesLayer_.zIndex(2); //TODO (A.Kudryavtsev): hardcoded.
    this.milestonesLayer_.parent(this.baseLayer_);

    this.labelsLayer_ = this.baseLayer_.layer();
    this.labelsLayer_.zIndex(3); //TODO (A.Kudryavtsev): hardcoded.

    this.milestones().labelsContainer(this.labelsLayer_);
    this.criticalPath().milestones().labelsContainer(this.labelsLayer_);
    this.tasks().labelsContainer(this.labelsLayer_);
    this.criticalPath().tasks().labelsContainer(this.labelsLayer_);
  }

  if (!this.milestones().tooltip().container()) {
    this.milestones().tooltip().container(/** @type {acgraph.vector.ILayer} */(this.container()));
  }

  if (!this.tasks().tooltip().container()) {
    this.tasks().tooltip().container(/** @type {acgraph.vector.ILayer} */(this.container()));
  }

  if (!this.criticalPath().milestones().tooltip().container()) {
    this.criticalPath().milestones().tooltip().container(/** @type {acgraph.vector.ILayer} */(this.container()));
  }

  if (!this.criticalPath().tasks().tooltip().container()) {
    this.criticalPath().tasks().tooltip().container(/** @type {acgraph.vector.ILayer} */(this.container()));
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.BOUNDS)) {
    this.activitiesLayer_.clear();
    this.milestonesLayer_.clear();
    this.milestones().clearLabels();
    this.tasks().clearLabels();
    this.criticalPath().milestones().clearLabels();
    this.criticalPath().tasks().clearLabels();

    var i, j;
    var add = 0;
    var left = bounds.left;
    for (i = 0; i < this.milestonesLocation_.length; i++) {
      var milVertical = this.milestonesLocation_[i];
      if (milVertical) {
        var top = bounds.top + add;

        for (j = 0; j < milVertical.length; j++) {
          var milestone = milVertical[j];
          if (milestone) {
            var milPath = this.milestonesLayer_.genNextChild();

            switch (this.milestones().shape()) {
              case anychart.enums.MilestoneShape.RHOMBUS:
                milPath.moveTo(left, top + anychart.charts.Pert.CELL_PIXEL_SIZE_ / 2)
                    .lineTo(left + anychart.charts.Pert.CELL_PIXEL_SIZE_ / 2, top)
                    .lineTo(left + anychart.charts.Pert.CELL_PIXEL_SIZE_, top + anychart.charts.Pert.CELL_PIXEL_SIZE_ / 2)
                    .lineTo(left + anychart.charts.Pert.CELL_PIXEL_SIZE_ / 2, top + anychart.charts.Pert.CELL_PIXEL_SIZE_)
                    .close();
                break;
              case anychart.enums.MilestoneShape.RECTANGLE:
                milPath.moveTo(left, top)
                    .lineTo(left + anychart.charts.Pert.CELL_PIXEL_SIZE_, top)
                    .lineTo(left + anychart.charts.Pert.CELL_PIXEL_SIZE_, top + anychart.charts.Pert.CELL_PIXEL_SIZE_)
                    .lineTo(left, top + anychart.charts.Pert.CELL_PIXEL_SIZE_)
                    .close();
                break;
              case anychart.enums.MilestoneShape.CIRCLE:
              default:
                var radius = anychart.charts.Pert.CELL_PIXEL_SIZE_ / 2;
                milPath.moveTo(left + radius + radius, top + radius)
                    .arcTo(radius, radius, 0, 360);
            }

            milPath.attr('m_crit', !!milestone.isCritical);
            milPath.attr('m_id', milestone.id);
            milestone.relatedPath = /** @type {acgraph.vector.Path} */ (milPath);

            var labelContextProvider = this.createFormatProvider(true, void 0, void 0, milestone);
            var labelsSource = milestone.isCritical ? this.criticalPath().milestones() : this.milestones();
            var label = labelsSource.labels().add(labelContextProvider, {'value': {'x': left, 'y': top}});
            label.width(anychart.charts.Pert.CELL_PIXEL_SIZE_);
            label.height(anychart.charts.Pert.CELL_PIXEL_SIZE_);
            milestone.relatedLabel = label;

            milestone.left = left;
            milestone.top = top;

          }
          top += (anychart.charts.Pert.CELL_PIXEL_SIZE_ + anychart.charts.Pert.CELL_PIXEL_VERTICAL_SPACE_);
        }
      }
      left += (anychart.charts.Pert.CELL_PIXEL_SIZE_ + anychart.charts.Pert.CELL_PIXEL_HORIZONTAL_SPACE_);
      add += 30; //TODO (A.Kudryavtsev): :'(
    }

    for (var id in this.milestonesMap_) {
      var mil = this.milestonesMap_[id];
      for (i = 0; i < mil.successors.length; i++) {
        var succ = mil.successors[i];
        var succId = String(succ.get(anychart.enums.DataField.ID));
        var activity = this.activitiesMap_[succId];
        var succWork = this.worksMap_[succId];
        var destMilestone = succWork.finishMilestone;
        var path = this.activitiesLayer_.genNextChild();

        var isCrit = (mil.isCritical && destMilestone.isCritical && succWork.isCritical);
        var stroke = isCrit ? this.criticalPath().tasks().stroke() :
            this.tasks().stroke();

        path.stroke(stroke);
        path.attr('a_crit', isCrit);
        path.attr('w_id', succId);

        var startLeft = mil.left + anychart.charts.Pert.CELL_PIXEL_SIZE_;
        var startTop = mil.top + anychart.charts.Pert.CELL_PIXEL_SIZE_ / 2;
        var finLeft = destMilestone.left;
        var finTop = destMilestone.top + anychart.charts.Pert.CELL_PIXEL_SIZE_ / 2;


        var dWidth = (destMilestone.left - mil.left - anychart.charts.Pert.CELL_PIXEL_HORIZONTAL_SPACE_) / 2;
        //path.moveTo(startLeft, startTop)
        //    .curveTo(startLeft + dWidth, startTop, startLeft + dWidth, finTop, finLeft, finTop);

        path.moveTo(startLeft, startTop).lineTo(finLeft, finTop);


        var angle = Math.atan((finTop - startTop) / (finLeft - startLeft));
        angle = angle * 180 / Math.PI;

        var labelLeft = destMilestone.left - dWidth;
        var labelTop = (destMilestone.top + mil.top + anychart.charts.Pert.CELL_PIXEL_SIZE_) / 2;
        var labelsSource = isCrit ? this.criticalPath().tasks() : this.tasks();

        var labelContextProvider = this.createFormatProvider(true, succWork, activity, void 0);
        var upperLabel = labelsSource.upperLabels().add(labelContextProvider, {
          'value': {
            'x': labelLeft,
            'y': labelTop
          }
        });
        upperLabel.width(destMilestone.left - mil.left);
        upperLabel.height(anychart.charts.Pert.CELL_PIXEL_SIZE_);
        succWork.upperLabel = upperLabel;
        upperLabel.rotation(angle);


        var lowerLabel = labelsSource.lowerLabels().add(labelContextProvider, {
          'value': {
            'x': labelLeft,
            'y': labelTop
          }
        });
        upperLabel.width(destMilestone.left - mil.left);
        upperLabel.height(anychart.charts.Pert.CELL_PIXEL_SIZE_);
        succWork.lowerLabel = lowerLabel;
        lowerLabel.rotation(angle);

      }
    }


    for (var id in this.milestonesMap_) {
      var mil = this.milestonesMap_[id];
      for (i = 0; i < mil.mSuccessors.length; i++) {
        var mSucc = mil.mSuccessors[i];
        var path = this.activitiesLayer_.genNextChild();
        var isCrit = (mil.isCritical && mSucc.isCritical);
        path.attr('d_crit', isCrit);

        path.moveTo(mil.left + anychart.charts.Pert.CELL_PIXEL_SIZE_, mil.top + anychart.charts.Pert.CELL_PIXEL_SIZE_ / 2)
            .lineTo(mSucc.left, mSucc.top + anychart.charts.Pert.CELL_PIXEL_SIZE_ / 2);

        //var dWidth = (mSucc.left - mil.left - anychart.charts.Pert.CELL_PIXEL_HORIZONTAL_SPACE_) / 2;
        //path.moveTo(mil.left + anychart.charts.Pert.CELL_PIXEL_SIZE_, mil.top + anychart.charts.Pert.CELL_PIXEL_SIZE_ / 2)
        //    .curveTo(
        //        mil.left + anychart.charts.Pert.CELL_PIXEL_SIZE_ + dWidth,
        //        mil.top + anychart.charts.Pert.CELL_PIXEL_SIZE_ / 2,
        //        mil.left + anychart.charts.Pert.CELL_PIXEL_SIZE_ + dWidth,
        //        mSucc.top + anychart.charts.Pert.CELL_PIXEL_SIZE_ / 2,
        //        mSucc.left,
        //        mSucc.top + anychart.charts.Pert.CELL_PIXEL_SIZE_ / 2);
      }
    }

    //Colorize created DOM structure.
    this.invalidate(anychart.ConsistencyState.PERT_APPEARANCE | anychart.ConsistencyState.PERT_LABELS);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.PERT_APPEARANCE)) {
    this.milestonesLayer_.forEachChild(this.milestonesLayerAppearanceCallback_, this);
    this.activitiesLayer_.forEachChild(this.worksLayerAppearanceCallback_, this);
    this.invalidate(anychart.ConsistencyState.PERT_LABELS);
    this.markConsistent(anychart.ConsistencyState.PERT_APPEARANCE);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.PERT_LABELS)) {
    this.milestones().labels().draw();
    this.criticalPath().milestones().labels().draw();
    this.tasks().upperLabels().draw();
    this.tasks().lowerLabels().draw();
    this.criticalPath().tasks().upperLabels().draw();
    this.criticalPath().tasks().lowerLabels().draw();
    this.markConsistent(anychart.ConsistencyState.PERT_LABELS);
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

  goog.disposeAll(this.milestones(), this.tasks(), this.criticalPath());

  goog.base(this, 'disposeInternal');
};


/** @inheritDoc */
anychart.charts.Pert.prototype.serialize = function() {
  var json = goog.base(this, 'serialize');

  if (this.data_)
    json['data'] = this.data_.serializeWithoutMeta();

  json['milestones'] = this.milestones().serialize();
  json['tasks'] = this.tasks().serialize();
  json['criticalPath'] = this.criticalPath().serialize();

  return json;
};


/** @inheritDoc */
anychart.charts.Pert.prototype.setupByJSON = function(config) {
  goog.base(this, 'setupByJSON', config);

  if ('data' in config) this.data(anychart.data.Tree.fromJson(config['data']));
  if ('milestones' in config) this.milestones().setupByJSON(config['milestones']);
  if ('tasks' in config) this.tasks().setupByJSON(config['tasks']);
  if ('criticalPath' in config) this.criticalPath().setupByJSON(config['criticalPath']);

  this.expectedTimeCalculator(config['expectedTimeCalculator']);
};


//exports
anychart.charts.Pert.prototype['tasks'] = anychart.charts.Pert.prototype.tasks;
anychart.charts.Pert.prototype['milestones'] = anychart.charts.Pert.prototype.milestones;
anychart.charts.Pert.prototype['criticalPath'] = anychart.charts.Pert.prototype.criticalPath;
anychart.charts.Pert.prototype['data'] = anychart.charts.Pert.prototype.data;
anychart.charts.Pert.prototype['getType'] = anychart.charts.Pert.prototype.getType;
anychart.charts.Pert.prototype['expectedTimeCalculator'] = anychart.charts.Pert.prototype.expectedTimeCalculator;

