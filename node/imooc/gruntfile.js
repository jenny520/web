module.exports = function(grunt){
	// Project configuration.
  	grunt.initConfig({
  		watch: {
		    jade: {
		        files: ['views/**'],
		        options: {
		            livereload: true
		        }
		    },
	        js: {
	        	files: ['public/js/**', 'models/**/*.js', 'schemas/**/*.js'],
	        	//tasks: ['jshint'],
		        options: {
		          livereload: true
		        }
	        },
	        uglify: {
	            files: ['public/**/*.js'],
	            tasks: ['jshint'],
	            options: {
	            	livereload: true
	            }
	        },
    	},
    	jshint: {
    	    options: {
    	    	jshintrc: '.jshintrc',
    	    	ignores: ['public/libs/**/*.js']
    	    },
    	    all: ['public/js/*.js','app/**/*.js']
    	},
    	uglify: {
    	    development: {
	    	    files: {
	    	        'public/build/admin.min.js': 'public/js/admin.js',
	    	        'public/build/detail.min.js': [
	    	        	'public/js/detail.js'
	    	        ]
	    	    }
    	    }
    	},
    	nodemon: {
	      	dev: {
		        options: {
		          file: 'app.js',
		          args: [],
		          ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],
		          watchedExtensions: ['js'],
		          watchedFolders: ['./'],
		          debug: true,
		          delayTime: 1,
		          env: {
		            PORT: 3000
		          },
		          cwd: __dirname
		        }
	      	}
    	},
    	concurrent: {
		    tasks: ['nodemon', 'watch', 'uglify', 'jshint'],
	    	options: {
	        	logConcurrentOutput: true
	    	}
    	}
  	});

  	// 加载包含 "watch nodemom concurrent" 任务的插件。
  	grunt.loadNpmTasks('grunt-contrib-watch')
  	grunt.loadNpmTasks('grunt-nodemon')
  	grunt.loadNpmTasks('grunt-concurrent')
  	grunt.loadNpmTasks('grunt-contrib-uglify')
    grunt.loadNpmTasks('grunt-contrib-jshint')

  	// 防止因为出现语法警告而导致程序中断
  	grunt.option('force', true)

  	// 默认被执行的任务列表。
  	grunt.registerTask('default', ['concurrent']);
}