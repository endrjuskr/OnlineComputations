module.exports = function(grunt) {
    require('jit-grunt')(grunt);

    grunt.initConfig({
        less: {
            development: {
                options: {
                    compress: true,
                    yuicompress: true,
                    optimization: 2
                },
                files: [
                    {
                        expand: true,
                        cwd: 'css/less',
                        src: ['*.less'],
                        dest: 'css/temp/',
                        ext: '.css'
                    }
                ]
            }
        },
        concat_css: {
            options: {
                // Task-specific options go here.
            },
            all: {
                src: ["css/temp/*.css"],
                dest: "css/project.css"
            },
        },
        clean: ["css/temp"]
    });

    grunt.registerTask('default', ['less', 'concat_css', "clean"]);
};