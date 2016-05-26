angular.module('controllers.formsController', [])
.controller('FormsCtrl', function($scope, $state, $http, $ionicPopup,$cordovaInAppBrowser) {

	$scope.ip = window.localStorage['direccionIpPuerto'];
	$scope.codigo_usuario = window.localStorage['codigo_usuario'];
	$scope.listaEncuestas = [];


	$scope.funcionDummy = function() {
		//Esta funcion no hace nada, es una funcion dummie para pasar por parametro a la confirmacion.
	};

  $scope.abrirBrowser = function(link) {
    alert(link);
    var options = {
      location: 'yes',
      clearcache: 'yes',
      toolbar: 'no'
    };

  
    $cordovaInAppBrowser.open(link, options)
      .then(function(event) {
        // success
      })
      .catch(function(event) {
        alert('Hubo un error al abrir la encuesta');
        
      });
  };
  

  $scope.getEncuestas = function(){
		$http.get('http://'+ $scope.ip +'/encuestas_usuarios/usuario/' + $scope.codigo_usuario).
        success(function(resp) {
        	$scope.listaEncuestas = resp;
        });
	};

 	$scope.eliminarEncuestaDeUsuario = function(codigoEncuesta) {
 		$http.delete('http://'+ $scope.ip +'/encuestas_usuarios/' + codigoEncuesta + '-' + $scope.codigo_usuario).
      success(function(resp) {
          console.log('Eliminacion exitosa');
          $scope.getEncuestas();
      });
 	};
   	
  $scope.getEncuestas();

});