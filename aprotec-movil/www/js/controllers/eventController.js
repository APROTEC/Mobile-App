angular.module('controllers.eventsController', [])
.controller('EventsCtrl', function($scope, $state, $http, $ionicPopup) {



	$scope.funcionDummy = function() {
		//Esta funcion no hace nada, es una funcion dummie para pasar por parametro a la confirmacion.
	};



	$scope.confirmacion = function(texto,funcionTrue,funcionFalse) {
	    var confirmPopup = $ionicPopup.confirm({
	      title: 'Confirmación',
	      template: texto
	    });
	    confirmPopup.then(function(respuesta) {
	      	if(respuesta) {
	      		//$scope.alerta("True");
		    	funcionTrue();
		    } else {
		    	//$scope.alerta("False");
		        funcionFalse();
		    }
	    });
	};
	$scope.eliminarInvitacionConfirmado = function(codigo_evento){
		$http.delete('http://'+ $scope.ip +':8081/usuarios_invitados/{"codigo_evento":'+ codigo_evento+',"codigo_usuario":'+$scope.codigo_usuario+'}').
		success(function(resp) {
            $scope.getEventosInvitados();
            
            
        });

	};

	$scope.eliminarInvitacion = function(codigo_evento){
		var funcionTrue = function(){$scope.eliminarInvitacionConfirmado(codigo_evento);};
		var funcionFalse = function(){$scope.funcionDummy();};
		var mensaje = "¿Estás seguro de eliminar esta invitación?"
		$scope.confirmacion(mensaje,funcionTrue,funcionFalse);

	};


	$scope.eliminarConfirmacionConfirmado = function(codigo_evento){
		$http.put('http://'+ $scope.ip +':8081/usuarios_invitados/{"codigo_evento":'+codigo_evento+',"codigo_usuario":'+$scope.codigo_usuario+',"confirmado":0,"precio_entradas":0}').
		success(function(resp) {
            $scope.getEventosInvitados();
            $scope.getEventosAAsistir();
            
            
        });

	};

	

	$scope.eliminarConfirmacion = function(codigo_evento){
		var funcionTrue = function(){$scope.eliminarConfirmacionConfirmado(codigo_evento);};
		var funcionFalse = function(){$scope.funcionDummy();};
		var mensaje = "¿Estás seguro de cancelar tu asistencia al evento?"
		$scope.confirmacion(mensaje,funcionTrue,funcionFalse);

	};

	$scope.getEventosInvitados = function(){
		$http.get('http://'+ $scope.ip +':8081/eventos/invitacion_usuario/'+ $scope.codigo_usuario).
        success(function(resp) {
            $scope.eventosInvitados = resp;
            
            
        });

	};

	$scope.getEventosAAsistir = function(){
		$http.get('http://'+ $scope.ip +':8081/eventos/confirmacion_usuario/'+ $scope.codigo_usuario).
        success(function(resp) {
            $scope.eventosAAsistir = resp;
            
            
        });

	};

	$scope.getEventosFinalizados = function(){
		$http.get('http://'+ $scope.ip +':8081/eventos/finalizados_usuario/'+ $scope.codigo_usuario).
        success(function(resp) {
            $scope.eventosFinalizados = resp;
            
            
        });

	};

	$scope.getStringFecha = function(fecha){
		return fecha.substring(0,10);
	};

	$scope.getStringHora = function(fecha){
		return fecha.substring(11,16);
	};



	$scope.ip =  "192.168.0.18";
	$scope.codigo_usuario = window.localStorage['codigo_usuario'];
	$scope.getEventosInvitados();
	$scope.getEventosAAsistir();
	$scope.getEventosFinalizados();
   
  

   	
 


});