'use strict';

module.exports = function (grunt) {

    //config main project settings
    grunt.initConfig({

        //basic settings about our plugins
        pkg: grunt.file.readJSON('package.json'),

        //compress css
        cssmin: {
            target: {
                files: {
                    'build/css/app.css': ['build/css/app.css']
                }
            }
        },

        //compress js files
        uglify: {
            my_target: {
                files: {
                    'build/js/app.js':['html/js/app.js'],
                }
            }
        },

        //compress html and php documents
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    //Main folder
                    'build/404error.html': 'html/404error.html',
                    'build/index.php': 'html/index.php',

                    //function
                    'build/functions/db_connect.php':'html/functions/db_connect.php',
                    'build/functions/functions.php':'html/functions/functions.php',

                    //include folder
                    'build/include_pages/footer.php': 'html/include_pages/footer.php',
                    'build/include_pages/nav.php': 'html/include_pages/nav.php',
                }
            }
        },

        //watch for file changes in css and js and combine them
        watch: {
            js: {
                files: ['html/js/**/*.js'],
                tasks: ['uglify']
            },
            css: {
                files: ['html/css/**/*.css'],
                tasks: ['cssmin']
            },
            html:{
                files:['html/*php','html/**/*.php','html/*.html'],
                tasks:['htmlmin']
            }
        }
    });

    //load in all grunt plugins
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-watch');

    //Do the task
    grunt.registerTask('default', ['cssmin','htmlmin','uglify','watch']);
};