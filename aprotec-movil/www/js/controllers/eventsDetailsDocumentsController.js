angular.module('controllers.eventsDetailsDocumentsController', ['ngCordova'])
.controller('EventsDetailsDocumentsCtrl', function($scope, $state,$stateParams, $http, $ionicPopup, $cordovaFileOpener2,$cordovaFileTransfer,$timeout) {

	$scope.ip = window.localStorage['direccionIpPuerto'];
	$scope.codigo_usuario = window.localStorage['codigo_usuario'];
	$scope.listaActas = [];
  $scope.codigo_evento = $stateParams.codigo_evento;


	$scope.funcionDummy = function() {
		//Esta funcion no hace nada, es una funcion dummie para pasar por parametro a la confirmacion.
	};

  openPDF = function(url){
    $cordovaFileOpener2.open(
      url,
      'application/pdf'
      ).then(function() {
          // file opened successfully
      }, function(err) {
            alert('Error al abrir el archivo');
       
      });

  };

  $scope.downloadAndOpenPDF = function(url,acta){
    url = 'https://'+url;
    acta.hide = 0;
    acta.downloadProgress = 0;
    var targetPath = cordova.file.externalDataDirectory + "document.pdf";
    var trustHosts = true;
    var options = {};
    $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
      .then(function(result) {
        acta.hide = 1;
        acta.downloadProgress = 0;
        openPDF(targetPath);
      }, function(err) {
        acta.hide = 1;
        acta.downloadProgress = 0;
        alert('Hubo un error al descargar el archivo');
      }, function (progress) {
        $timeout(function () {
          acta.downloadProgress = (progress.loaded / progress.total) * 100;
        });
      });
  };




  $scope.abrirBrowser = function(link) {

            $cordovaFileOpener2.open(link,'application/pdf'
  ).then(function() {
      // file opened successfully
  }, function(err) {
      // An error occurred. Show a message to the user
  });


  };

  addAttributes = function(){
    for (i = 0; i < $scope.listaActas.length; i++) { 
      $scope.listaActas[i].hide = 1;
      $scope.listaActas[i].downloadProgress = 0;
    }

  };

  $scope.getActas = function(){
		$http.get('http://'+ $scope.ip +'/eventos_documentos/' + $scope.codigo_evento).
        success(function(resp) {
        	$scope.listaActas = resp;
          addAttributes();
        });

	};
   	
  $scope.getActas();

});