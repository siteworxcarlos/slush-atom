/*
 * slush-sample
 * https://github.com/siteworxcarlos/slush-atom
 *
 * Copyright (c) 2016, Carlos
 * Licensed under the MIT license.
 */

'use strict';
 
var gulp = require('gulp'),
    install = require('gulp-install'),
    conflict = require('gulp-conflict'),
    template = require('gulp-template'),
    replace = require('gulp-replace'),
    rename = require('gulp-rename'),
    _ = require('underscore.string'),
    inquirer = require('inquirer'),
    path = require('path');
 
function format(string) {
    var username = string.toLowerCase();
    return username.replace(/\s/g, '');
}
 
var defaults = (function () {
    var workingDirName = path.basename(process.cwd()),
      homeDir, osUserName, configFile, user;

    if (process.platform === 'win32') {
        homeDir = process.env.USERPROFILE;
        osUserName = process.env.USERNAME || path.basename(homeDir).toLowerCase();
    }
    else {
        homeDir = process.env.HOME || process.env.HOMEPATH;
        osUserName = homeDir && homeDir.split('/').pop() || 'root';
    }

    configFile = path.join(homeDir, '.gitconfig');
    user = {};

    if (require('fs').existsSync(configFile)) {
        user = require('iniparser').parseSync(configFile).user;
    }

    return {
        appName: workingDirName,
        userName: osUserName || format(user.name || ''),
        authorName: user.name || '',
        authorEmail: user.email || ''
    };
})();
 
gulp.task('default', function (done) {
    var prompts = [{
        name: 'appName',
        message: 'What is the name of your atom?',
        default: defaults.appName
    }];
    //Ask
    inquirer.prompt(prompts,
        function (answers) {
            answers.appNameSlug = _.slugify(answers.appName);
            //output mustache file in project directory
            gulp.src(__dirname + '/templates/*.mustache')
                .pipe(template(answers))
                .pipe(rename(function(file) {
                    file.basename = answers.appName;
                }))
                .pipe(conflict('./'))
                .pipe(gulp.dest('source/_patterns/00-atoms/00-'+answers.appName))
                .pipe(install())
                .on('end', function() {
                    done();
                });

            //output scss file in project directory
            gulp.src(__dirname + '/templates/app-sm.scss')
                .pipe(template(answers))
                .pipe(rename(function(file) {
                    file.basename = '_'+answers.appName + "-sm";
                }))
                .pipe(conflict('./'))
                .pipe(gulp.dest('source/css/scss/modules/'+answers.appName))
                .pipe(install())
                .on('end', function() {
                    done();
                });

            gulp.src(__dirname + '/templates/app-lg.scss')
                .pipe(template(answers))
                .pipe(rename(function(file) {
                    file.basename = '_'+answers.appName + "-lg";
                }))
                .pipe(conflict('./'))
                .pipe(gulp.dest('source/css/scss/modules/'+answers.appName))
                .pipe(install())
                .on('end', function() {
                    done();
                }); 
            
            //update scss file
            gulp.src('source/css/*.scss')
                .pipe(replace('//scaffold-mobile','@import "scss/modules/'+answers.appName+'/'+answers.appName+'-sm";\n//scaffold-mobile'))
                .pipe(replace('//scaffold-desktop','@import "scss/modules/'+answers.appName+'/'+answers.appName+'-lg";\n//scaffold-desktop'))
                .pipe(gulp.dest('source/css/'))
                .pipe(install())
                .on('end', function() {
                    done();
                });
        });
});
