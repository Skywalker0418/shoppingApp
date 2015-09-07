'use strict';

angular.module('shopnxApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth, $modal, Cart, Category) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
    $scope.onSelectProduct = function($item, $model, $label){
        // $label_clean = $label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/ig,'');
        $location.path('product/'+$item.id+'/'+$item.slug);
    }
    // var booking = Category.query( {id: '1000'} );
    Category.parent('1000');

// Category.get({parent: 1000},{id:1, description:1, slug:1, parent:1}, function(parents){
  // console.log(parents);
    // Category.get({parent:null},fields: {id: true, description:true, slug: true, parent:true} },function(parents){
        // angular.forEach(parents,function(parent){
        //     parent.children = [];
        //     Category.query({filter:{ where : {parent:parent.id} }},function(children){
        //             parent.children.push(children);
        //     });
        // });
        // $scope.categories = parents;
    // });
    $scope.globalSearch = function(input){
          // console.log(input);
          var input = input.toLowerCase();
            var defer = $q.defer();
            if (input){
                Product.find({filter:{where:{name_lower:{like:input}}, limit:10, fields: {id: true, name:true, slug: true}}},
                    function(data,headers){
                          console.log(data);
                        if (!$scope.$$phase){ //check if digest is not in progress
                            $rootScope.$apply(function(){
                                defer.resolve(data);
                            });
                        } else {
                            defer.resolve(data);
                        }
                    },
                    function(response){
                        if (!$scope.$$phase){
                            $rootScope.$apply(function(){
                                defer.reject('Server rejected with status ' + response.status);
                            });
                        } else {
                            defer.reject('Server rejected with status ' + response.status);
                        }
                    });
            } else {
                if (!$scope.$$phase){
                    $rootScope.$apply(function(){
                        defer.reject('No search query ');
                        $log.info('No search query provided');
                    });
                } else {
                    defer.reject('No search query ');
                    $log.info('No search query provided');
                }
            }
            return defer.promise;
        };

        $scope.openCart = function (cart,size) {
            var cart = $scope.cart = cart;
            console.log(cart);
            var modalOptions = {
                templateUrl: "/components/navbar/cart-edit.html",
                controller: cartEditCtrl,
                controllerAs: "modal",
                windowClass: "ab-modal-window",
                resolve: {
                    cart: function () { return cart; },
                }
            };
            var modalInstance = $modal.open(modalOptions);
        };

        var cartEditCtrl = function ($scope, $modalInstance, cart) {
            $scope.cart = cart;
            $scope.cancel = function () {
                $modalInstance.dismiss('Close');
            };
        }
  });
