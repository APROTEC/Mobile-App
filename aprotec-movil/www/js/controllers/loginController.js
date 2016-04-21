angular.module('controllers.loginController', [])
.controller('LoginCtrl', function($scope, $state, $http, $ionicPopup) {
  window.localStorage['codigo_usuario'] = '';
 

	$scope.data = {};
	
	$scope.IP = "localhost"
 
 	$scope.login = function(){ 
  		//console.log($scope.data.email);
  		//console.log($scope.data.password);
  		console.log
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


});