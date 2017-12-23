app.config(function($stateProvider){

  $stateProvider
  .state('businessManagement.finance.loans', {
    url: "/loans",
    views: {
       "": {
          templateUrl: '/static/ngTemplates/app.finance.loans.html',
          controller : 'businessManagement.finance.loans'
       }
    }
  })

});

app.controller('businessManagement.finance.loans.item' , function($scope , $http , $aside , $state, Flash , $users , $filter , $permissions){


})

app.controller('businessManagement.finance.loans.form' , function($scope , $http , $aside , $state, Flash , $users , $filter , $permissions){

  $scope.resetForm = function() {
    $scope.form = {endDate : new Date(), lender : "" , interestRate : 0 , amount : 0 }
  }

  if ($scope.tab ==  undefined) {
    $scope.mode = 'new';
    $scope.resetForm();
  }else{
    $scope.mode = 'edit';
    $scope.loan = $scope.tab.data.loan;
    $scope.form = $scope.loan;

    $scope.form.endDate = new Date($scope.form.endDate)

  }

  $scope.save = function() {
    var f = $scope.form;

    if (f.lender.length == 0) {
      Flash.create('warning' , 'lender can not be empty')
      return;
    };
    if (f.endDate == 0) {
      Flash.create('warning' , 'Date can not be empty')
      return;
    };
    if (f.interestRate == 0) {
      Flash.create('warning' , 'interest can not be zero')
      return;
    };
    if (f.amount == 0) {
      Flash.create('warning' , 'Amount can not be zero')
      return;
    };
    var toSend = {
      lender : f.lender,
      endDate: f.endDate.toJSON().split('T')[0],
      interestRate : f.interestRate,
      amount : f.amount
    }

    var method = 'POST';
    var url = '/api/finance/loan/'
    if ($scope.mode == 'edit') {
      method = 'PATCH';
      url += $scope.loan.pk + '/';
    }

    $http({method : method , url : url , data : toSend}).
    then(function(response) {
      Flash.create('success' , 'Saved');
      console.log(response.data);
      if ($scope.mode == 'new') {
        $scope.resetForm();
      }
    })
  }
  //

})

app.controller('businessManagement.finance.loans' , function($scope , $http , $aside , $state, Flash , $users , $filter , $permissions){
  // settings main page controller

  $scope.data = {tableData : []};

  views = [{name : 'list' , icon : 'fa-th-large' ,
      template : '/static/ngTemplates/genericTable/genericSearchList.html' ,
      itemTemplate : '/static/ngTemplates/app.finance.loans.item.html',
    },
  ];

  var options = {
    main : {icon : 'fa-pencil', text: 'edit'} ,
    };

  $scope.config = {
    views : views,
    url : '/api/finance/loan/',
    searchField: 'lender',
    itemsNumPerView : [12,24,48],
  }


  $scope.tableAction = function(target , action , mode){
    console.log(target , action , mode);
    console.log($scope.data.tableData);

    if (action == 'edit') {
      for (var i = 0; i < $scope.data.tableData.length; i++) {
        if ($scope.data.tableData[i].pk == parseInt(target)){
          // i clicked this $scope.data.tableData[i]
          $scope.addTab({title : 'Edit loan : ' + $scope.data.tableData[i].pk , cancel : true , app : 'editLoan' , data : {pk : target, loan : $scope.data.tableData[i]} , active : true})
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
