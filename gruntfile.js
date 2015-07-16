module.exports = function (grunt) {
    grunt.initConfig({
        dist: 'dist',
        pkg: grunt.file.readJSON('package.json'),
        html2js: {
            dist: {
                options: {
                    module: null, // no bundle module for all the html2js templates
                    base: '.'
                },
                files: [{
                        expand: true,
                        src: ['template/**/*.html'], ext: '.html.js'
                    }]
            }
        },
        jshint: {
            files: ['Gruntfile.js', 'src/**/*.js'],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        debug: {
            options: {
                open: false // do not open node-inspector in Chrome automatically 
            }
        },
        build: {
            options: {
                filename: 'sw-ui-bootstrap',
                modulePrefix: 'sw.ui.bootstrap.',
                moduleName: 'sw.ui.bootstrap'
            }
        },
        ngdocs: {
            options: {
                dest: '<%= dist %>/docs',
                scripts: [
                    'angular.js',
                    'ui-bootstrap-tpls.min.js',
                    '<%= concat.dist_tpls.dest %>'
                ],
				styles: [					
					'bootstrap-theme.min.css'
				],
                title: '<%= pkg.name %>',
                html5Mode: false,
                sourceLink: 'https://github.com/mdarlea/sw-ui-bootstrap/blob/master/{{file}}'
            },
            api: {
                src: ['src/**/*.js', '!src/**/*.spec.js'],
                title: 'API Documentation'
            }
        },
        connect: {
            options: {
                keepalive: true
            },
            server: {}
        },
        clean: ['<%= dist %>']
    });
    
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-angular-build');
    grunt.loadNpmTasks('grunt-debug-task');
    grunt.loadNpmTasks('grunt-ngdocs');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-clean');
    
    grunt.registerTask('before-test', ['html2js', 'clean']);

    grunt.registerTask('test', ['before-test', 'build', 'ngdocs']);

    grunt.registerTask('default', ['test', 'connect']);
};