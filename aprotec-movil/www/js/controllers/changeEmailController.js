angular.module('controllers.changeEmailController', [])
.controller('ChangeEmailCtrl', function($scope, $state, $http, $ionicPopup) {

	$scope.data = {};
	$scope.codigoUsuario = window.localStorage['codigo_usuario'];
	$scope.IP = window.localStorage['direccionIpPuerto'];

	$scope.persona = JSON.parse(window.localStorage['info_persona']);
	$scope.codigoPersona = window.localStorage['codigo_info_persona'];
 
 	$scope.cambiarCorreo = function(){
    	
    	var correo1 = $scope.data.email1
    	var correo2 = $scope.data.email2

    	if((correo1 != undefined) && (correo2 != undefined)){//Hay texto escrito en ambas cajas de texto
	    	if(correo1.localeCompare(correo2) == 0 ){ //Los correos coindicen
	    		$scope.cambiarCorreoEnBD(correo1);
	    	} else { //Los correos no coinciden
				var alertPopupIncoincidencias = $ionicPopup.alert({
			    	title: 'Ha Habido Un Problema',
			    	template: 'Los correos que ingresaste no coinciden, porfavor vuelve a escribirlos'
			    });
	    	}
	    } else { //El usuario no ha dejado alguna opcion en blanco
	    	var alertPopupOpcionBlanco = $ionicPopup.alert({
			    title: 'Ha Habido Un Problema',
			    template: 'Dejaste algun espacio en blanco o no ingresaste un correo valido. vuelve a intentar.'
			});
	    }

    };


    $scope.cambiarCorreoEnBD = function(newMail){
    	$scope.persona.correo_personal = newMail;
    	$scope.actualizarPersonaBD();
    };


    $scope.actualizarPersonaBD = function(){
    	//console.log($scope.codigoPersona);
		var parte1 = '{"codigo_informacion_persona":' + $scope.codigoPersona + ',';
		var personaTemp = $scope.persona;
		delete personaTemp.foto;
		var parte2 = JSON.stringify(personaTemp).substring(1);

		$http.put('http://'+ $scope.IP +':8081/personas/'+ parte1 + parte2).
        success(function(resp) {
            console.log(resp);
            $scope.vaciarCommentTextArea();
            var alertPopupCambioExitoso = $ionicPopup.alert({
			    title: 'Cambio Exitoso',
			    template: 'Su correo electrónico ha sido cambiado exitosamente.'
			});
        });
	};

	$scope.vaciarCommentTextArea = function(){
		$scope.data.email1 = "";
		$scope.data.email2 = "";
	};

    $scope.regresar = function(){
    	$state.transitionTo("tab.account", "");
    };


    //console.log($scope.persona);
    //console.log($scope.codigoPersona);
    //console.log(window.localStorage['codigo_info_persona']);

});