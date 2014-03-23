module.exports = function (grunt) {
    'use strict';

    // Middleware for directory listing
    var mountFolder = function (connect, point) {
        var path = require('path');
        return connect.static(path.resolve(point));
    };

    // Project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        connect: {
            options: {
                port: 8080,
                // change this to '0.0.0.0' to listen to all interfaces
                hostname: '0.0.0.0'
            },
            livereload: {
                options: {
                    middleware: function (connect, options) {
                        return [
                            require('connect-livereload')({
                                port: 33388
                            }),
                            mountFolder(connect, options.base),
                            connect.directory(options.base)
                        ];
                    }
                }
            }
        },
        open: {
            app: {
                path: 'http://localhost:8080'
            }
        },
        watch: {
            app: {
                files: ['src/js/**/*.js', '*.html'],
                options: {
                    livereload: 33388
                }
            }
        },
        jshint : {
            files : ['src/js/**/*.js'],
            gruntfile: ['Gruntfile.js'],
            options : {
                jshintrc: true
            }
        },
        jasmine: {
            requirejs: {
                options: {
                    specs: 'src/**/*Spec.js',
                    keepRunner: true,
                    template: require('grunt-template-jasmine-requirejs'),
                    templateOptions: {
                        requireConfigFile: 'src/js/main.js'
                    }
                }
            }
        },
        requirejs: {
            release: {
                options: {
                    name: 'main',
                    baseUrl: 'src/js',
                    out: 'dist/pork.js',
                    mainConfigFile: 'src/js/main.js'
                }
            }
        },
        clean : {
            release : [ 'dist' ]
        },
        copy : {
            release : {
                files : []
            }
        },
        uglify: {
            options: {
                preserveComments: 'all',
                report: 'min'
            },
            compile: {
                files: {}
            }
        }
    });

    // load all grunt tasks matching the `grunt-*` pattern, exclude `grunt-template-jasmine-requirejs`
    require('load-grunt-tasks')(grunt, {pattern: ['grunt-*', '!grunt-template-jasmine-requirejs']});

    grunt.registerTask('default', [
        'jshint',
        'copy',
        'jasmine:requirejs',
        'connect:livereload',
        'open',
        'watch'
    ]);
};