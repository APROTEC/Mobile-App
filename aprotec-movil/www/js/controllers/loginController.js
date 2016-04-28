angular.module('controllers.loginController', [])
.controller('LoginCtrl', function($scope, $state, $http, $ionicPopup) {
  window.localStorage['codigo_usuario'] = '';
  window.localStorage['direccionIpPuerto'] = '192.168.0.13';
 

	$scope.data = {};
	
	$scope.IP = window.localStorage['direccionIpPuerto'];
 
 	$scope.login = function(){ 

      

  		$http.get('http://'+ $scope.IP +':8081/usuarios/loginU/'+ $scope.data.email + '-'+$scope.data.password).
        	success(function(resp) {
            //console.log(resp);
            if(resp.length > 0){
            	var usuario = resp[0];
            	var codigo_usuario = usuario.codigo_usuario;
              window.localStorage['codigo_usuario'] = codigo_usuario;
            	//console.log(usuario);
  				    //console.log(codigo_usuario);
            	$state.transitionTo("tab.events", "");
            } else {
            	var alertPopup = $ionicPopup.alert({
			          title: 'Login Invalido',
			    	    template: 'Usuario o contraseña invalidos, por favor intente de nuevo.'
			        });
            }   
      });       
  }

  $scope.recuperarContrasena = function(){
    $state.transitionTo("recoverpassword", "");
  }


});