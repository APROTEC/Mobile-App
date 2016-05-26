angular.module('controllers.eventsDetailsController', [])
.controller('EventsDetailsCtrl', function($scope, $state, $http, $ionicPopup,$stateParams) {


	$scope.ip = window.localStorage['direccionIpPuerto'];
	$scope.listaComentarios = [];
	$scope.data = {};
	$scope.listaEventoOpcionesAcompanantes = [];
	$scope.acompanantes = []; // SUBLISTAS [EOA, OA]
	$scope.number = 0;
	$scope.dictionaryInvitados = {};

	$scope.getNumber = function(num) {
	    var array = [];
	    for (var i = num; i >= 0; i--) {
	    	array.push(i);
	    };
	    return array;
	}



	$scope.getEvento = function(){
		$http.get('http://'+ $scope.ip +'/eventos/'+ $scope.codigo_evento).
        success(function(resp) {
            $scope.evento = resp[0];
            $scope.number = $scope.evento.numero_maximo_acompanantes;
            //console.log($scope.number);
            $scope.getTipoEvento(); 
            $scope.getEventoOpcionesAcompanantes();
        });
	} ;
	$scope.getTipoEvento = function(){
		$http.get('http://'+ $scope.ip +'/tipos_eventos/'+ $scope.evento.codigo_tipo_evento).
        success(function(resp) {
            $scope.tipo_evento = resp[0];
          
          	//UNA VEZ HA CARGADO LA INFO PRINCIPAL, CARGAR LOS COMENTARIOS:
          	$scope.getComentarios();
        });
	};
	$scope.getStringFecha = function(fecha){
		if(fecha != undefined){
			return fecha.substring(0,10);
		}
	};
	$scope.getStringHora = function(fecha){
		if(fecha != undefined){
			return fecha.substring(11,16);
		}
	};

// ******************************************** OPCIONES ACOMPANANTES ******************************************* \\\\\\

	$scope.getEventoOpcionesAcompanantes = function(){
		// GET Evento_opciones_acompanante
		//	/evento_acompanantes/3
		// 			-> GET Opciones_acompanante {codigo, descripcion}
		//				/opciones_acompanantes/:codigo_opcion_acompanante	

		$http.get('http://'+ $scope.ip +'/evento_acompanantes/'+ $scope.codigo_evento).
        success(function(resp) {
            $scope.listaEventoOpcionesAcompanantes = resp;
            
            for (var i = resp.length - 1; i >= 0; i--) {
            	
            	$http.get('http://'+ $scope.ip +'/opciones_acompanantes/'+ resp[i].codigo_opcion_acompanante ).
		        success((function(i) {
		        	return function(data){
			            var OpcionAcompanante = data[0];		            
			            $scope.acompanantes.push([$scope.listaEventoOpcionesAcompanantes[i],OpcionAcompanante]);
			            console.log($scope.acompanantes);
			        }
		        })(i));
            };
        });
	};





// ******************************************** CONFIRMAR ASISTENCIA ******************************************* \\\\\\



	$scope.changeSelectAcompanantes = function(numberSelect  ,acompanante){
		$scope.dictionaryInvitados[""+acompanante[0].codigo_opcion_acompanante+""] =numberSelect; 
	};


	$scope.confirmarAsistencia = function(){
		console.log($scope.dictionaryInvitados.length);
		var totalInvitados = 0;
		for (var key in $scope.dictionaryInvitados) {
			totalInvitados = totalInvitados + parseInt($scope.dictionaryInvitados[key]);
			console.log($scope.dictionaryInvitados[key]);
		};

		//alert(totalInvitados);
		//alert($scope.evento.numero_maximo_acompanantes);

		if(totalInvitados > $scope.evento.numero_maximo_acompanantes){
			var alertPopupIncoincidencias = $ionicPopup.alert({
			    title: 'Excedente en Cantidad de Invitados',
			   	template: 'El total de invitados que lleves no puede ser superior a ' + $scope.evento.numero_maximo_acompanantes + '.'
			});
		}else{
			var precio = $scope.evento.precio_entrada_asociados;
			$http.put('http://'+ $scope.ip +'/usuarios_invitados/{"codigo_evento":'+$scope.evento.codigo_evento+',"codigo_usuario":'+$scope.codigo_usuario+',"confirmado":1,"precio_entradas":' + precio + '}').
			success(function(resp) {
	          
	            $scope.confirmado = false;
	            //Confirmar invitados
	            //usuarios_acompanantes/{"codigo_evento":3,"codigo_usuario":1,"codigo_opcion_acompanante":1,"numero_acompanantes":1}
	            for (var key in $scope.dictionaryInvitados) {
	            	if($scope.dictionaryInvitados[key] != "0" && $scope.dictionaryInvitados != undefined){
		            	$http.post('http://'+ $scope.ip +'/usuarios_acompanantes/{"codigo_evento":'+$scope.evento.codigo_evento+',"codigo_usuario":'+ $scope.codigo_usuario 
		            					   + ',"codigo_opcion_acompanante":' + key + ',"numero_acompanantes":' + $scope.dictionaryInvitados[key] + '}').
						success(function(resp){

							console.log("CONFIRMACION 1 INVITADO");
						});
					}
	            };
	        });   
			//alert(JSON.stringify($scope.dictionaryInvitados));
		}
	};



// ******************************************** DOCUMENTOS ******************************************* \\\\\\

	$scope.verDocumentos = function(){
		$state.transitionTo('tab.events-details-documents', { codigo_evento:$scope.codigo_evento  })
	};











// ********************************************** COMENTARIOS **********************************************


	$scope.getComentarios = function(){
		$scope.listaComentarios = [];
		$http.get('http://'+ $scope.ip +'/comentarios/'+ $scope.codigo_evento).
        success(function(resp) {
            var comentariosParciales = resp;
            console.log(comentariosParciales);
            $scope.completarComentarios(comentariosParciales);



           console.log($scope.listaComentarios);
        });
	};

	$scope.completarComentarios = function(comentariosParciales){
		for (var i = comentariosParciales.length - 1; i >= 0; i--) {
			//var comentario = comentariosParciales[i].comentario;
			//console.log(comentario);

			$http.get('http://'+ $scope.ip +'/usuarios/'+ comentariosParciales[i].codigo_usuario).
	        success((function(i) {
	        	return function(data) {
		            var usuarioi = data[0];

		            $http.get('http://'+ $scope.ip +'/personas/'+ usuarioi.codigo_informacion_persona).
			        success(function(data) {
			        	var persona = data[0];
			        	$scope.listaComentarios.push([persona,comentariosParciales[i].comentario]); //Agrega un par (lista) de: [persona, comentario]
			        	console.log(comentariosParciales[i].comentario);
			        });
			    }
	        })(i));
		};
	};


	$scope.sendComment = function(){
		var textoComentarioNuevo = $scope.data.commentario;
		//console.log(textoComentarioNuevo);

		var comment = {};
		comment.codigo_usuario = $scope.codigo_usuario// = '1'; //QUITAR ESTO PARA PRUEBAS CON BD
		comment.codigo_evento = $scope.codigo_evento;
		comment.comentario = textoComentarioNuevo;

		//console.log($scope.codigo_usuario);

		var commentString = JSON.stringify(comment);

		console.log(commentString);

		$scope.postCommentBD(commentString);

	};				


	$scope.vaciarCommentTextArea = function(){
		$scope.data.commentario = "";
		//console.log("VACIO");
	};

	$scope.postCommentBD = function(commentString){
		$http.post('http://'+ $scope.ip +'/comentarios/' + commentString).
        success(function(resp) {
        	$scope.vaciarCommentTextArea();
            $scope.getComentarios();
        });
	};


// ******************************************** DATOS GENERALES ********************************************

	$scope.confirmado = true;
	$scope.codigo_usuario = window.localStorage['codigo_usuario'];
	$scope.codigo_evento = $stateParams.codigo_evento;
	$scope.opcion = $stateParams.confirm;
	$scope.confirmado =($scope.opcion=="1"?false:true); 
	$scope.getEvento();



});