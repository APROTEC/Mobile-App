angular.module('controllers.formsController', ['ngCordova'])
.controller('FormsCtrl', function($scope, $state, $http, $ionicPopup, $cordovaLaunchNavigator) {

	$scope.ip = window.localStorage['direccionIpPuerto'];
	$scope.codigo_usuario = window.localStorage['codigo_usuario'];
	$scope.listaEncuestas = [];


	$scope.funcionDummy = function() {
		//Esta funcion no hace nada, es una funcion dummie para pasar por parametro a la confirmacion.
	};

  $scope.abrirBrowser = function(link) {
    //console.log(link);
   	//window.open('http://' + link);
    /*var destination = [latitude, longitude];
    var start = 'http://' + link;

    var alertPopupIncoincidencias = $ionicPopup.alert({
                                      title: 'OPEN',
                                      template: 'Destino: ' + destination + 'Start' + start;
                                    });

    $cordovaLaunchNavigator.navigate(destination, start);*/
  };

  $scope.getEncuestas = function(){
		$http.get('http://'+ $scope.ip +':8081/encuestas_usuarios/usuario/' + $scope.codigo_usuario).
        success(function(resp) {
        	$scope.listaEncuestas = resp;
        });
	};

 	$scope.eliminarEncuestaDeUsuario = function(codigoEncuesta) {
 		$http.delete('http://'+ $scope.ip +':8081/encuestas_usuarios/' + codigoEncuesta + '-' + $scope.codigo_usuario).
      success(function(resp) {
          console.log('Eliminacion exitosa');
          $scope.getEncuestas();
      });
 	};
   	
  $scope.getEncuestas();

});