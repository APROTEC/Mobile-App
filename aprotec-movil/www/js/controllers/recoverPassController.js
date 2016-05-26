angular.module('controllers.recoverPasswordController', [])
.controller('RecoverPasswCtrl', function($scope, $state, $http, $ionicPopup) {

	$scope.data = {};
	$scope.codigoUsuario = window.localStorage['codigo_usuario'];
	$scope.IP = window.localStorage['direccionIpPuerto'];
 
 	$scope.recuperarContrasena = function(){

 		//var username = $scope.data.nombreDeUsuario;
        console.log($scope.data);
 		$http.get('http://'+ $scope.IP +'/usuario_valido/'+ $scope.data.username).
        	success(function(resp) {
        		var existeUsuario = resp; //Debe ser un 0 o 1
        		if(existeUsuario){
        			$scope.enviarCorreoRecuperacion($scope.data.username);
        		} else {
        			$ionicPopup.alert({
			    		title: 'Ha habido un problema',
			    		template: 'El usuario que ingresaste no existe, verifícalo y vuelve a intentar'
			    	});
        		}
      		});
    };


    $scope.enviarCorreoRecuperacion = function(username){

    	$http.post('http://'+ $scope.IP +'/usuarios/recuperar_contrasena/'+ username).
        success(function(resp) {
        	
        	var alertPopupRecuperacion = $ionicPopup.alert({
		    	title: 'Correo de recuperación enviado',
			    template: 'Revisa tu correo electrónico para recuperar tu contraseña'
			});
        	alertPopupRecuperacion.then(function(res) {
		    	$state.transitionTo("login", "");
		    });

        });
    };

    $scope.regresar = function(){
    	$state.transitionTo("login", "");
    };

});