
var data = [
  {id: 'A', duration: 3, name: 'A'},
  {id: 'B', duration: 2, name: 'B'},
  {id: 'C', duration: 10, name: 'C'},
  {id: 'D', duration: 2, name: 'D'},
  {id: 'E', duration: 4, name: 'E'},
  {id: 'F', duration: 5, name: 'F'},
  {id: 'G', duration: 2, name: 'G'},
  {id: 'H', duration: 1, name: 'H'},
  {id: 'I', duration: 7, name: 'I'}
];

var deps = [
  {from: 'A', to: 'F'},
  {from: 'B', to: 'F'},
  {from: 'C', to: 'F'},
  {from: 'D', to: 'G'},
  {from: 'E', to: 'G'},
  {from: 'F', to: 'H'},
  {from: 'F', to: 'I'},
  {from: 'G', to: 'I'}
];


anychart.onDocumentReady(function() {
  var treeData = anychart.data.tree(data, anychart.enums.TreeFillingMethod.AS_TABLE, deps);
  chart = anychart.pert();
  chart.container('container');
  chart.title('Pert 1');
  chart.bounds(0, 0, '100%', '100%');
  chart.data(treeData);

  chart.draw();

  //recalc();
});




//var data = [
//  {id: 2, name: 'Item 2', dependsOn: [0, 1]},
//  {id: 0, name: 'Item 0'},
//  {id: 1, name: 'Item 1'},
//  {id: 3, name: 'Item 3', dependsOn: [2]},
//  {id: 4, name: 'Item 4', dependsOn: [2]}
//];


//var data = [
//  {id: 2, duration: 1, name: 'Item 2', dependsOn: [0, 1]},
//  {id: 0, duration: 1, name: 'Item 0'},
//  {id: 1, duration: 1, name: 'Item 1'},
//  {id: 3, duration: 1, name: 'Item 3', dependsOn: [2]},
//  {id: 4, duration: 1, name: 'Item 4', dependsOn: [2]}
//];
//
//var deps = [
//  {from: 0, to: 2},
//  {from: 1, to: 2},
//  {from: 2, to: 3},
//  {from: 2, to: 4}
//];
//




