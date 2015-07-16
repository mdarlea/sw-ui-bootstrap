module.exports = function (grunt) {
    grunt.initConfig({
        dist: 'dist',
        pkg: grunt.file.readJSON('package.json'),
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
                    '<%= concat.dist_tpls.dest %>'
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
    
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-angular-build');
    grunt.loadNpmTasks('grunt-debug-task');
    grunt.loadNpmTasks('grunt-ngdocs');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-clean');
    
    grunt.registerTask('test', ['clean', 'build','ngdocs']);
    grunt.registerTask('default', ['test', 'connect']);
};