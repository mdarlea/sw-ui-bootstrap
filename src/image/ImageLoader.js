﻿(function () {
    'use strict';
    
    /**
    * @ngdoc overview
    * @name sw.ui.bootstrap.image
 
    * @description 		
	This module contains image processing directives and components
    * - {@link sw.ui.bootstrap.image.ImageLoader ImageLoader} object
    */
    angular.module('sw.ui.bootstrap.image', []);

    /**
    * @ngdoc service
    * @name sw.ui.bootstrap.image.ImageLoader
    * @description preloads a set of images
    */
    angular.module('sw.ui.bootstrap.image').factory("ImageLoader", [function (){
        var ImageLoader = function () {
            /**
            * @ngdoc property
            * @name sw.ui.bootstrap.image.ImageLoader#loading
            * @propertyOf sw.ui.bootstrap.image.ImageLoader
            * @returns {boolean} True if images are currently loading, False if all images were loaded
            */
            this.loading = true;
                
            /**
            * @ngdoc property
            * @name sw.ui.bootstrap.image.ImageLoader#backgroundImages
            * @propertyOf sw.ui.bootstrap.image.ImageLoader
            * @returns {Array} An array that contains the names of the loaded images
            */            
            this.backgroundImages = [];

            this.idx = 0;
        };
            
        ImageLoader.prototype = (function () {
            function getImageName(img) {
                var imgName = img && img.target && img.target.nameProp;
                if (imgName) {
                    var pos = imgName.lastIndexOf('.');
                    if (pos > 0) {
                        imgName = imgName.substring(0, pos);
                    }
                }
                return imgName;
            };
                
            function processed(imgName, images, callback) {
                var css = this.backgroundImages;
                css.push(imgName);
                if (css.length === images.length) {
                    callback();
                    this.loading = false;
                }
            };
                
            function loadImage(images, imgFilter, callback) {
                var unloadedImages = [];
                var that = this;
                for (var i = 0; i < images.length; i++) {
                    var name = images[i];
                    var imgPath = imgFilter.replace("{0}", name);
                        
                    var image = new Image();
                    image.src = imgPath;
                        
                    image.onload = function (img) {
                        var imgName = that._(getImageName)(img);
                        console.log("Image loaded " + img.target.href);
                        that._(processed)(imgName, images, callback);
                    };
                        
                    // handle failure
                    image.onerror = function (img) {
                        var imgName = that._(getImageName)(img);
                        unloadedImages.push(imgName);
                        console.log("Could not load image " + img.target.href);
                        that._(processed)(imgName, images, callback);
                    };
                }
            };
                
            return {
                constructor: ImageLoader,
                    
                getFirst: function () {
                    return this.backgroundImages.length > 0 && this.backgroundImages[0];
                },
                getCurrent: function () {
                    var len = this.backgroundImages.length;
                    return this.idx <= (len - 1) && this.backgroundImages[this.idx];
                },
                getNext: function () {
                    if (this.idx === (this.backgroundImages.length - 1)) {
                        this.idx = 0;
                    } else {
                        this.idx++;
                    }                        ;
                    return this.getCurrent();
                },
                    
                /**
            * @ngdoc method
            * @name sw.ui.bootstrap.image.ImageLoader#load
            * @methodOf sw.ui.bootstrap.image.ImageLoader
            * @description Preoads a list of images
            * @param {Array} images The names of the images that must be preloaded
            * @param {string} imgFilter Defines the full image path. Use the {0} placeholder for the image name
                Example: 
                <pre>
                var images=['image1.png','image2.png'];
                var loader = new ImageLoader();
                loader.load(images, '/Content/images/{0}.jpg', function() {
                    console.log("Images successfully preloaded");
                });
                </pre>
            * @param {function} callback A function that is called after all images were successfully loaded
            */
            load: function (images, imgFilter, callback) {
                    this.loading = true;
                    this.idx = 0;
                    this.backgroundImages = [];
                    this._(loadImage)(images, imgFilter, callback);
                },
                    
                _: function (callback) {
                    var self = this;
                    return function () { return callback.apply(self, arguments); };
                }
            }
        })();

        return ImageLoader;
    }]);
})();