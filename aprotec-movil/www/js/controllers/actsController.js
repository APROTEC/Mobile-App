angular.module('controllers.actsController', ['ngCordova'])
.controller('ActsCtrl', function($scope, $state, $http, $ionicPopup, $cordovaFileOpener2) {

	$scope.ip = window.localStorage['direccionIpPuerto'];
	$scope.codigo_usuario = window.localStorage['codigo_usuario'];
	$scope.listaActas = [];


	$scope.funcionDummy = function() {
		//Esta funcion no hace nada, es una funcion dummie para pasar por parametro a la confirmacion.
	};



  $scope.abrirBrowser = function(link) {
    //console.log(link);
   	//window.open('http://' + link);

            $cordovaFileOpener2.open(
    'http://www.agirregabiria.net/g/sylvainaitor/principito.pdf',
    'application/pdf'
  ).then(function() {
      // file opened successfully
  }, function(err) {
      // An error occurred. Show a message to the user
  });


  };

  $scope.getActas = function(){
		$http.get('http://'+ $scope.ip +':8081/actas_usuarios/usuario/' + $scope.codigo_usuario).
        success(function(resp) {
        	$scope.listaActas = resp;
        });
	};

 	$scope.eliminarActaDeUsuario = function(codigoActa) {
 		$http.delete('http://'+ $scope.ip +':8081/actas_usuarios/' + codigoActa + '-' + $scope.codigo_usuario).
      success(function(resp) {
          console.log('Eliminacion exitosa');
          $scope.getActas();
      });
 	};
   	
  $scope.getActas();

});