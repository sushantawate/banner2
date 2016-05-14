"use strict";

/*!
GULP DEPENDENCIES 
npm install -g gulp gulp-concat gulp-uglify gulp-replace-path gulp-inline-source gulp-minify-css gulp-autoprefixer gulp-rename gulp-sass gulp-useref gulp-notify gulp-plumber gulp-zip gulp-bump gulp-confirm gulp-imagemin gulp-insert-lines gulp-dom del fs path imagemin-pngquant run-sequence browser-sync
sudo npm link gulp gulp-concat gulp-uglify gulp-replace-path gulp-inline-source gulp-minify-css gulp-autoprefixer gulp-rename gulp-sass gulp-useref gulp-notify gulp-plumber gulp-zip gulp-bump gulp-confirm gulp-imagemin gulp-insert-lines gulp-dom del fs path imagemin-pngquant run-sequence browser-sync
*/

const gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    minifycss = require('gulp-minify-css'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    useref = require('gulp-useref'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    zip = require('gulp-zip'),
    bump = require('gulp-bump'),
    confirm = require('gulp-confirm'),
    insertLines = require('gulp-insert-lines'),
    dom = require('gulp-dom'),
    inlinesource = require('gulp-inline-source'),
    replacePath = require('gulp-replace-path'),


    del = require('del'),
    fs = require('fs'),
    path = require('path'),
    runSequence = require('run-sequence'),
    browserSync = require('browser-sync');

var json,
    filePath = path.basename(__dirname),
    developer,
    thisVersion,
    adServer,
    footTag,
    adServerSrc;

function doHeadTags(answer) {
    console.log(answer)
    switch (answer) {
        case "1":
            // Double Click Studio
            adServerSrc = "https://s0.2mdn.net/ads/studio/Enabler.js";
            footTag = "window.onload = function() { \n" +
                "   if (Enabler.isInitialized()) { \n" +
                "       init(); \n" +
                "   }else{ \n" +
                "       Enabler.addEventListener(studio.events.StudioEvent.INIT, init); \n" +
                "   } \n" +
                "};";
            break;
        case "2":
            // Double Click Studio - Polite Load
            adServerSrc = "https://s0.2mdn.net/ads/studio/Enabler.js";
            footTag = " window.onload = function() { \n" +
                "  if (Enabler.isInitialized()) { \n" +
                "      pageLoadedHandler(); \n" +
                "  } else { \n" +
                "      Enabler.addEventListener(studio.events.StudioEvent.INIT, pageLoadedHandler); \n" +
                "  } \n" +
                "}; \n" +
                " \n" +
                "function pageLoadedHandler() { \n" +
                "  if (Enabler.isVisible()) { \n" +
                "    init(); \n" +
                "  } else { \n" +
                "    Enabler.addEventListener(studio.events.StudioEvent.VISIBLE, init); \n" +
                "  } \n" +
                "}";
            break;
        case "3":
            // DCM 
            footTag = "window.onload = init();";
            break;
        case "4":
            // FLASH TALKING
            adServerSrc = "http://cdn.flashtalking.com/frameworks/js/api/2/8/html5API.js"
            footTag = "window.onload = init();";
            break
        default:
            headTag = ''
            footTag = "window.onload = init();";
            break;

    }
    writeAdserver(footTag);
    gulp.start('insert-head-bundle');

}

/*--------------------------------------------------
 CONCATINATE THE JAVASCRIPT INTO ONE MINIFIED FILE
--------------------------------------------------*/

gulp.task("concatScripts", function() {
    return gulp.src([
            'src/js/vendor/*',
            'src/js/olsTween*.js',
            'src/js/animation.js',
            'src/js/adServers.js'
        ])
        .pipe(plumber())
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(gulp.dest('deploy/js'))

    .pipe(notify({
        message: 'Scripts task complete'
    }));
});

/*--------------------------------------------------
COMPILE SASS AND MINIFY INTO ONE FILE IN DEPLOY
--------------------------------------------------*/

gulp.task('compileSass', function() {
    return gulp.src(['./src/scss/main.scss'])
        .pipe(plumber())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 3 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('src/css'))
        .pipe(notify({
            message: 'Sass task complete'
        }))
});

/*--------------------------------------------------
INLINE CSS AND JS
--------------------------------------------------*/

gulp.task('inlinesource', function() {
    var options = {
        compress: false
    };

    return gulp.src('./deploy/*')
        .pipe(inlinesource(options))
        .pipe(gulp.dest('./deploy'));
});


/*--------------------------------------------------
MOVE ALL ASSETS INTO THE DEPLOY FOLDER
--------------------------------------------------*/
gulp.task('moveFiles', function() {
    return gulp.src(["src/*", 'src/img/*',  'src/css/*', '!src/scss/', '!src/index.html'], {
            base: './src'
        })
        .pipe(plumber())
        .pipe(gulp.dest('deploy'));
})

/*--------------------------------------------------
MOVE HTML IN TO THE THE DEPLOY FOLDER & UPDATE LINKS
--------------------------------------------------*/

gulp.task('moveHTML', function() {
    return gulp.src('src/index.html')
        .pipe(useref())
        .pipe(gulp.dest('deploy'));
})


/*--------------------------------------------------
CREATE ARCHIVES
--------------------------------------------------*/

gulp.task('createSrcArchive', function() {
    json = JSON.parse(fs.readFileSync('./package.json'))
    return gulp.src('src/**/*')
        .pipe(zip(filePath + "-deployArchive-v" + json.version + '.zip'))
        .pipe(gulp.dest('./_versionArchive/'));

});

/*--------------------------------------------------
CLEAN OUT THE DEPLOY FOLDER 
--------------------------------------------------*/
gulp.task('clean', function() {
    del(['_publishZip/', './deploy/**/*', '.DS_Store', '.DS_Store?', '._*', '.Spotlight-V100', '.Trashes', 'ehthumbs.db', 'Thumbs.db']);
});

/*--------------------------------------------------
WATCH FUNCTION
--------------------------------------------------*/

gulp.task('watchFiles', function() {
    gulp.watch('src/scss/**/*.scss', ['compileSass']);
    gulp.watch('src/js/**/*.js', ['concatScripts']);
    gulp.watch(['src/**/*'], ['moveFiles']);

    gulp.watch('src/index.html', ['moveHTML']);
    gulp.watch('deploy/**/**/*', ['inlinesource', 'bs-reload']);

});

gulp.task('dev', function() {
    return gulp.src('src/**/*')
        .pipe(confirm({
            question: 'Developer name? (press enter if you are re-opening the same file)',
            proceed: function(answer) {
                developer = answer;
                return true;
            }
        }))
});

gulp.task('server', function() {
    json = JSON.parse(fs.readFileSync('./package.json'))
    var version = json.version.toString;

    if (json.version === '0.0.0') {
        console.log(typeof json.version)

        gulp.src('src/**/*')
            .pipe(confirm({
                question: 'Ad Server? Press | Doubleclick: 1 | Doubleclick polite: 2 |  GDN/Adwords/DCM/iProspect: 3 | FlashTalking: 4',
                proceed: function(answer) {
                    doHeadTags(answer);
                    return true;
                }
            }))

    }
    return true;

});

gulp.task('version', function() {
    json = JSON.parse(fs.readFileSync('./package.json'))

    return gulp.src('src/**/*')
        .pipe(confirm({
            question: 'Version Number?, current version is ' + json.version + ' (press enter if you are re-opening the same file)',
            proceed: function(answer) {
                if (answer !== "" && answer !== json.version && json.version !== "0.0.0") {
                    gulp.start('createSrcArchive')
                }
                thisVersion = answer || json.version;
                console.log(thisVersion);
                return true;
            }
        }))
});

/*--------------------------------------------------
DEFAULT
--------------------------------------------------*/
gulp.task('default', ['server', 'dev', 'version'], function() {
    gulp.start('dotasks');
    if (developer !== undefined) {
        gulp.start('addDev');
    }
});

gulp.task('dotasks', function(err) {
    runSequence(['bumpVersion', 'moveFiles', 'moveHTML', 'watchFiles'], ['concatScripts', 'compileSass'], 'browser-sync');
})

/*--------------------------------------------------
pubishZip
--------------------------------------------------*/
gulp.task('publish', ['cleanSys'], function() {
    json = JSON.parse(fs.readFileSync('./package.json'))

    return gulp.src('./deploy/**/*', {
        base: './deploy'
    })

    .pipe(zip(filePath + "_" + json.version + "_deploy.zip"))
        .pipe(gulp.dest('./_publishZip'));
});

gulp.task('cleanSys', function() {
    return del(['./_publishZip/', './deploy/**/.*', './deploy/**/_*', './deploy/**/*.db'])
});

function writeAdserver() {
    fs.writeFile('./src/js/adservers.js', footTag)
}


/*--------------------------------------------------
INLINE CSS AND JS
--------------------------------------------------*/
gulp.task('publishInline', function() {

    runSequence(['cleanSys', 'moveInline', 'inlinesource'],'replacePath', 'packageInlineZip', 'removeInineFolder');
 
});
gulp.task('removeInineFolder', function(){
    return del('./inline');
})
gulp.task('packageInlineZip', function(){
     json = JSON.parse(fs.readFileSync('./package.json'))

    return gulp.src(['./inline/index.html',
        './inline/img/*',
        './inline/fonts/*'
    ], {
        base: './inline'
    })

    .pipe(zip(filePath + "_" + json.version + "_deploy.zip"))
        .pipe(gulp.dest('./_publishZip'));
})

gulp.task('replacePath', function(){
  return gulp.src(['./inline/index.html'])
    .pipe(replacePath('../img/', 'img/'))
    .pipe(gulp.dest('./inline'));
});


gulp.task('moveInline', function() {
    return gulp.src(["deploy/img/**/*", 'deploy/fonts/**/*'], {
            base: './deploy'
        })
        .pipe(plumber())
        .pipe(gulp.dest('./inline'));
})

gulp.task('inlinesource', function() {
    return gulp.src('./deploy/index.html')
        .pipe(inlinesource())
        .pipe(gulp.dest('./inline'));
});


/*--------------------------------------------------
Minor version increment
--------------------------------------------------*/

gulp.task('bumpVersion', function() {
    gulp.src('./*.json')
        .pipe(bump({
            version: thisVersion
        }))
        .pipe(gulp.dest('./'));
});

gulp.task('addDev', function(cb) {
    fs.appendFile('.contributors', '\n' + developer + ' | v-' + thisVersion + ' | ' + datetime)

});

// /*--------------------------------------------------
// Insert headTags
// --------------------------------------------------*/

gulp.task('insert-head-bundle', function() {
    return gulp.src('./src/index.html')
        .pipe(dom(function() {
            if (adServerSrc != undefined) {
                this.getElementById('adServerTag').setAttribute('src', adServerSrc);

            }

            return this;
        }))
        .pipe(gulp.dest('./src/'));
});


// /*--------------------------------------------------
// Browser Sync
// --------------------------------------------------*/
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./src"
        }
    });
});
gulp.task('bs-reload', function() {
    browserSync.reload();
});
// /*--------------------------------------------------
// DATE TIME FUNCTION FOR ARCHIVE NAMING
// --------------------------------------------------*/

var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]
var hrs = ["12am", "1am", "2am", "3am", "4am", "5am", "6am", "7am", "8am", "9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm", "7pm", "8pm", "9pm", "10pm", "11pm", "12pm"]
var currentdate = new Date();
var datetime = currentdate.getDate() + " " + months[currentdate.getMonth()] + " " + currentdate.getFullYear() + " at " + hrs[currentdate.getHours()];

console.log(datetime)
