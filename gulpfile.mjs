import { src, dest, watch, series } from 'gulp';

import * as sass from 'sass';
import gulpSass from 'gulp-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';

import imagemin from 'gulp-imagemin';
import webp from 'gulp-webp';

const sassCompiler = gulpSass(sass);

function css(done) {
    src('src/scss/app.scss')
        .pipe(sassCompiler().on('error', sassCompiler.logError))
        .pipe(postcss([autoprefixer()]))
        .pipe(dest('build/css'));
    done();
}

function imagenes() {
    return src('src/img/**/*')
        .pipe(imagemin({ optimizationLevel: 3 }))
        .pipe(dest('build/img'));
}

function versionWebp() {
    return src('src/img/**/*.{png,jpg}')
        .pipe(webp())
        .pipe(dest('build/img'));
}

function dev() {
    watch('src/scss/**/*.scss', css);
    watch('src/img/**/*', imagenes);
}

export default series(imagenes, versionWebp, css, dev);
