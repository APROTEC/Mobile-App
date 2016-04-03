angular.module('controllers.eventsDetailsController', [])
.controller('EventsDetailsCtrl', function($scope, $state, $http, $ionicPopup,$stateParams) {
	$scope.ip = '192.168.0.18';
	$scope.getEvento = function(){
		$http.get('http://'+ $scope.ip +':8081/eventos/'+ $scope.codigo_evento).
        success(function(resp) {
            $scope.evento = resp[0];
            $scope.getTipoEvento();
            
            
        });

	} ;

	$scope.getTipoEvento = function(){
		$http.get('http://'+ $scope.ip +':8081/tipos_eventos/'+ $scope.evento.codigo_tipo_evento).
        success(function(resp) {
            $scope.tipo_evento = resp[0];
          
            
            
        });

	} ;


	$scope.getStringFecha = function(fecha){
		return fecha.substring(0,10);
	};

	$scope.getStringHora = function(fecha){
		return fecha.substring(11,16);
	};

	$scope.confirmarAsistencia = function(){
		$http.put('http://'+ $scope.ip +':8081/usuarios_invitados/{"codigo_evento":'+$scope.evento.codigo_evento+',"codigo_usuario":'+$scope.codigo_usuario+',"confirmado":1,"precio_entradas":0}').
		success(function(resp) {
          
            $scope.confirmado = false;
            
            
        });
	};

	$scope.confirmado = true;

	$scope.codigo_usuario = window.localStorage['codigo_usuario'];
	$scope.codigo_evento = $stateParams.codigo_evento;
	$scope.opcion = $stateParams.confirm;
	$scope.confirmado =($scope.opcion=="1"?false:true); 
	$scope.getEvento();

	
   
  



   	
 


});