/*
 * jsdox
 * http://jsdox.org/
 * https://github.com/sutoiku/jsdox*
 * (c) Pascal Belloncle, Marc Trudel
 *
 * grunt-jsdox
 * https://github.com/mmacmillan/grunt-jsdox
 * (c) Mike MacMillan
 *
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        // example configuration below; the contents of /example/code are processed, and output
        // to /example/docs
        jsdox: {
            generate: {
                options: {
                    contentsTitle: 'Example Documentation',
                    pathFilter: /^example/
                },

                src: ['example/code/**/*.js'],
                dest: 'example/docs'
            },

            publish: { enabled: false }
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['tmp'],
            docs: ['example/docs/**/*']
        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js']
        }
    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', 'jsdox', 'nodeunit']);

    // By default, lint
    grunt.registerTask('default', ['jshint']);

    // run the example with
    grunt.registerTask('example', ['jsdox:generate']);
};
