﻿(function () {
    'use strict';
    
    /**
    * @ngdoc overview
    * @name sw.ui.bootstrap.form
 
    * @description 
	#### Dependencies
	- {@link http://angular-ui.github.io/bootstrap/ ui.bootstrap}
	
	#### Description
	This module contains form controls
    * - {@link sw.ui.bootstrap.form.directive:swFormField swFormField} directive
    */
    angular.module('sw.ui.bootstrap.form', ['ui.bootstrap']);
    
    /**
    * @ngdoc directive
    * @name sw.ui.bootstrap.form.directive:swFormField
    * @element ANY
    * @restrict EA
    * @require ngModel
    * @scope    
    * @function 
    *
    * @description
    * Renders a form field. The following field types are supported: text, date
    *
    * @param {string} label The form field label
    * @param {string} [type='text'] The field type. Acceptable values: 'text', 'password', 'date'
    * @param {string} [placeholder=''] The field watermark
    * @param {boolean} [group=true] 
    *   If true then the 'form-group' css bootstrap class is used         
    * @param {boolean} [inline=false] 
    *   If true then the 'form-inline' css bootstrap class is used    
    * @param {boolean} [control=false] 
    *   If true then the 'control-group' css bootstrap class is used    
    * @param {ngModel} ngModel The {@link https://docs.angularjs.org/api/ng/directive/ngModel ngModel} directive attached to the associated input field
    * @param {Object} options Additional field options 
    * @param {string} [options.formatYear='yy'] Available for date field type.
    * @param {Number} [options.startingDay=1] Available for date field type. 
    * @param {datetime} [options.minDate] The minimum date allowed in the date-time picker
    * @param {boolean} [options.required=false] True if the field is required, False otherwise
    * 
    * @example
    <doc:example module="app">      
      <doc:source>        
        <script>
            (function () {
            'use strict';
            angular.module('app',['sw.ui.bootstrap'])
             .controller('PersonController', ['$scope', function ($scope) {
                $scope.person = {
                    name: "Michelle Darlea",
                    dob: new Date(1976,4,23),
                    email: 'mdarlea@gmail.com',
                    refresh: function() {
                       this.dobText = formatDate(this.dob);
                    }
                };    
     
                 $scope.$watch('person.dob', function (newVal, oldVal) {
                    if (newVal !== oldVal) {
                       $scope.person.refresh();
                    }
                  },true);
     
                var formatDate= function(dt) {
                    if(!dt) return null;
     
                    var date = new Date(dt);
                    return date.toLocaleDateString("en-US")
                };            
            
                $scope.person.refresh();
              }]);
            })();     
        </script>        
        <style>
          .btn-calendar {
              margin-bottom: 10px;
          }
        </style> 
        <div data-ng-controller="PersonController" class="container">
            <form role="form">
                <sw-form-field label="Name:" 
                        placeholder="Name" 
                        type="text" 
                        data-ng-model="person.name">
                </sw-form-field>     
                <sw-form-field label="Birth Date:" 
                        placeholder="Birth Date" 
                        type="date" 
                        data-ng-model="person.dob">
                </sw-form-field>
                <sw-form-field label="E-mail:" 
                        placeholder="Email"                         
                        data-ng-model="person.email" control="true">
                    <p class="help-block">Please provide your E-mail</p>
                </sw-form-field>
                <sw-form-field label="Password:" 
                        placeholder="Password" 
                        type="password" 
                        data-ng-model="person.password" inline="true">
                    <span class="field-validation-valid text-danger" 
                          data-valmsg-for="Password" 
                          data-valmsg-replace="true">
                    </span>
                </sw-form-field>              
            </form>     
     
            <div class="row">
                <div class="col-md-4">
                    <b>{{person.name}}</b> was born on <b>{{person.dobText}}</b>
                </div>               
            </div>            
        </div>
      </doc:source>
    </doc:example>
    */
    angular.module('sw.ui.bootstrap.form')
        .controller("FormController", ["$scope", function ($scope) {
            setTimeout(function () {
                $scope.$apply(function () {
                    if (!$scope.group) {
                        $scope.group = !$scope.inline && !$scope.control;
                    }
                });
            }, 200);


            function getTemplate(type) {
                var name = (type) ? type : "text";
                return ("template/form/field-" + name + ".html");
            }
            
            function isDate(type) {
                return type === "date";
            }
            
            function updateFieldOptions(type, options) {
                if (isDate(type)) {
                    var defaultDateOptions = {
                        formatYear: 'yy', 
                        startingDay: 1,
                        minDate: new Date()
                    };
                    $scope.dateOptions = angular.extend({}, defaultDateOptions, options);
                } else {
                    $scope.dateOptions = null;
                }
                angular.extend($scope.fieldOptions, options);
            }
            
            $scope.fieldOptions = {
                required: false
            };
            
            $scope.$watch('type', function (type) {
                $scope.template = getTemplate(type);
                updateFieldOptions(type, $scope.options);
            });
            
            $scope.$watch('options', function (newVal, oldVal) {
                updateFieldOptions($scope.type, newVal);
            }, true);
            
            $scope.open = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                
                $scope.opened = true;
            };
        }])
        .directive('swFormField', [function () {
            return {
                restrict: 'EA',
                replace:true,
                require: '?ngModel',
                transclude: true,
                scope: {
                    label: '@',
                    type: '@',
                    placeholder: '@',
                    title: '@',
                    group: '@',
                    inline: '@',
                    control:'@',
                    options: '=',
                    ngModel: '='
                },
                controller: 'FormController',
                templateUrl: 'template/form/form-field.html'
            };
        }]);
})();