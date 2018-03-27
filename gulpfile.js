/**
 * Created by debayan.das on 13-10-2017.
 */
let gulp = require('gulp');
let gulpsync = require('gulp-sync')(gulp);
let copy = require('gulp-copy');
let clean = require('gulp-clean');
let webpack = require('gulp-webpack');
let webpacklib = require('webpack');
let webpackConfig = require("./webpack.config");
let gutil = require('gulp-util');
let ftp = require('vinyl-ftp');
let branch = require('git-branch');
let run = require('gulp-run');
/**
 * WIDGET_LIST is the list of all possible widget and there
 * source path
 */
const WIDGET_LIST = [{
    name: "animated_map",
    path: "./src/animated_map/index.js"
}, {
    name: "multimedia_carousel",
    path: "./src/multimedia_carousel/index.js"
}, {
    name: "graph",
    path: "./src/graph/index.js"
}, {
    name: "hotspot",
    path: "./src/hotspot/index.js"
}, {
    name: "show_hide",
    path: "./src/show_hide/index.js"
}, {
    name: "timeline",
    path: "./src/timeline/index.js"
}, {
    name: "tab_accordion",
    path: "./src/tab_accordion/index.js"
},
{
    name: "collapsible_tree",
    path: "./src/collapsible_tree/index.js"
}];

/**
 *
 * @param widgetName
 * @returns object containing required entrypoints for webpack
 */
function getEntrypoints(widgetName) {
    let entryPoint = {};
    let iterableWidget = WIDGET_LIST.filter(widget => widget.name === widgetName);
    if (iterableWidget.length) {
        iterableWidget.forEach(widget => entryPoint[widget.name] = widget.path);
    } else {
        WIDGET_LIST.forEach(widget => entryPoint[widget.name] = widget.path);
    }
    return entryPoint;
}

function getSrcPath(entryPoints) {
    let generalSrcPath = "src/$$templateName/**"
    let copySrcArr = [`!src/common/*.*`];
    let webpackSrcArr = [];
    Object.keys(entryPoints).forEach(function (key) {
        copySrcArr.push(`${generalSrcPath.replace("$$templateName", key)}/*.*`);
        copySrcArr.push(`!${generalSrcPath.replace("$$templateName", key)}/*.js`);
        webpackSrcArr.push(`${generalSrcPath.replace("$$templateName", key)}/index.js`);
    });
    return {
        "copySrc": copySrcArr,
        "webpackSrc": webpackSrcArr
    };
}

let setupObj = {};
 gulp.task('build', gulpsync.sync(['setup', 'test', 'clean', 'copy-common', 'copySrc', 'webpackSrc']));

gulp.task("setup", () => {
    setupObj = getSetup();
    webpackConfig.entry = setupObj.entry;
    return;
});

gulp.task('copySrc', () => {
    let copySrcPath = setupObj.srcPath.copySrc;
    return gulp.src(copySrcPath)
        .pipe(copy("build", {
            prefix: 1
        }))
});

gulp.task('webpackSrc', () => {
    let webpackSrcPath = setupObj.srcPath.webpackSrc;
    return gulp.src(webpackSrcPath)
        .pipe(webpack(webpackConfig, webpacklib))
        .pipe(gulp.dest("build/"))
});


gulp.task('copy-common', () => {
    let srcPath = 'src/common/**';
    return gulp.src([`${srcPath}/**/*.*`])
        .pipe(copy("build", {
            prefix: 1
        }));
});


gulp.task('clean', () => {
    let cleanPath = setupObj.cleanPath;
    return gulp.src(cleanPath)
        .pipe(clean());
});

gulp.task('test', (callback) => {
    run('npm test').exec((err) => {
        if (err) {
            callback(err);
        } else {
            callback();
        }
    });
});

/**Deploy tasks needs below environement variables to be defined to work
 * LLIWIDGET_FTP_HOST
 * LLIWIDGET_FTP_USERNAME
 * LLIWIDGET_FTP_PASSWORD
 *
 */
gulp.task('deploy', ['build'], () => {
    console.log(branch.sync());
    if (branch.sync() !== 'master') {
        throw new Error("Only master branch can be deployed! Please checkout master!Current Branch is: " + branch.sync());
    }
    let conn = ftp.create({
        host: process.env.LLIWIDGET_FTP_HOST,
        user: process.env.LLIWIDGET_FTP_USERNAME,
        password: process.env.LLIWIDGET_FTP_PASSWORD,
        parallel: 10,
        log: gutil.log,
        debug: () => {
            //console.log("Successfully connected");
        }
    });
    let globs = [
        './build/**/*.*',
        '!./build/sample/**/*.*',
        '!./build/coverage/**/*.*'
    ];
    return gulp.src(globs, {
            base: 'build',
            buffer: false
        })
        .pipe(conn.newer('/LLI05/From Learningmate/build'))
        .pipe(conn.dest('/LLI05/From Learningmate/build'));
});

function getSetup() {
    let setupObj = {};
    let alias = process.argv[3];
    let buildWidget = process.argv[4];
    if (!alias) {
        setupObj.cleanPath = "build";
        setupObj.entry = getEntrypoints();
        setupObj.srcPath = getSrcPath(setupObj.entry);
    } else if (alias.toLowerCase() === "--i" &&
        WIDGET_LIST.filter(widget => widget.name === buildWidget).length) {
        setupObj.cleanPath = `build/${buildWidget}`;
        setupObj.entry = getEntrypoints(buildWidget);
        setupObj.srcPath = getSrcPath(setupObj.entry);
    } else {
        throw new Error(`invalid arguments, ${alias}, ${buildWidget}`);
    }
    return setupObj;
}

gulp.task('default', ["build"]);