app.config(function($stateProvider){

  $stateProvider
  .state('businessManagement.finance.outflow', {
    url: "/outflow",
    views: {
       "": {
          templateUrl: '/static/ngTemplates/app.finance.outflow.html',
          controller : 'businessManagement.finance.outflow'
       }
    }
  })

});

app.controller('businessManagement.finance.outflow.item' , function($scope , $http , $aside , $state, Flash , $users , $filter , $permissions){


})


app.controller('businessManagement.finance.outflow.form' , function($scope , $http , $aside , $state, Flash , $users , $filter , $permissions){
  // settings main page controller
  $scope.resetForm = function() {
    $scope.form = {date : new Date() , amount : 0 , select : ""}
  }

  if ($scope.tab ==  undefined) {
    $scope.mode = 'new';
    $scope.resetForm();
  }else{
    $scope.mode = 'edit';
    $scope.outflow = $scope.tab.data.outflow;
    $scope.form = $scope.outflow;

    $scope.form.date = new Date($scope.form.date)

  }
  $scope.save = function() {
    var f = $scope.form;
    if (f.amount == 0 && f.amount < 0) {
      Flash.create('warning' , 'amount should be zero')
      return;
    };
    if (f.date == 0) {
      Flash.create('warning' , 'Date can not be empty')
      return;
    };
    if (f.select.length == "") {
      Flash.create('warning' , 'Please select any option')
      return;
    };
    var toSend = {
      select : f.select ,
      amount : f.amount,
      date: f.date.toJSON().split('T')[0]
    }

    var method = 'POST';
    var url = '/api/finance/outflow/'
    if ($scope.mode == 'edit') {
      method = 'PATCH';
      url += $scope.outflow.pk + '/';
    }

    $http({method : method , url : url , data : toSend}).
    then(function(response) {
      Flash.create('success' , 'Saved');
      if ($scope.mode == 'new'){
      $scope.resetForm();
    }
    })
  }
})


app.controller('businessManagement.finance.outflow' , function($scope , $http , $aside , $state, Flash , $users , $filter , $permissions){
    $scope.data = {tableData : []};
    views = [{name : 'list' , icon : 'fa-th-large' ,
        template : '/static/ngTemplates/genericTable/genericSearchList.html' ,
        itemTemplate : '/static/ngTemplates/app.finance.outflow.item.html',
      },
    ];
    var options = {
      main : {icon : 'fa-pencil', text: 'edit'} ,
      };
    $scope.config = {
      views : views,
      url : '/api/finance/outflow/',
      searchField: 'title',
      itemsNumPerView : [12,24,48],
    }
    $scope.tableAction = function(target , action , mode){
      console.log(target , action , mode);
      console.log($scope.data.tableData);

      if (action == 'edit') {
        for (var i = 0; i < $scope.data.tableData.length; i++) {
          if ($scope.data.tableData[i].pk == parseInt(target)){
            $scope.addTab({title : 'Edit Sales : ' + $scope.data.tableData[i].pk , cancel : true , app : 'editSales' , data : {pk : target, outflow : $scope.data.tableData[i]} , active : true})
          }
        }
      }
    }
    $scope.tabs = [];
    $scope.searchTabActive = true;

    $scope.closeTab = function(index){
      $scope.tabs.splice(index , 1)
    }

    $scope.addTab = function( input ){
        console.log(JSON.stringify(input));
      $scope.searchTabActive = false;
      alreadyOpen = false;
      for (var i = 0; i < $scope.tabs.length; i++) {
        if ($scope.tabs[i].data.pk == input.data.pk && $scope.tabs[i].app == input.app) {
          $scope.tabs[i].active = true;
          alreadyOpen = true;
        }else{
          $scope.tabs[i].active = false;
        }
      }
      if (!alreadyOpen) {
        $scope.tabs.push(input)
      }
    }

})
