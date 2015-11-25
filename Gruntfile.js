module.exports = function(grunt) {

	grunt.initConfig({
		jshint: {
			files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
			options: {
				globals: {
					jQuery: true
				}
			}
		},
		watch: {
			files: ['<%= jshint.files %>'],
			tasks: ['jshint', 'htmllint', 'build']
		},
		bower_concat: {
			all: {
				dest: "dist/_bower.js",
				cssDest: "dist/_bower.css",
				mainFiles: {
					'stage-js' : 'dist/stage.web.min.js'
				}
			}
		},
		htmllint: {
			your_target: {
				options: {
					force: false,
				},
				src: [
					'src/**/*.html'
				]
			}
		},
		copy: {
			build: {
				cwd: 'src',
				src: ['**'],
				dest: 'dist',
				expand: true,
			}
		},
	});

	grunt.loadNpmTasks('grunt-bower-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-htmllint');

	grunt.registerTask('default', ['jshint', 'htmllint']);
	grunt.registerTask('build', ['bower_concat', 'copy']);


};
