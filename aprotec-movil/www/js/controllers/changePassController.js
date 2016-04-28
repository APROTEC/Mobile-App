angular.module('controllers.changePasswordController', [])
.controller('ChangePasswCtrl', function($scope, $state, $http, $ionicPopup) {

	$scope.data = {};
	$scope.codigoUsuario = window.localStorage['codigo_usuario'];
	$scope.IP = window.localStorage['direccionIpPuerto'];
 
 	$scope.cambiarContrasena = function(){
    	
    	var pass1 = $scope.data.password1
    	var pass2 = $scope.data.password2

    	//alert(pass1);
    	//alert(pass2);
    	//alert($scope.codigoUsuario);

    	if((pass1 != undefined) && (pass2 != undefined)){//Hay texto escrito en ambas cajas de texto
	    	if(pass1.localeCompare(pass2) == 0 ){ //Los passwords coindicen
	    		$scope.cambiarContrasenaEnBD(pass1);
	    	} else { //Los passwords no coinciden
	    		//alert('Passwords no coinciden');
				var alertPopupIncoincidencias = $ionicPopup.alert({
			    	title: 'Ha Habido Un Problema',
			    	template: 'Las contraseñas que ingresaste no coinciden, porfavor vuelve a escribirlas'
			    });
	    	}
	    } else { //El usuario no ha dejado alguna opcion en blanco
	    	var alertPopupOpcionBlanco = $ionicPopup.alert({
			    title: 'Ha Habido Un Problema',
			    template: 'Dejaste algun espacio en blanco, porfavor completa ambos espacios'
			});
	    }

    };


    $scope.cambiarContrasenaEnBD = function(newPassword){

    	$http.put('http://'+ $scope.IP +':8081/usuarios/cambiar_contrasena/'+ $scope.codigoUsuario + '-' + newPassword).
        success(function(resp) {
        	
        	var alertPopupCoincidencia = $ionicPopup.alert({
		    	title: 'Cambio exitoso',
		    	template: 'Tu contraseña ha sido cambiada exitosamente'
			});
        	alertPopupCoincidencia.then(function(res) {
		    	$state.transitionTo("tab.account", "");
		    });

        });
    };

    $scope.regresar = function(){
    	$state.transitionTo("tab.account", "");
    };

});