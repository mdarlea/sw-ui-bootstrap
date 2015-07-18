(function () {
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
            function loadImage(name, counter, imgFilter, callback) {
                var imgPath = imgFilter.replace("{0}", name);
                    
                var image = new Image();
                image.src = imgPath;
                var that = this;
                image.onload = function (img) {
                    console.log("Image loaded " + img);
                    var css = that.backgroundImages;
                    css.push(name);
                    if (css.length === counter) {
                        callback();
                        that.loading = false;
                    }
                };
                    
                // handle failure
                image.onerror = function (err) {
                    console.log("Could not load image " + imgPath);
                };
            };

            return {
                constructor: ImageLoader,
                    
                    
                getFirst: function () {
                    return (this.idx > 0) ? this.backgroundImages[0] : "";
                },
                getCurrent: function () {
                    return this.backgroundImages[this.idx];
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
                    if (imgFilter) {
                        this.backgroundImages = [];
                        for (var i = 0; i < images.length; i++) {
                            this._(loadImage)(images[i], images.length, imgFilter, callback);
                        }
                    } else {
                        this.backgroundImages = images;
                        callback();
                        this.loading = false;
                    }
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