angular.module('controllers.accountController', ['ngCordova','ngFileUpload'])
.controller('AccountCtrl', function($scope, $state, $ionicPopup, $http, $stateParams,$cordovaImagePicker,Upload) {


	

	$scope.codigoUsuario = window.localStorage['codigo_usuario'];


	$scope.usuario;
	$scope.persona;

	$scope.IP = window.localStorage['direccionIpPuerto'];
	// ip:8081/grados_academicos/<codigo_Persona>
	// ip:8081/personas/<codigo_Persona>
	// ip:8081/usuarios/<codigo_Usuario>

	$scope.listaGradosAcademicosPersona = [];
	$scope.listaGradosAcademicos = [];
	$scope.listaDepartamentos = [];
	$scope.listaSubDepartamentos = [];
	$scope.listaSedes = [];
	$scope.listaCantones = [];
	$scope.listaProvincias = [];

	$scope.hayGradosAcademicos = "No has agregado tus grados academicos";

	$scope.textoPrevioDepto = "PreDepto";
	$scope.textoDepartamento = "Depto";
	$scope.textoSubDepartamento = "Sub-Depto";
	$scope.primeraVezSubDepto = true;
	$scope.textoPrevioProv = "PreProv";
	$scope.textoProvincia = "Prov";
	$scope.textoCanton = "Cantoon";
	$scope.primeraVezCanton = true;

	$scope.textoPrevioSede = "PreSede";
	$scope.textoSede = "Sede";
	$scope.textoPrevioTalla = "PreTalla";
	$scope.textoTalla = "Tala";





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

	$scope.logout = function() {
		var funcionTrue = function(){$scope.logoutConfirmado();};
		var funcionFalse = function(){$scope.funcionDummy();};
		var mensaje = "Estas seguro de que quieres cerrar sesión?";
		$scope.confirmacion(mensaje,funcionTrue,funcionFalse);
	};

	$scope.logoutConfirmado = function(){
		window.localStorage['codigo_usuario'] = null;
        $state.transitionTo("login", "");
	};


	////////////////////////////////////////////////////
	// ---- Funciones activadas por componentes  ---- //
	////////////////////////////////////////////////////

	$scope.removerGrado = function (index,gradoAcademico) {
		var funcionTrue = function(){$scope.removerGradoConfirmado(index,gradoAcademico);};
		var funcionFalse = function(){$scope.funcionDummy();};
		var mensaje = "Estas seguro de que quieres eliminar tu grado academico: " + gradoAcademico.nivel_especializacion + ' en ' + gradoAcademico.campo_estudio + "?";
		$scope.confirmacion(mensaje,funcionTrue,funcionFalse);
	};

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
		$scope.textoPrevioDepto = objDepartamento.nombre_departamento;
	};
	$scope.editSubDepartamentoPersona = function(){
		objSubDepartamento = JSON.parse($scope.SelectSubDepartamento);
		$scope.editSubDepartamentoPersonaBD(objSubDepartamento);
		$scope.textoSubDepartamento = objSubDepartamento.nombre_sub_departamento;
		$scope.textoDepartamento = $scope.textoPrevioDepto;
	};
	$scope.changeSelectSubDepartamento = function(SelectSubDepartamento){
		$scope.SelectSubDepartamento = SelectSubDepartamento;
	};


	$scope.changeSelectProvincia = function(SelectProvincia){
		$scope.SelectProvincia = SelectProvincia;
		objProvincia = JSON.parse($scope.SelectProvincia);
		$scope.getCantones(objProvincia.codigo_provincia);
		$scope.textoPrevioProv = objProvincia.nombre_provincia;
	};
	$scope.editCantonPersona = function(){
		objCanton = JSON.parse($scope.SelectCanton);
		$scope.editCantonPersonaBD(objCanton);
		$scope.textoCanton = objCanton.nombre_canton;
		$scope.textoProvincia = $scope.textoPrevioProv;
	};
	$scope.changeSelectCanton = function(SelectCanton){
		$scope.SelectCanton = SelectCanton;
	};


	$scope.editSede = function(){
		objSede = JSON.parse($scope.SelectSede);
		$scope.editSedeBD(objSede);
		$scope.textoSede = $scope.textoPrevioSede;
	};

	$scope.changeSelectSede = function(SelectSede){
		$scope.SelectSede = SelectSede;
		objSede = JSON.parse($scope.SelectSede);
		$scope.textoPrevioSede = objSede.nombre_sede;
		console.log($scope.textoPrevioSede);
	};

	$scope.editTalla = function(){
		objTalla = JSON.parse($scope.SelectTallaCamisa);
		$scope.editTallaBD(objTalla);
		$scope.textoTalla = $scope.textoPrevioTalla;
	}; 

	$scope.changeSelectTallaCamisa = function(SelectTallaCamisa){
		$scope.SelectTallaCamisa = SelectTallaCamisa;
		objTalla = JSON.parse($scope.SelectTallaCamisa);
		$scope.textoPrevioTalla = objTalla.codigo_talla_camisa;
		console.log($scope.textoPrevioTalla);
	};

	$scope.changeJefeToggle = function(toggleCargoJefatura){
    	$scope.changeJefeToggleBD(toggleCargoJefatura);
    };
	
	$scope.changeToggleVegetariano = function(toggleVegetariano){
    	$scope.changeToggleVegetarianoBD(toggleVegetariano);
    };

    $scope.changePassword = function(){
    	console.log($scope.codigoUsuario);
    	$state.transitionTo("changepassword", "");
    };


	////////////////////////////////////////////////////
	// ---- Funciones para modificar componentes ---- //
	////////////////////////////////////////////////////
	$scope.llenarDatos = function(){
		$scope.getGradosAcademicosPersona();
		$scope.getGradosAcademicos();
		$scope.getSedes();
		$scope.getDepartamentos();
		$scope.getCargoJefatura();
		$scope.getProvincias();
		$scope.getVegetariano();
		$scope.getTallas();
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

	$scope.getProvincias = function(){
		$http.get('http://'+ $scope.IP +':8081/provincias/').
        success(function(resp) {
        	$scope.getProvinciaPersona(resp);
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
        	$scope.textoDepartamento = $scope.listaDepartamentos[0].nombre_departamento;
        	$scope.SelectDepartamento = $scope.listaDepartamentos[0]; //No esta funcionando :'v
        	$scope.getSubDepartamentos(departamentoSeleccionado[0].codigo_departamento);
        });
	};

	$scope.getProvinciaPersona = function(provincias){ //Tiene que comparar cantones
		$http.get('http://'+ $scope.IP +':8081/cantones/' + $scope.persona.codigo_canton).
        success(function(resp) {
        	//console.log(provincias);
        	//console.log(resp);
        	var cantonPersona = resp[0];
        	var ProvinciaSeleccionada;
        	for (var i = provincias.length - 1; i >= 0; i--) {
        		if(provincias[i].codigo_provincia == cantonPersona.codigo_provincia){
        			ProvinciaSeleccionada = provincias.splice(i,1);
        			$scope.listaProvincias = ProvinciaSeleccionada.concat(provincias);
        			//console.log($scope.listaDepartamentos);
        			break;
        		}
        	};
        	$scope.textoProvincia = $scope.listaProvincias[0].nombre_provincia;
        	console.log($scope.textoProvincia);
        	$scope.SelectProvincia = $scope.listaProvincias[0]; //No esta funcionando :'v
        	$scope.getCantones(ProvinciaSeleccionada[0].codigo_provincia);
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
        			var subDepartamentoSeleccionado = subDepartamentos.splice(i,1); //SI ALGO SE CAE ENN DEPTOS QUITAR 'var'
        			$scope.listaSubDepartamentos = subDepartamentoSeleccionado.concat(subDepartamentos);
        			//console.log($scope.listaSubDepartamentos);
        			break;
        		}
        	};
        	if(coincideSubDepartamento == false){
        		$scope.listaSubDepartamentos = resp;
        		//console.log($scope.listaSubDepartamentos);
        	}
        	if($scope.primeraVezSubDepto){
        		$scope.textoSubDepartamento = $scope.listaSubDepartamentos[0].nombre_sub_departamento;
        		$scope.primeraVezSubDepto = false;
        	}
        	$scope.SelectSubDepartamento = $scope.listaSubDepartamentos[0];
        });
	};

	$scope.getCantones = function(codigoProvincia){
		$http.get('http://'+ $scope.IP +':8081/cantones/provincia/' + codigoProvincia).
        success(function(resp) {
        	var cantones = resp;
        	var coincideCanton = false;
        	for (var i = cantones.length - 1; i >= 0; i--) {
        		if(cantones[i].codigo_canton  == $scope.persona.codigo_canton){
        			coincideCanton = true;
        			var cantonSeleccionado = cantones.splice(i,1);
        			$scope.listaCantones = cantonSeleccionado.concat(cantones);
        			//console.log($scope.listaCantones[0].nombre_canton);
        			break;
        		}
        	};
        	if(coincideCanton == false){
        		$scope.listaCantones = resp;
        		//console.log($scope.listaCantones[0].nombre_canton);
        	}
        	if($scope.primeraVezCanton){
        		$scope.textoCanton = $scope.listaCantones[0].nombre_canton;
        		$scope.primeraVezCanton = false;
        	}
        	$scope.SelectCanton = $scope.listaCantones[0];
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
            $scope.textoSede = sedePersona.nombre_sede;
        });
	};
