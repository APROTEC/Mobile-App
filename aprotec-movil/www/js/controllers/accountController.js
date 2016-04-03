angular.module('controllers.accountController', [])
.controller('AccountCtrl', function($scope, $ionicPopup, $http, $stateParams) {


	

	$scope.codigoUsuario = window.localStorage['codigo_usuario'];


	$scope.usuario;
	$scope.persona;

	$scope.IP = "192.168.0.27"
	// ip:8081/grados_academicos/<codigo_Persona>
	// ip:8081/personas/<codigo_Persona>
	// ip:8081/usuarios/<codigo_Usuario>

	$scope.listaGradosAcademicosPersona = [];
	$scope.listaGradosAcademicos = [];
	$scope.listaDepartamentos = [];
	$scope.listaSubDepartamentos = [];
	$scope.listaSedes = [];
	$scope.hayGradosAcademicos = "No has agregado tus grados academicos"







	////////////////////////////////////////////////////
	// ----          Funciones de Prueba         ---- //
	////////////////////////////////////////////////////

	

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

	$scope.sleep = function(milliseconds) {
		var start = new Date().getTime();
		for (var i = 0; i < 1e7; i++) {
	    	if ((new Date().getTime() - start) > milliseconds){
	      		break;
	    	}
	  	}
	};


	////////////////////////////////////////////////////
	// ---- Funciones activadas por componentes  ---- //
	////////////////////////////////////////////////////

	$scope.addGradoAcademicoPersona = function(gradoAcademicoSeleccionado){
		objGradoAcademico = JSON.parse($scope.gradoAcademico);
		$scope.addGradoAcademicoPersonaBD(objGradoAcademico)
	};

	$scope.changeSelectGradosAcademicos = function(gradoAcademicoSeleccionado){
		$scope.gradoAcademico = gradoAcademicoSeleccionado;
	};

	$scope.changeSelectDepartamento = function(SelecDepartamento){
		$scope.SelectDepartamento = SelecDepartamento;
		objDepartamento = JSON.parse($scope.SelectDepartamento);
		$scope.getSubDepartamentos(objDepartamento.codigo_departamento);
	};

	$scope.editSubDepartamentoPersona = function(){
		objSubDepartamento = JSON.parse($scope.SelectSubDepartamento);
		$scope.editSubDepartamentoPersonaBD(objSubDepartamento);
	};

	$scope.changeSelectSubDepartamento = function(SelecSubDepartamento){
		$scope.SelectSubDepartamento = SelecSubDepartamento;
	};

	$scope.removerGrado = function (index,gradoAcademico) {
		var funcionTrue = function(){$scope.removerGradoConfirmado(index,gradoAcademico);};
		var funcionFalse = function(){$scope.funcionDummy();};
		var mensaje = "Estas seguro de que quieres eliminar tu grado academico: " + gradoAcademico.nivel_especializacion + ' en ' + gradoAcademico.campo_estudio + "?"
		$scope.confirmacion(mensaje,funcionTrue,funcionFalse);
	};


	////////////////////////////////////////////////////
	// ---- Funciones para modificar componentes ---- //
	////////////////////////////////////////////////////
	$scope.llenarDatos = function(){
		$scope.getGradosAcademicosPersona();
		$scope.getGradosAcademicos();
		$scope.getSedes();
		$scope.getDepartamentos();
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
        });
	};

	$scope.getDepartamentos = function(){
		$http.get('http://'+ $scope.IP +':8081/departamentos/').
        success(function(resp) {
        	$scope.getDepartamentoPersona(resp);
        });
	};	

	$scope.getDepartamentoPersona = function(departamentos){ //Tiene que comparar subDepartamentos
		$http.get('http://'+ $scope.IP +':8081/sub_departamentos/' + $scope.persona.codigo_sub_departamento).
        success(function(resp) {
        	//console.log(departamentos);
        	//console.log(resp);
        	var subDepartamentoPersona = resp[0];
        	var departamentoSeleccionado;
        	for (var i = departamentos.length - 1; i >= 0; i--) {
        		if(departamentos[i].codigo_departamento == subDepartamentoPersona.codigo_departamento){
        			departamentoSeleccionado = departamentos.splice(i,1);
        			$scope.listaDepartamentos = departamentoSeleccionado.concat(departamentos);
        			//console.log($scope.listaDepartamentos);
        			break;
        		}
        	};
        	$scope.SelectDepartamento = $scope.listaDepartamentos[0]; //No esta funcionando :'v
        	$scope.getSubDepartamentos(departamentoSeleccionado[0].codigo_departamento);
        });
	};

	$scope.getSubDepartamentos = function(codigoDepartamento){
		$http.get('http://'+ $scope.IP +':8081/sub_departamentos/departamentos/' + codigoDepartamento).
        success(function(resp) {
        	var subDepartamentos = resp;
        	var coincideSubDepartamento = false;
        	for (var i = subDepartamentos.length - 1; i >= 0; i--) {
        		if(subDepartamentos[i].codigo_sub_departamento  == $scope.persona.codigo_sub_departamento){
        			coincideSubDepartamento = true;
        			subDepartamentoSeleccionado = subDepartamentos.splice(i,1);
        			$scope.listaSubDepartamentos = subDepartamentoSeleccionado.concat(subDepartamentos);
        			console.log($scope.listaSubDepartamentos);
        			break;
        		}
        	};
        	if(coincideSubDepartamento == false){
        		$scope.listaSubDepartamentos = resp;
        		console.log($scope.listaSubDepartamentos);
        	}
        	$scope.SelectSubDepartamento = $scope.listaSubDepartamentos[0];
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
	$scope.removerGradoAcademicoEnBD = function(gradoAcademico){
		console.log(gradoAcademico.codigo_grado_academico);

		$http.delete('http://'+ $scope.IP +':8081/grados_academicos_personas/' + $scope.usuario.codigo_informacion_persona + '-' + gradoAcademico.codigo_grado_academico).
        success(function(resp) {
            console.log(resp);
            $scope.getGradosAcademicosPersona();
        });
	};

	$scope.addGradoAcademicoPersonaBD = function(objGradoAcademico){
		$http.post('http://'+ $scope.IP +':8081/grados_academicos_personas/' + $scope.usuario.codigo_informacion_persona + '-' + objGradoAcademico.codigo_grado_academico).
        success(function(resp) {
            console.log(resp);
            $scope.getGradosAcademicosPersona();
        });
	};

	$scope.editSubDepartamentoPersonaBD = function(objGradoAcademico){
		//accesad BD
	};


	////////////////////////////////////////////////////
	// ----    Llamadas iniciales a funciones    ---- //
	////////////////////////////////////////////////////
	$scope.getUsuario();


});