app.config(function($stateProvider) {

  $stateProvider
    .state('businessManagement.finance.assets', {
      url: "/assets",
      views: {
        "": {
          templateUrl: '/static/ngTemplates/app.finance.assets.html',
          controller: 'businessManagement.finance.assets'
        }
      }
    })

});
app.controller('businessManagement.finance.assets.item', function($scope, $http, $aside, $state, Flash, $users, $filter, $permissions) {


})

app.controller('businessManagement.finance.assets.form', function($scope, $http, $aside, $state, Flash, $users, $filter, $permissions) {

  $scope.resetForm = function() {
    $scope.form = {
      purchaseDate: new Date(),
      name: "",
      orginalCost: 0,
      depreciationRate: 0,
      depreciationValue: 0,
      presentVal: 0
    }
  }


  if ($scope.tab == undefined) {
    $scope.mode = 'new';
    $scope.resetForm();
  } else {
    $scope.mode = 'edit';
    $scope.asset = $scope.tab.data.asset;
    $scope.form = $scope.asset;

    $scope.form.purchaseDate = new Date($scope.form.purchaseDate)

  }

  $scope.save = function() {
    var f = $scope.form;

    if (f.name.length == "") {
      Flash.create('warning', 'name can not be empty')
      return;
    };
    if (f.purchaseDate == 0) {
      Flash.create('warning', 'Date can not be empty')
      return;
    };
    if (f.orginalCost == 0) {
      Flash.create('warning', 'cost can not be zero')
      return;
    };
    if (f.depreciationRate == 0) {
      Flash.create('warning', 'rate can not be zero')
      return;
    };
    if (f.depreciationValue == 0) {
      Flash.create('warning', 'value can not be zero')
      return;
    };
    if (f.presentVal == 0) {
      Flash.create('warning', 'present value Cost can not be zero')
      return;
    };


    var toSend = {
      name: f.name,
      purchaseDate: f.purchaseDate.toJSON().split('T')[0],
      orginalCost: f.orginalCost,
      depreciationRate: f.depreciationRate,
      depreciationValue: f.depreciationValue,
      presentVal: f.presentVal

    }

    var method = 'POST';
    var url = '/api/finance/asset/'
    if ($scope.mode == 'edit') {
      method = 'PATCH';
      url += $scope.asset.pk + '/';
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
  // settings main page controller

})


app.controller('businessManagement.finance.assets', function($scope, $http, $aside, $state, Flash, $users, $filter, $permissions) {
  // settings main page controller

  $scope.data = {
    tableData: []
  };

  views = [{
    name: 'list',
    icon: 'fa-th-large',
    template: '/static/ngTemplates/genericTable/genericSearchList.html',
    itemTemplate: '/static/ngTemplates/app.finance.assets.item.html',
  }, ];

  var options = {
    main: {
      icon: 'fa-pencil',
      text: 'edit'
    },
  };

  $scope.config = {
    views: views,
    url: '/api/finance/asset/',
    searchField: 'item',
    itemsNumPerView: [12, 24, 48],
  }


  $scope.tableAction = function(target, action, mode) {
    console.log(target, action, mode);
    console.log($scope.data.tableData);

    if (action == 'edit') {
      for (var i = 0; i < $scope.data.tableData.length; i++) {
        if ($scope.data.tableData[i].pk == parseInt(target)) {
          $scope.addTab({
            title: 'Edit Asset : ' + $scope.data.tableData[i].pk,
            cancel: true,
            app: 'editAsset',
            data: {
              pk: target,
              asset: $scope.data.tableData[i]
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
