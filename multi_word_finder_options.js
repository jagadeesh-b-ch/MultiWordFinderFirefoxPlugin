(function(){
	var mwfApp = angular.module('mwfApp', ['ngMaterial']);

	mwfApp.config(['$mdIconProvider', function($mdIconProvider) {
        $mdIconProvider.icon('md-close', 'img/ic_close_24px.svg', 24);
      }]);
	  
	  mwfApp.directive('auto-focus',function(){
			return {
				restrict: 'A',
				controller: function($scope, $element, $attrs){
					$element.focus();
				}
			}    
		});
	
	mwfApp.controller('mwfCtrl', mwfCtrl);
	mwfCtrl.$inject = ['$scope', '$mdDialog'];
	
	mwfApp.controller('addKeysetCtrl', addKeysetCtrl);
	addKeysetCtrl.$inject = ['$scope', '$mdDialog'];

	function mwfCtrl($scope, $mdDialog){
		$scope.selectedKeySetName = '-1';

		$scope.updateAutoSearchOpt = updateAutoSearchOpt;
		$scope.addCollectionPopup = addCollectionPopup;
		$scope.loadCollectionWords = loadCollectionWords;
		$scope.deleteCollection = deleteCollection;
		$scope.saveCollection = saveCollection;

		loadKeySetNames();
		loadAutoSearchOptions();
		
		function deleteCollection(){
			if($scope.selectedKeySetName !== '-1'){
				browser.storage.local.remove($scope.selectedKeySetName, function() {
					if($scope.autoSearchSet === $scope.selectedKeySetName){
						$scope.autoSearchSet = '-1';
						$scope.autoSearchEnabled = false;
						updateAutoSearchOpt();
					}
					$scope.selectedKeySetName = '-1'
					loadKeySetNames();
				});
			}
		}
		
		function saveCollection(){
			var obj = {};
			obj[$scope.selectedKeySetName] = $scope.keySetValues;
			browser.storage.local.set(obj, function() {
				
			});
		}
		
		function showAlert(message) {
			// Appending dialog to document.body to cover sidenav in docs app
			// Modal dialogs should fully cover application
			// to prevent interaction outside of dialog
			$mdDialog.show(
			  $mdDialog.alert()
				.clickOutsideToClose(true)
				.title('Alert')
				.textContent(message)
				.ariaLabel('Alert')
				.ok('OK')
			);
		  };
		
		function addCollectionPopup(ev) {
			$mdDialog.show({
			  controller: addKeysetCtrl,
			  templateUrl: 'add_collection.html',
			  parent: angular.element(document.body),
			  targetEvent: ev,
			  clickOutsideToClose:true
			})
			.then(function() {
			  loadKeySetNames();
			}, function() {
			  loadKeySetNames();
			});
		};
		
		function updateAutoSearchOpt(){
			console.log('called');
			if(!$scope.autoSearchEnabled){
				$scope.autoSearchSet = '-1';
			}else{
				if($scope.autoSearchSet === '-1'){
					$scope.autoSearchSet = $scope.keySetNames[0];
				}
			}
			var obj = {};
			obj['autoSearchOpt'] = $scope.autoSearchEnabled;
			obj['autoSearchSet'] = $scope.autoSearchSet;
			browser.storage.local.set(obj, function() {
							loadAutoSearchOptions();
						});
		}
		
		function loadAutoSearchOptions(){
			browser.storage.local.get(['autoSearchOpt', 'autoSearchSet'], function(items){
				$scope.autoSearchEnabled = items.autoSearchOpt;
				$scope.autoSearchSet = items.autoSearchSet;
				if($scope.autoSearchSet === '-1'){
					$scope.autoSearchEnabled = false;
				}
			});
		}

		

		function loadKeySetNames(){
			browser.storage.local.get(null, function(items) {
				$scope.keySetNames = [];
				for(key in items){
					$scope.keySetNames.push(key);
				}
				$scope.keySetNames = filterKeySetNames($scope.keySetNames);
			});
			
		}
		
		function filterKeySetNames(arr){
			return arr.filter(function(e) { return (e !== 'autoSearchOpt' && e !== 'autoSearchSet') })
		}

		function loadCollectionWords(keySetNameStr){
			if($scope.selectedKeySetName !== '-1'){
				browser.storage.local.get($scope.selectedKeySetName, function(items) {
					if(Object.keys(items).length !== 0){
						$scope.keySetValues = items[$scope.selectedKeySetName];
					}else{
						showAlert('Collection does not exist');
					}
				});
			}else{
				$scope.keySetValues = [];
			}
		}
	}
	
	function addKeysetCtrl($scope, $mdDialog){
		
		$scope.addKeySetName = addKeySetName;
		$scope.checkEnter = checkEnter;
		
		function checkEnter(event){
			if(event.keyCode === 13){
				addKeySetName();
			}
		}
		
		function addKeySetName(){
			if($scope.keySetName){
				browser.storage.local.get($scope.keySetName, function(items) {
					if(Object.keys(items).length === 0){
						var obj = {};
						obj[$scope.keySetName] = [];
						browser.storage.local.set(obj, function() {
							$scope.keySetName = '';
							$mdDialog.hide();
						});
					}else{
						showAlert('Collection exists already');
					}
				});
				
			}
		}
		
		function showAlert(message) {
			// Appending dialog to document.body to cover sidenav in docs app
			// Modal dialogs should fully cover application
			// to prevent interaction outside of dialog
			$mdDialog.show(
			  $mdDialog.alert()
				.clickOutsideToClose(true)
				.title('Alert')
				.textContent(message)
				.ariaLabel('Alert')
				.ok('OK')
			);
		  };

		$scope.cancel = function() {
		  $mdDialog.cancel();
		};
	}

})();
