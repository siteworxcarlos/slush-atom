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
    inquirer = require('inquirer');
 
function format(string) {
    var username = string.toLowerCase();
    return username.replace(/\s/g, '');
}
 
var defaults = (function() {
    var homeDir = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE,
        workingDirName = process.cwd().split('/').pop().split('\\').pop(),
        osUserName = homeDir && homeDir.split('/').pop() || 'root',
        configFile = homeDir + '/.gitconfig',
        user = {};
    if (require('fs').existsSync(configFile)) {
        user = require('iniparser').parseSync(configFile).user;
    }
    return {
        appName: workingDirName,
        userName: format(user.name) || osUserName,
        authorEmail: user.email || ''
    };
})();
 
gulp.task('default', function(done) {
    var prompts = [{
        name: 'appName',
        message: 'What is the name of your atom?',
        default: defaults.appName
    }];
    //Ask
    inquirer.prompt(prompts,
        function(answers) {
            answers.appNameSlug = _.slugify(answers.appName);
            //output mustache file in project directory
            gulp.src(__dirname + '/templates/*.mustache')
                .pipe(template(answers))
                .pipe(rename(function(file) {
                    file.basename = answers.appName;
                }))
                .pipe(conflict('./'))
                .pipe(gulp.dest('../../source/_patterns/00-atoms/00-'+answers.appName))
                .pipe(install())
                .on('end', function() {
                    done();
                });
    
            //output scss file in project directory
            gulp.src(__dirname + '/templates/*.scss')
                .pipe(template(answers))
                .pipe(rename(function(file) {
                    file.basename = '_'+answers.appName;
                }))
                .pipe(conflict('./'))
                .pipe(gulp.dest('../../source/css/scss/modules/'+answers.appName))
                .pipe(install())
                .on('end', function() {
                    done();
                });
            
            //update scss file
            gulp.src('../../source/css/*.scss')
                .pipe(replace('//scaffold-add-mobile', '@import "scss/modules/'+answers.appName+';"\n //scaffold-add-mobile'))
                .pipe(gulp.dest('../../source/css/'))
                .pipe(install())
                .on('end', function() {
                    done();
                });
        });
});
