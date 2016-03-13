var gulp 			= require('gulp');
var sass 			= require('gulp-ruby-sass');
var minifycss		= require('gulp-minify-css')
var autoprefixer	= require('gulp-autoprefixer');

gulp.task('sass', function(){
	return sass('source/*.scss', { stopOnError: true })
		.on('error', sass.logError)
		.pipe(minifycss())
		.pipe(gulp.dest('public/css'));
});

gulp.task('default', function(){
	gulp.start('sass');
});