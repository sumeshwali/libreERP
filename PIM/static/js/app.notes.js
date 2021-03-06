app.controller("controller.home.notes", function($scope , $state , $users ,  $stateParams , $http , Flash) {
  $scope.me = $users.get('mySelf');
  $scope.editor = {pencil : false}
  $scope.canvas = new fabric.Canvas('canvas');
  $scope.canvas.selection = true;
  $scope.canvas.isDrawingMode = false;
  $scope.fontName = 'Times New Roman';
  $scope.bookInView = -1;
  $scope.pageInView = -1;
  $scope.notebooks = [];
  var flag1 = true;
  var flag2 = true;
  var flag3 = true;

  $scope.$watch('fontName', function(newValue , oldValue) {
    var selectedObj = $scope.fontName;
    selectedObj.fontFamily = newValue;
  });

  //var temp = false;
  $scope.$watch('bookInView' , function(newValue , oldValue){
    if (newValue != -1) {
      if ($scope.notebooks[newValue].pages.length == 0) {
        dataToSend =  {
          source : 'blank',
          parent : $scope.notebooks[newValue].pk,
          title : 'untitled',
          user : $scope.me.pk,
        }
        $http({ method : 'POST' , url : '/api/PIM/page/' , data : dataToSend }).
        then(function(response){
          $scope.pageInView = 0;
          $scope.data = response.data;
        })
      } else {
        $scope.pageInView = 0;
        $scope.getPage();
      }
    }
  });

  $http({ method : 'GET' , url : '/api/PIM/notebook/'}).
  then(function(response){
    $scope.notebooks = response.data;
    if (response.data.length != 0) {
      $scope.bookInView = 0;
    } else{
      dataToSend = {
        user : $scope.me.pk,
        title : 'untitled',
      }
      $http({ method : 'POST' , url : '/api/PIM/notebook/' , data : dataToSend }).
      then(function(response){
        $scope.notebooks.push(response.data);
        $scope.bookInView = 0;
      })
    }
  })

  $scope.getPage = function(){
    $http({ method : 'GET' , url : '/api/PIM/page/' +$scope.notebooks[$scope.bookInView].pages[$scope.pageInView] + '/'}).
    then(function(response){
      $scope.data = response.data;
      $scope.canvas.loadFromJSON($scope.data.source , $scope.canvas.renderAll.bind($scope.canvas) );
    })
  }

  $scope.changeNotebook = function(index){
    $scope.bookInView = index;
  }

  $scope.changePage = function(index){
    $scope.pageInView = index;
    $scope.getPage();
  }

  $scope.save = function(){
    dataToSend = {
      source : JSON.stringify($scope.canvas),
      parent : $scope.notebooks[$scope.bookInView].pk,
      title : $scope.data.title,
      user : $scope.me.pk,
    }
    $http({ method : 'PATCH' , url : '/api/PIM/page/' + $scope.data.pk + '/', data : dataToSend }).
    then(function(response){
      Flash.create('success' , response.status + ' : ' + response.statusText);
    }, function(response){
      Flash.create('danger' , response.status + ' : ' + response.statusText);
    })
  }

  $scope.pencil = function(){
    $scope.canvas.isDrawingMode = !$scope.canvas.isDrawingMode;
    $scope.editor.pencil = !$scope.editor.pencil;
  }

  $scope.clearAll = function(){
    $scope.canvas.clear().renderAll();
  }

  $scope.addText = function(e){
    // console.log("will add text");
    newText = new fabric.IText('', {
      fontFamily: 'arial black',
      left: e.layerX,
      top: e.layerY ,
      fontSize:14,
    });
    $scope.canvas.add(newText);
    $scope.canvas.setActiveObject(newText);
    newText.enterEditing();
    newText.hiddenTextarea.focus();

  }

  $scope.canvas.on('object:selected',function(e){

    obj = e.target;
    console.log(obj);
    flag1 = false;
      if(obj.get('type') == "i-text"){
      $scope.showTextOptions = true;
  }
  else
    $scope.showTextOptions = false;
  $scope.showDeleteOption = true;
  });
  $scope.canvas.on('selection:cleared',function(e){
    flag1 = true;
    $scope.showTextOptions = false;
    $scope.showDeleteOption = false;
  });

  $scope.canvas.on('mouse:down', function(options) {

    if (!$scope.canvas.isDrawingMode && flag1==true){
      console.log(options.e);
      $scope.addText(options.e);
      $scope.showTextOptions = false;
      $scope.showDeleteOption = false;
    }
  });

  window.addEventListener('resize', resizeCanvas, false);

  function resizeCanvas() {
    $scope.canvas.setHeight(window.innerHeight*0.75);
    $scope.canvas.setWidth(window.innerWidth*0.88);
    $scope.canvas.renderAll();
  }

  // resize on init
  resizeCanvas();

  $scope.showTextOptions = false;
  $scope.showDeleteOption = false;
  $scope.canvas.on('object:moving', function (e) {
    var obj = e.target;

    console.log(obj);
     // if object is too big ignore
    if(obj.currentHeight > obj.canvas.height || obj.currentWidth > obj.canvas.width){
      return;
    }
    obj.setCoords();
    // top-left  corner
    if(obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0){
      obj.top = Math.max(obj.top, obj.top-obj.getBoundingRect().top);
      obj.left = Math.max(obj.left, obj.left-obj.getBoundingRect().left);

    }
    // bot-right corner
    if(obj.getBoundingRect().top+obj.getBoundingRect().height  > obj.canvas.height || obj.getBoundingRect().left+obj.getBoundingRect().width  > obj.canvas.width){
      obj.top = Math.min(obj.top, obj.canvas.height-obj.getBoundingRect().height+obj.top-obj.getBoundingRect().top);
      obj.left = Math.min(obj.left, obj.canvas.width-obj.getBoundingRect().width+obj.left-obj.getBoundingRect().left);
    }
    //temp = true;
  });


  $scope.addImage = function() {
    fabric.Image.fromURL('/static/images/brandLogo.jpg', function(img) {
      img.scale(0.5).set({
        left: 100,
        top: 100,
        angle: -15,
      });
      $scope.canvas.add(img).setActiveObject(img);
    });
  }

//text options

$scope.bold = function() {
  if(obj.fontWeight == 'normal'){
      obj.fontWeight = 'bold';
   }
   else {
     obj.fontWeight = 'normal';
   }
 }
$scope.italic = function(){
    if(obj.fontStyle == 'normal'){
      obj.fontStyle = 'italic';
    }
    else {
      obj.fontStyle = 'normal';
    }
  }
  $scope.underline = function(){
    if(obj.textDecoration == 'normal'){
      obj.textDecoration = 'underline';
    }
    else {
      obj.textDecoration = 'normal';
    }
  }
  $scope.rightalign = function(){
    if(obj.textAlign == 'left'){
      obj.textAlign = 'right';
    }
    else if (obj.textAlign == 'center') {
      obj.textAlign = 'right';
    }
  }
  $scope.leftalign = function(){
    if(obj.textAlign == 'right'){
      obj.textAlign = 'left';
    }
    else if (obj.textAlign == 'center') {
      obj.textAlign = 'left';
    }
  }
  $scope.centeralign = function(){
    if(obj.textAlign == 'right'){
      obj.textAlign = 'center';
    }
    else if (obj.textAlign == 'left') {
      obj.textAlign = 'center';
    }
  }
  $scope.fontincrease = function(){
    obj.fontSize += 1;
    if(1){
      console.log(obj.fontSize);
    return;
    }
  }
  $scope.fontdecrease = function(){
    obj.fontSize -= 1;
  }

//delete selection

$scope.delete = function() {
if($scope.canvas.getActiveGroup()){
    $scope.canvas.getActiveGroup().forEachObject(function(o){ $scope.canvas.remove(o) });
    $scope.canvas.discardActiveGroup().renderAll();
  } else {
    $scope.canvas.remove($scope.canvas.getActiveObject());
  }
}

//chage  fontFamily
$scope.changefont = function(){
  obj.fontFamily = $scope.fontName;
}
});
