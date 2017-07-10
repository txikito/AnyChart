goog.provide('anychart.ui.chartEditor2.DataModel');

anychart.ui.chartEditor2.DataModel = function() {

  this.data_ = {};

  this.geoData_ = {};
};


anychart.ui.chartEditor2.DataModel.prototype.addData = function(setId, data, isGeo) {
  var container = isGeo ? this.geoData_ : this.data_;
  if (!container[setId]) {
    container[setId] = data;
  }
  console.log(container);
};


anychart.ui.chartEditor2.DataModel.prototype.removeData = function(setId, isGeo) {
  var container = isGeo ? this.geoData_ : this.data_;
  delete container[setId];
  console.log(container);
};
