(function () {
    'use strict';
    
    /**
    * @ngdoc overview
    * @name sw.ui.bootstrap.route
 
    * @description 
	    This module contains directives that listen to the AngularJS $route events such as the $routeChangeStart event
        - {@link sw.ui.bootstrap.route.directive:head head} directive
    */
    angular.module('sw.ui.bootstrap.route', []);
    
    
    /**
    * @ngdoc directive
    * @name sw.ui.bootstrap.route.directive:head
    * @requires $rootScope
    * @requires $compile
    * @element head
    * @restrict E    
    * @function 
    *
    * @description
    Directive inspired by {@link https://github.com/tennisgent/angular-route-styles angular-route-styles}. It supports media formats as well.
    * 
    * @example
    <pre>
     * var app = angular.module('app', ['ngRoute','sw.ui.bootstrap']);
     * app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/tweets', {
            templateUrl: 'app/views/streamed-tweets.html',
            controller: 'StreamedTweetsController',
            css: [
                {
                    href: "/app/css/streamed-tweets.css"
                },
                {
                    href: "/app/css/streamed-tweets-701.css",
                    media: "screen and (min-width: 701px)"
                },
                {
                    href: "/app/css/streamed-tweets-iphone.css",
                    media: "screen and (max-device-width: 480px)"
                }
            ]
        });
     * });
    </pre>
    */        
    angular.module('sw.ui.bootstrap.route').directive('head', ['$rootScope', '$compile',
        function ($rootScope, $compile) {
            return {
                restrict: 'E',
                link: function (scope, elem) {
                    var html = '<link rel="stylesheet" ng-repeat="(href, sheet) in routeStyles" media="{{sheet.media}}" ng-href="{{href}}" />';
                    elem.append($compile(html)(scope));
                    scope.routeStyles = {};
                    scope.getMedia = function (sheet) {
                        var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
                        return (sheet.media) ? sheet.media : "";
                    };
                    $rootScope.$on('$routeChangeStart', function (e, next, current) {
                        if (current && current.$$route && current.$$route.css) {
                            if (!angular.isArray(current.$$route.css)) {
                                current.$$route.css = [current.$$route.css];
                            }
                            angular.forEach(current.$$route.css, function (sheet) {
                                delete scope.routeStyles[sheet.href];
                            });
                        }
                        if (next && next.$$route && next.$$route.css) {
                            if (!angular.isArray(next.$$route.css)) {
                                next.$$route.css = [next.$$route.css];
                            }
                            angular.forEach(next.$$route.css, function (sheet) {
                                scope.routeStyles[sheet.href] = sheet;
                            });
                        }
                    });
                }
            };
        }
    ]);

})();