/*
 * slush-sample
 * https://github.com/siteworxcarlos/slush-atom
 *
 * Copyright (c) 2016, Carlos
 * Licensed under the MIT license.
 */
var gulp = require('gulp'),
    install = require('gulp-install'),
    conflict = require('gulp-conflict'),
    template = require('gulp-template'),
    replace = require('gulp-replace'),
    insert = require('gulp-insert'),
    rename = require('gulp-rename'),
    gulpif = require('gulp-if'),
    _ = require('underscore.string'),
    inquirer = require('inquirer'),
    path = require('path'),
    config = null,
    latestAnswers = null;

try {
    config = require(process.cwd() + '/slush-atom-config.json'); // Try to get local-to-project config
} catch(e) {
    config = require('./slush-atom-config.json'); // Fall back to generic config
}

gulp.task('refreshAnswers', function(done) {
    var prompts = [{
            name: 'appName',
            message: 'What is the name of your atom?',
            validate: function(val) {
                if(val && val.length > 0) { return true; }
                return 'Please provide a name to use for your atom.';
            }
        },{
            name: 'folder',
            message: 'What folder should the atom pattern (mustache) be stored in?',
            default: function(answers) {
                return '00-'+answers.appName;
            }
        },{
            name: 'orderNumber',
            message: 'What order should this atom be in, in that folder? (ex. 00 is first)',
            default: '00'
        }
    ];
    //Ask
    inquirer.prompt(prompts, function (answers) {
        latestAnswers = answers;
        gulp.start('createFiles'); // NOTE: Will be deprecated in gulp 4.0
        done();
    });
});

function haveAnswers() {
    if(!latestAnswers) {
        console.error('Need to run task `refreshAnswers` before creating files');
        return false;
    }

    return true;
}

gulp.task('createPattern', function(done) {
    if(!haveAnswers()) { return; }

    //output mustache file in project directory
    return gulp.src(__dirname + '/templates/*.mustache')
        .pipe(template(latestAnswers))
        .pipe(rename(function(file) {
            file.basename = latestAnswers.orderNumber + '-' + latestAnswers.appName;
        }))
        .pipe(conflict('./'))
        .pipe(gulp.dest(config.patternOutputPath + latestAnswers.folder))
        .pipe(install());
});

var scssFileTasks = [],
    lastScssImportTask = null;
(function () {
    for(var i = 0; i < config.scssFiles.length; i++) {
        var fileInfo = config.scssFiles[i],
            taskName = 'createScssFile-' + i;

        createScssFileTask(fileInfo, taskName);
        scssFileTasks.push(taskName);

        // Since these all are potentially writing to the same file, make each one dependent on the last one completing
        // only need to track the name of the last one to trigger the whole chain
        taskName = 'importScssFile-' + i;
        createScssImportTask(fileInfo, taskName, (i === 0 ? null : ['importScssFile-' + (i - 1)]));
        lastScssImportTask = taskName;
    }
})();
function createScssFileTask(fileInfo, taskName) {
    gulp.task(taskName, function(done) {
        if(!haveAnswers()) { return; }

        var src = fileInfo.slushTemplate ? __dirname + fileInfo.template : fileInfo.template,
            filename = latestAnswers.appName + config.scssNamespaceConnector + fileInfo.name;

        // Output folder with scss files in project directory
        return gulp.src(src)
            .pipe(template(latestAnswers))
            .pipe(rename(function(file) {
                file.basename = "_" + filename;
            }))
            .pipe(conflict(config.scssFileOutputPath + latestAnswers.appName))
            .pipe(gulp.dest(config.scssFileOutputPath + latestAnswers.appName))
            .pipe(install());
    });
}

function createScssImportTask(fileInfo, taskName, prevTask) {

    // NOTE: Will be deprecated in gulp 4.0 - use series instead
    if(prevTask !== null) { gulp.task(taskName, prevTask, task); }
    else { gulp.task(taskName, task); }

    function task(done) {
        if(!haveAnswers()) { return; }

        var filename = latestAnswers.appName + config.scssNamespaceConnector + fileInfo.name,
            dirName = fileInfo.includedFromFile.substring(0, fileInfo.includedFromFile.lastIndexOf("/")),
            replacing = (fileInfo.importReplace ? true : false),
            importStr = '@import "' + fileInfo.scssImportPath + latestAnswers.appName + '/' + filename + '";';

        // Update the scss file that includes this new file
        return gulp.src(fileInfo.includedFromFile)
            // Prepend the placeholder text with the new import
            .pipe(gulpif(replacing, replace(fileInfo.importReplace,importStr+'\n'+fileInfo.importReplace)))
            // Appending the new import
            .pipe(gulpif(!replacing, insert.append('\n'+importStr)))

            .pipe(gulp.dest(dirName))
            .pipe(install());
    }
}

// NOTE: Will be deprecated in gulp 4.0, use series and/or parallel instead
gulp.task('createFiles',['createPattern', lastScssImportTask].concat(scssFileTasks));
gulp.task('default', ['refreshAnswers']);