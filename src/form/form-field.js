(function () {
    'use strict';
    
    /**
    * @ngdoc overview
    * @name sw.ui.bootstrap.form
 
    * @description This module contains form controls
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
    * @param {string} [type='text'] The field type. Acceptable values: 'text', 'date'
    * @param {string} [placeholder=''] The field watermark
    * @param {boolean} [inline=false] 
    *   If true then the 'form-inline' css bootstrap class is used. 
    *   If false then the 'form-group' css class is used    * 
    * @param {ngModel} ngModel The {@link ng.directive:ngModel ngModel} directive attached to the associated input field
    * @param {Object} options Additional field options 
    * @param {string} [options.formatYear='yy'] Available for date field type.
    * @param {Number} [options.startingDay=1] Available for date field type. 
    * @param {datetime} [options.minDate] The minimum date allowed in the date-time picker
    * @param {boolean} [options.required=false] True if the field is required, False otherwise
    * 
    * @example
    <example module="sw.ui.bootstrap">
     <file name="index.html">         
        <sw-form-field label="Birth Date:" 
                       placeholder="Birth Date" 
                       type="date" 
                       data-ng-model="birthDate">
        </sw-form-field>
     </file>
    </example>
    */
    angular.module('sw.ui.bootstrap.form')
        .controller("FormController", ["$scope", function ($scope) {
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
                    $scope.dateOptions = $.extend(true, {}, defaultDateOptions, options);
                } else {
                    $scope.dateOptions = null;
                }
                $.extend(true, $scope.fieldOptions, options);
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
                require: '?ngModel',
                scope: {
                    label: '@',
                    type: '@',
                    placeholder: '@',
                    title: '@',
                    inline: '@',
                    options: '=',
                    ngModel: '='
                },
                controller: 'FormController',
                templateUrl: 'template/form/form-field.html'
            };
        }]);
})();