
anychart.onDocumentReady(function() {
  //var treeData = anychart.data.tree(data, anychart.enums.TreeFillingMethod.AS_TABLE);
  var treeData = anychart.data.tree(data, anychart.enums.TreeFillingMethod.AS_TABLE, deps);
  console.log(treeData.serialize());
  chart = anychart.pert();
  chart.container('container');
  chart.title('Pert 1');
  chart.bounds(0, 0, '100%', '100%');
  chart.data(treeData);

  chart.draw();
});

//var data = [
//  {id: 2, name: 'Item 2', dependsOn: [0, 1]},
//  {id: 0, name: 'Item 0'},
//  {id: 1, name: 'Item 1'},
//  {id: 3, name: 'Item 3', dependsOn: [2]},
//  {id: 4, name: 'Item 4', dependsOn: [2]}
//];


var data = [
  {id: 2, duration: 1, name: 'Item 2', dependsOn: [0, 1]},
  {id: 0, duration: 1, name: 'Item 0'},
  {id: 1, duration: 1, name: 'Item 1'},
  {id: 3, duration: 1, name: 'Item 3', dependsOn: [2]},
  {id: 4, duration: 1, name: 'Item 4', dependsOn: [2]}
];

var deps = [
  {from: 0, to: 2},
  {from: 1, to: 2},
  {from: 2, to: 3},
  {from: 2, to: 4}
];

