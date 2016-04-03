angular.module('controllers.accountController', [])
.controller('AccountCtrl', function($scope, $ionicPopup, $http, $stateParams) {


	

	$scope.codigoUsuario = window.localStorage['codigo_usuario'];


	$scope.usuario;
	$scope.persona;

	$scope.IP = "localhost"
	// ip:8081/grados_academicos/<codigo_Persona>
	// ip:8081/personas/<codigo_Persona>
	// ip:8081/usuarios/<codigo_Usuario>

	$scope.listaGradosAcademicosPersona = [];
	$scope.listaGradosAcademicos = [];
	$scope.listaDepartamentos = ["Docencia","Materiales","Financiero","Computación","Matemáticas"];
	$scope.listaSedes = [];
	$scope.hayGradosAcademicos = "No has agregado tus grados academicos"







	////////////////////////////////////////////////////
	// ----          Funciones de Prueba         ---- //
	////////////////////////////////////////////////////

	$scope.cambioSelectNuevoGradoAcademico = function(selectNuevoGradoAcademico) {
    	console.log("Hola");
	};

	////////////////////////////////////////////////////
	// ----          Funciones generales         ---- //
	////////////////////////////////////////////////////
  	$scope.alerta = function(texto) {
  		alert(texto);
	};


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


	////////////////////////////////////////////////////
	// ---- Funciones para modificar componentes ---- //
	////////////////////////////////////////////////////
	$scope.llenarDatos = function(){
		$scope.getGradosAcademicosPersona();
		
		$scope.getGradosAcademicos();
		$scope.getSedes();
		
	};


	$scope.removerGrado = function (index,gradoAcademico) {
		var funcionTrue = function(){$scope.removerGradoConfirmado(index,gradoAcademico);};
		var funcionFalse = function(){$scope.funcionDummy();};
		var mensaje = "Estas seguro de que quieres eliminar tu grado academico: " + gradoAcademico.nivel_especializacion + ' en ' + gradoAcademico.campo_estudio + "?"
		$scope.confirmacion(mensaje,funcionTrue,funcionFalse);
	};
	$scope.removerGradoConfirmado = function (index,gradoAcademico) {
		$scope.listaGradosAcademicosPersona.splice(index,1);
		$scope.removerGradoAcademicoEnBD(gradoAcademico);
	};


	////////////////////////////////////////////////////
	// ----        Funciones GET a la BD         ---- //
	////////////////////////////////////////////////////
	$scope.getGradosAcademicosPersona = function(){
		$http.get('http://'+ $scope.IP +':8081/grados_academicos_personas/'+ $scope.usuario.codigo_informacion_persona).
        success(function(resp) {
            $scope.listaGradosAcademicosPersona = resp;
            if($scope.listaGradosAcademicosPersona.length > 0){
            	$scope.hayGradosAcademicos = " ";


            	
            }
            
        });
	};

	$scope.getGradosAcademicos = function(){
		$http.get('http://'+ $scope.IP +':8081/grados_academicos/').
        success(function(resp) {
            $scope.listaGradosAcademicos = resp;
            //console.log($scope.listaGradosAcademicosPersona);
        	//$scope.gradoAcademico = $scope.listaGradosAcademicos[0];
      
        });
	};

	$scope.getSedes = function(){
		$http.get('http://'+ $scope.IP +':8081/sedes/').
        success(function(resp) {
        	$scope.getSedePersona(resp);
        });
	};

	$scope.getSedePersona = function(listaSedes){
		$http.get('http://'+ $scope.IP +':8081/sedes/' + $scope.persona.codigo_sede).
        success(function(resp) {
        	var sedePersona = resp[0];
            for (var i = listaSedes.length - 1; i >= 0; i--) {
            	if(listaSedes[i].codigo_sede == sedePersona.codigo_sede){
            		listaSedes.splice(i, 1);
            		var sedeSeleccionada = [sedePersona];
            		$scope.listaSedes = sedeSeleccionada.concat(listaSedes);
            		break;
            	}
            };
            //console.log($scope.listaSedes);
        });
	}

	$scope.getUsuario = function(){
		$http.get('http://'+ $scope.IP +':8081/usuarios/'+ $scope.codigoUsuario).
        success(function(data) {
            $scope.usuario = data[0];
            $scope.getPersona();
            //console.log($scope.usuario);
        });
	};

	$scope.getPersona = function(){
		$http.get('http://'+ $scope.IP +':8081/personas/'+ $scope.usuario.codigo_informacion_persona).
        success(function(data) {
        	$scope.persona = data[0];
        	$scope.llenarDatos();
            //console.log($scope.persona);
        });
	};


	////////////////////////////////////////////////////
	// ---- Funciones de modificacion a la BD    ---- //
	////////////////////////////////////////////////////
	$scope.removerGradoAcademicoEnBD = function(nombreGradoAcademico){
		//$scope.alerta("Removiendo Grado: " + nombreGradoAcademico);
	};


	////////////////////////////////////////////////////
	// ----    Llamadas iniciales a funciones    ---- //
	////////////////////////////////////////////////////
	$scope.getUsuario();


	$scope.funcion = function(gradoAcademicoSeleccionado){
	
		console.log($scope.gradoAcademico);
	};
	$scope.change = function(gradoAcademicoSeleccionado){
		$scope.gradoAcademico = gradoAcademicoSeleccionado;
	};
	


});