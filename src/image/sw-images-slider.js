(function () {
    'use strict';
    
    /**
    * @ngdoc directive
    * @name sw.ui.bootstrap.image.directive:swImagesSlider
    * @requires sw.ui.bootstrap.image.ImageLoader
    * @element div
    * @restrict EA    
    * @scope    
    * @function 
    *
    * @description
    * Changes a background image every 3 seconds
    *
    * @param {Array} source An array that contains the names of the images that must be pre-loaded
    * @param {string} filter Defines the full image path. Use the {0} placeholder for the image name. Example: '/Content/images/{0}.jpg'
    * @param {string} [bgClass='slider__background'] The background CSS class
    * 
    * @example
    <doc:example module="app">      
      <doc:source>        
        <script>
            (function () {
            'use strict';
            angular.module('app',['sw.ui.bootstrap'])
             .controller('HomeController', ['$scope', function ($scope) {
                $scope.images = ['nature1', 'nature3', 'beach', 'green', 'mountain'];
              }]);
            })();     
        </script>        
        <style>
            .beach,
            .green,
            .mountain,
            .nature1,            
            .nature3 {
                -webkit-transition: background-image 2s, -webkit-transform 2s;
                -moz-transition: background-image 2s, -moz-transform 2s;
                -ms-transition: background-image 2s, -ms-transform 2s;
                -o-transition:background-image 2s, transform 2s;
                transition:background-image 2s, transform 2s;
            }
              
             .background {
                position: relative; 
                top: 0;
                left: 0;
                width: 300px; 
                height: 280px;
                background-position:center; 
                background-repeat:no-repeat;       
                -ms-background-size:300px 280px;
                background-size:300px 280px;
            }

            .background.beach {
                background-image: url('/Content/images/beach.jpg');
            }

            .background.green {
                background-image: url('/Content/images/green.jpg');
            }

            .background.mountain {
                background-image: url('/Content/images/mountain.jpg');
            }

            .background.nature1 {
                background-image: url('/Content/images/nature1.jpg');
            }

            .background.nature3 {
                background-image: url('/Content/images/nature3.jpg');
            }          
        </style> 
        <div data-ng-controller="HomeController" class="container">     
            <div class="row">
                <div class="col-md-4">                   
                   <sw-images-slider class="nature1" 
                                     source="images" 
                                     filter="/Content/images/{0}.jpg" 
                                     bg-class="background">
                   </sw-images-slider>
                </div>               
            </div>            
        </div>
      </doc:source>
    </doc:example>
    */
    angular.module('sw.ui.bootstrap.image')
        .controller("ImagesSliderCtrl",["$scope",'ImageLoader',function($scope, ImageLoader) {
            $scope.loader = new ImageLoader();
            $scope.loader.loading = true;
        }])
        .directive('swImagesSlider', [function () {
            return {
                restrict: 'EA',
                replace: true,
                scope: {
                    filter: '@',
                    source: '=',
                    bgClass: "@"
                },
                controller: 'ImagesSliderCtrl',
                template: '<div></div>',
                link: function (scope, elm, attr) {
                    var css = scope.bgClass || "slider__background";
                    
                    if (!elm.hasClass(css)) {
                        elm.addClass(css);
                    }

                    var loader = scope.loader;
                    var loadImages = function () {
                        if (!scope.source || scope.source.length === 0) return;

                        //preload images
                        loader.load(scope.source, scope.filter, function () {
                            var first = loader.getFirst();
                            for (var i = 0; i < loader.backgroundImages; i++) {
                                var img = loader.backgroundImages[i];
                                if (img !== first) {
                                    elm.removeClass(img);
                                }
                            }
                            
                            if (first && !elm.hasClass(first)) {
                                elm.addClass(first);
                            }
                        });
                        scope.loadedFilter = scope.filter;
                        scope.loadedImages = scope.images;
                    };
                    
                    scope.$watch("source", function (newVal, oldVal) {
                        loadImages();
                    }, true);
                    
                    scope.$watch('filter', function (newVal, oldVal) {
                        loadImages();
                    });

                    var slider = setInterval(function () {
                        if (!loader.loading) {
                            elm.removeClass(loader.getCurrent()).addClass(loader.getNext());
                        }
                    }, 3000);
                    
                    scope.$on('$destroy', function (e) {
                        if (slider) {
                            clearInterval(slider);
                        }
                    });            
                }
            };
        }]);
})();