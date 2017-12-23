app.config(function($stateProvider) {

  $stateProvider
    .state('businessManagement.finance.rawmaterial', {
      url: "/rawmaterial",
      views: {
        "": {
          templateUrl: '/static/ngTemplates/app.finance.rawmaterial.html',
          controller: 'businessManagement.finance.rawmaterial'
        }
      }
    })

});
app.controller('businessManagement.finance.rawmaterial.item', function($scope, $http, $aside, $state, Flash, $users, $filter, $permissions) {


})


app.controller('businessManagement.finance.rawmaterial.form', function($scope, $http, $aside, $state, Flash, $users, $filter, $permissions) {
  // settings main page controller

  $scope.resetForm = function() {
    $scope.form = {
      PurchaseOrderDate: new Date(),
      PONum: 0,
      quality: "",
      supplier: "",
      received: 0,
      landedcost: 0
    }
  }

  if ($scope.tab == undefined) {
    $scope.mode = 'new';
    $scope.resetForm();
  } else {
    $scope.mode = 'edit';
    $scope.rawmaterial = $scope.tab.data.rawmaterial;
    $scope.form = $scope.rawmaterial;

    $scope.form.PODate = new Date($scope.form.PODate)

  }

  $scope.save = function() {
    var f = $scope.form;

    if (f.PONum == 0) {
      Flash.create('warning', 'Number can not be zero')
      return;
    };
    if (f.PurchaseOrderDate == 0) {
      Flash.create('warning', 'Date can not be empty')
      return;
    };
    if (f.quality.length == 0) {
      Flash.create('warning', 'Quality can not be zero')
      return;
    };
    if (f.supplier.length == 0) {
      Flash.create('warning', 'Supplier can not be zero')
      return;
    };
    if (f.received == 0) {
      Flash.create('warning', 'Received can not be zero')
      return;
    };
    if (f.landedcost == 0) {
      Flash.create('warning', 'Landed Cost can not be zero')
      return;
    };

    console.log(f);

    var toSend = {
      purchaseOrderNumber: f.PONum,
      PurchaseOrderDate: f.PurchaseOrderDate.toJSON().split('T')[0],
      quality: f.quality,
      supplier: f.supplier,
      received: f.received,
      landedCostPerUnit: f.landedcost,

    }

    var method = 'POST';
    var url = '/api/finance/rawmaterial/'
    if ($scope.mode == 'edit') {
      method = 'PATCH';
      url += $scope.rawmaterial.pk + '/';
    }

    $http({
      method: method,
      url: url,
      data: toSend
    }).
    then(function(response) {
      Flash.create('success', 'Saved');
      console.log(response.data);
      if ($scope.mode == 'new') {
        $scope.resetForm();
      }
    })
  }
})
app.controller('businessManagement.finance.rawmaterial', function($scope, $http, $aside, $state, Flash, $users, $filter, $permissions) {
  // settings main page controller

  $scope.data = {
    tableData: []
  };

  views = [{
    name: 'list',
    icon: 'fa-th-large',
    template: '/static/ngTemplates/genericTable/genericSearchList.html',
    itemTemplate: '/static/ngTemplates/app.finance.rawmaterial.item.html',
  }, ];

  var options = {
    main: {
      icon: 'fa-pencil',
      text: 'edit'
    },
  };

  $scope.config = {
    views: views,
    url: '/api/finance/rawmaterial/',
    searchField: 'POnumber',
    itemsNumPerView: [12, 24, 48],
  }


  $scope.tableAction = function(target, action, mode) {
    console.log(target, action, mode);
    console.log($scope.data.tableData);

    if (action == 'edit') {
      for (var i = 0; i < $scope.data.tableData.length; i++) {
        if ($scope.data.tableData[i].pk == parseInt(target)) {
          $scope.addTab({
            title: 'Edit Raw Material : ' + $scope.data.tableData[i].pk,
            cancel: true,
            app: 'editRawmaterial',
            data: {
              pk: target,
              rawmaterial: $scope.data.tableData[i]
            },
            active: true
          })
        }
      }
    }

  }

  $scope.tabs = [];
  $scope.searchTabActive = true;

  $scope.closeTab = function(index) {
    $scope.tabs.splice(index, 1)
  }

  $scope.addTab = function(input) {
    console.log(JSON.stringify(input));
    $scope.searchTabActive = false;
    alreadyOpen = false;
    for (var i = 0; i < $scope.tabs.length; i++) {
      if ($scope.tabs[i].data.pk == input.data.pk && $scope.tabs[i].app == input.app) {
        $scope.tabs[i].active = true;
        alreadyOpen = true;
      } else {
        $scope.tabs[i].active = false;
      }
    }
    if (!alreadyOpen) {
      $scope.tabs.push(input)
    }
  }
})
