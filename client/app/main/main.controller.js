'use strict';

angular.module('shopnxApp')
  .controller('ProductDetailsCtrl', function ($scope, $rootScope, Product, socket, $stateParams) {
    var id = $stateParams.id;
    var slug = $stateParams.slug;
    // Storing the product id into localStorage because the _id of the selected product which was passed as a hidden parameter from products won't available on page refresh
    if (localStorage != null && JSON != null && id !=null) {
        localStorage["product_id"] = id;
    }
    var product_id = localStorage != null ? localStorage["product_id"] : null;
    // var sl =
    // console.log(id,slug,product_id);
    var product = $scope.product = Product.get({id:product_id},function(data) {
      socket.syncUpdates('product', $scope.data);
    });

    $scope.i=0;
    $scope.changeIndex =function(i){
        $scope.i=i;
    }
  })
  .controller('MainCtrl', function ($scope, $stateParams, $location, Product, Brand, Category, socket) {

    if ($stateParams.productSku != null) {
        $scope.product = $scope.store.getProduct($stateParams.productSku);
    }

    var brands = $scope.brands = Brand.query();

    var sortOptions = $scope.sortOptions = [
       {name:"Price Asc", val:{'variants.price':1}},
       {name:"Price Desc", val:{'variants.price':-1}},
       {name:"Name Asc", val:{'name':1}},
       {name:"Name Desc", val:{'name':-1}}
    ];

    $scope.products = {};
    $scope.filtered = {};
    $scope.products.busy = false;
    $scope.products.end = false;
    $scope.products.after = 0;
    $scope.products.items = [];
    $scope.products.sort = sortOptions[0].val;
    $scope.lower_price_bound = 0;
    $scope.upper_price_bound = 1500;

    $scope.navigateToBrandPage = function(param){
      $location.replace().path('brand/'+param.slug+'/'+param._id);
    }
    $scope.search = function(param) {
        // if('brand' in param){ /* && $state.current.url!='/brand/:brand/:description'*/
        //     $location.replace().path('brand/'+param.brand.slug+'/'+param.brand._id);
        //     // $scope.products.brand = param.brand;
        // }
        // console.log($scope.products.brand);
        // var sort = $scope.products.sort = ('sort' in param) ? param.sort : undefined;

        $scope.products.busy = false;
        $scope.products.end = false;
        $scope.products.after = 0;
        $scope.products.items = [];

        if ($scope.products.busy) return;
        $scope.products.busy = true;


        // $scope.products.items = Product.query(q(param), function(data){
        //     $scope.products.busy = false;
        //     $scope.filtered.count = data.length;
        //     if(data.length==5) { $scope.products.after = $scope.products.after + data.length; } else { $scope.products.end = true;}
        // }, function(){ $scope.products.busy = false; });
        // console.log($scope.products.items)
    }
    // console.log('StoreCtrl');
    // console.log($stateParams);
        console.log($stateParams);
    if('brand' in $stateParams){
        var id = $stateParams._id;
            console.log('{where:{brand:id}}');
        $scope.breadcrumb = {type: 'brand'};
        if(id){
            $scope.breadcrumb.items = Brand.query();
            $scope.search({where:{brand:id}});
        }
        return;
    }

// // get category breadcrumb
//     if('category' in $stateParams){
//         var id = $stateParams._id;
//         $scope.breadcrumb = {type: 'category'};
//         $scope.breadcrumb.items = [];
//         if(id){
//             findCategoryPath(id);
//         }
//         return;
//         function findCategoryPath(id){
//             Category.get({id:id}).$promise.then(function(child){
//                 $scope.breadcrumb.items.push(child);
//                 var p = child.parent;
//                 if(p != null){
//                     findCategoryPath(1);
//                 }
//             });
//         }
//     }



    // function q(){
    //     var q= { limit: 5, skip: $scope.products.after, sort: $scope.products.sort, where : {} };
    //     var q2 = {};
    //     if($scope.products.brand){
    //         q.where = {brand:$scope.products.brand};
    //         q2.where = {brand:$scope.products.brand};
    //     }
    //     if($stateParams.brand){
    //         q.where = {brand:parseInt($stateParams.brand)};
    //         q2.where = {brand:parseInt($stateParams.brand)};
    //     }
    //     if($stateParams.cat_id){
    //         q.where = {category:parseInt($stateParams.cat_id)};
    //         q2.where = {category:parseInt($stateParams.cat_id)};
    //     }
    //
    //     // Product.query(q2,
    //     //     function(data){
    //     //         $scope.products.count = data.length;
    //     // });
    //     // console.log('filter',q);
    //     return q;
    // }

    $scope.search({});

    $scope.scroll = function() {
        if ($scope.products.busy || $scope.products.end) return;
        $scope.products.busy = true;
        console.log('scroll');
        // Product.query(q(), function(data){
        //     for (var i = 0; i < data.length; i++) {
        //         $scope.products.items.push(data[i]);
        //     }$scope.filtered.count = data.length + $scope.products.after;
        //     if(data.length==5) { $scope.products.after = $scope.products.after + data.length; } else { $scope.products.end = true;}
        //     $scope.products.busy = false;
        // }, function(){ $scope.products.busy = false; });
        $scope.search();
    }

    // $scope.fl = { brands: [] };


    $scope.priceRange = function(item) {
        return (parseInt(item['price']) >= $scope.lower_price_bound && parseInt(item['price']) <= $scope.upper_price_bound);
    };

    $scope.loadMore = function() {
        $scope.l += 12;
    };
  });