////////////////////////////////////////////////
	$scope.getTallas = function(){
		$http.get('http://'+ $scope.IP +':8081/tallas_camisas/').
        success(function(resp) {
        	$scope.getTallaPersona(resp);
        });
	};

	$scope.getTallaPersona = function(listaTallas){
        	var tallaPersona = {"codigo_talla_camisa":$scope.persona.codigo_talla_camisa};
            for (var i = listaTallas.length - 1; i >= 0; i--) {
            	if(listaTallas[i].codigo_talla_camisa == tallaPersona.codigo_talla_camisa){
            		listaTallas.splice(i, 1);
            		var tallaSeleccionada = [tallaPersona];
            		console.log($scope.listaTallas);
            		console.log(tallaSeleccionada);
            		$scope.listaTallas = tallaSeleccionada.concat(listaTallas);
            		break;
            	}
            };
            //console.log($scope.listaTallas);
            $scope.textoTalla = $scope.persona.codigo_talla_camisa;
	};
/////////////////////////////////////////////////
	$scope.getUsuario = function(){
		//console.log($scope.codigoUsuario);
		$http.get('http://'+ $scope.IP +':8081/usuarios/'+ $scope.codigoUsuario).
        success(function(data) {
            $scope.usuario = data[0];
            $scope.getPersona();
            //console.log($scope.usuario.codigo_usuario);
            //window.localStorage['codigo_usuario'] = $scope.usuario.codigo_usuario;
            //$scope.codigoUsuario = window.localStorage['codigo_usuario'];
            //console.log($scope.codigoUsuario);
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

	$scope.getCargoJefatura = function(){
		if ($scope.persona.cargo_jefatura == true){
			$scope.toggleCargoJefatura = 1;
		} else {
			$scope.toggleCargoJefatura = 0;
		}
	};

	$scope.getVegetariano = function(){
		if ($scope.persona.vegetariano == true){
			$scope.toggleVegetariano = 1;
		} else {
			$scope.toggleVegetariano = 0;
		}
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

	$scope.editSubDepartamentoPersonaBD = function(ObjSubDepartamentos){
		$scope.persona.codigo_sub_departamento = ObjSubDepartamentos.codigo_sub_departamento;
		$scope.actualizarPersonaBD();
	};

	$scope.editCantonPersonaBD = function(ObjCanton){
		$scope.persona.codigo_canton = ObjCanton.codigo_canton;
		$scope.actualizarPersonaBD();
	};


	$scope.editSedeBD = function(objSede){
		$scope.persona.codigo_sede = objSede.codigo_sede;
		$scope.actualizarPersonaBD();
	};

	$scope.editTallaBD = function(objTalla){
		$scope.persona.codigo_talla_camisa = objTalla.codigo_talla_camisa;
		$scope.actualizarPersonaBD();
	};

	$scope.changeJefeToggleBD = function(toggleCargoJefatura){
		if(toggleCargoJefatura){
			$scope.persona.cargo_jefatura = true;
		} else {
			$scope.persona.cargo_jefatura = false;
		}
		$scope.actualizarPersonaBD();
	};

	$scope.changeToggleVegetarianoBD = function(toggleVegetariano){
		if(toggleVegetariano){
			$scope.persona.vegetariano = true;
		} else {
			$scope.persona.vegetariano = false;
		}
		$scope.actualizarPersonaBD();
	};

	$scope.actualizarPersonaBD = function(){
		var parte1 = '{"codigo_informacion_persona":' + $scope.usuario.codigo_informacion_persona + ',';
		var personaTemp = $scope.persona;
		delete personaTemp.foto;
		var parte2 = JSON.stringify(personaTemp).substring(1);

		$http.put('http://'+ $scope.IP +':8081/personas/'+ parte1 + parte2).
        success(function(resp) {
            console.log(resp);
        });
	};




	$scope.seleccionarFotos = function(){

		var options = {
		   maximumImagesCount: 1,
		   width: 800,
		   height: 800,
		   quality: 80
		};
		$cordovaImagePicker.getPictures(options)
		    .then(function (results) {
		    	alert(results[0]);
		      	$scope.uploadPhoto(results[0]);
		    }, function(error) {
		      	alert("Error al conseguir la foto");
		    });
		};




		$scope.uploadPhoto = function(file){

			Upload.upload({
            url: "http://"+$scope.IP+":8081"+"/photos/"+$scope.usuario.codigo_informacion_persona, //webAPI exposed to upload the file
            data:{file:file} //pass file as data, should be user ng-model
		        }).then(function (resp) { //upload function returns a promise
		            if(resp.data.error_code === 0){ //validate success
		                alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
		            } else {
		                alert('an error occured');
		            }
		        }, function (resp) { //catch error
		            console.log('Error status: ' + resp.status);
		            alert('Error status: ' + resp.status);
		        }, function (evt) { 
		            console.log(evt);
		            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
		            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
		            vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
        		});

			};

	////////////////////////////////////////////////////
	// ----    Llamadas iniciales a funciones    ---- //
	////////////////////////////////////////////////////
	$scope.getUsuario();


});
