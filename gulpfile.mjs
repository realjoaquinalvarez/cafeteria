import { src, dest, watch, series } from 'gulp';
import * as sass from 'sass';
import gulpSass from 'gulp-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import webp from 'gulp-webp';

const sassCompiler = gulpSass(sass);

// Definir las rutas
const paths = {
    dist: {
        img: {
            dir: './build/img', // Carpeta de destino para las imágenes
        },
    },
    src: {
        img: {
            dir: './src/img', // Carpeta de origen de las imágenes
            files: './src/img/**/*', // Todos los archivos de imagen
        },
    },
};

// Tarea CSS
function css(done) {
    src('src/scss/app.scss')
        .pipe(sassCompiler().on('error', sassCompiler.logError))
        .pipe(postcss([autoprefixer()]))
        .pipe(dest('build/css'));
    done();
}

// Tarea para copiar las imágenes sin procesarlas
function imagenes(done) {
    src(paths.src.img.files, { encoding: false })  // Usamos encoding: false para evitar problemas con archivos binarios
        .pipe(dest(paths.dist.img.dir));  // Copiamos las imágenes a la carpeta build/img
    done();
}

// Tarea para convertir imágenes a WebP (opcional)
function versionWebp(done) {
    src('src/img/**/*.{png,jpg}')  // Solo imágenes PNG y JPG
        .pipe(webp())  // Convertir a WebP
        .pipe(dest('build/img'));  // Guardarlas en build/img
    done();
}

// Tarea para observar cambios
function dev() {
    watch('src/scss/**/*.scss', css);
    watch('src/img/**/*', series(imagenes, versionWebp));  // Copiar imágenes y luego convertir a WebP si es necesario
}

// Tarea por defecto
export default series(imagenes, versionWebp, css, dev);
