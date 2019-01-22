(function () {
    'use strict';
    
    angular.module('NarrowOptionsApp', [])
    .controller('NarrowItDownController', NarrowItDownController)
    .service('MenuSearchService', MenuSearchService)
    .directive('foundItems',FoundItemsDirective)
    .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com");
    

    function FoundItemsDirective(){
      var ddo = {
        templateUrl: 'itemsloader.html',
        scope: {
          items: '<',
          myTitle: '@title',
          onRemove: '&',
        },
      controller: NarrowItDownDirectiveController,
      controllerAs: 'dirctrl',
      bindToController: true
      //transclude: true
      };

      return ddo;
    }


    function NarrowItDownDirectiveController() {
        var dirctrl = this;
        //Always use directive controller As object and properties!!!!!!!!!!!!!!!!!! 
        dirctrl.emptySearch = function(){
          if(dirctrl.items=== undefined){
          
            dirctrl.searchState = "Enter a search term!";
            return true
          }
          else if (dirctrl.items.length === 0){
            dirctrl.searchState = "Nothing Found";
            return true
          }
          else{
           
            return false;
          }
      }
    
    }
   

    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
      var ctrl = this;
      ctrl.searchString = "";

      ctrl.title = "Filtered List";

      ctrl.logInformation = function(){
        ctrl.found = [];
        // console.log("SearchString is: " + ctrl.searchString);
      var promise = MenuSearchService.getMatchedMenuItems(ctrl.searchString).then(function(response){
        ctrl.found = response;
        // console.log(ctrl.found[0]);
        ctrl.title = "Filtered List " + "(" + ctrl.searchString + ")";
      });
    
      };

      ctrl.removeItem = function(itemIndex){
        MenuSearchService.removeItem(itemIndex);

      }

    }
    
    MenuSearchService.$inject = ['$http', 'ApiBasePath'];
    function MenuSearchService($http, ApiBasePath) {
      var service = this;
      var names = [];
      service.getMatchedMenuItems = function(searchString){
        names = [];
        return $http({
            method: 'GET',
            url:(ApiBasePath + "/menu_items.json"),
        }).then(function(response){
        
          // console.log("Search String in service: " + searchString);
          for (var i in response.data.menu_items){ 
            if(response.data.menu_items[i].name.toLowerCase().includes(searchString)){
              // console.log("This verifies: " + response.data.menu_items[i].name);
              names.push(response.data.menu_items[i]);
            }
         }
         return names;
        });
      
    
    }
    
    service.removeItem = function(itemIndex){
      names.splice(itemIndex,1);
    };


    }
    })();
    