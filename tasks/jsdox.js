/**
 * grunt-jsdox
 * https://github.com/mmacmillan/grunt-jsdox
 *
 * Copyright (c) 2014 Mike MacMillan
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs'),
    path = require('path'),
    _ = require('lodash'),
    Q = require('q'),
    jsdox = require('jsdox');

module.exports = function(grunt) {

    /**
     * publishes the 'dest' folder to the git repo it is currently configured for. this code only
     * issues git commands; it doesn't target any specific repo...setting up the markdown repo ahead of time is
     * necessary.
     *
     * @param target the target action, which is always 'publish'; ignore
     * @param data the data for the publish action
     * @param done the handler to end the async operation
     * @returns {*}
     */
    function publish(target, data, done) {
        if(data.enabled !== true)
            return grunt.fail.fatal('publishing is disabled; set "publish.enabled" to true to enable');

        if(!data.path)
            return grunt.fail.fatal('the "publish.path" attribute must be provided for the publish task');

        if(!data.message)
            return grunt.fail.fatal('the "publish.message" attribute must be provided for the publish task');

        /**
         * provide the defaults for the git commands.  by default, we are assuming the markdown repo is stored
         * in a separate directory, so our git commands need to support that...provide the git-dir and work-tree
         * paths.  the standard publish process is:
         *
         * git add .
         * git commit -m <configured commit message>
         * git push <remoteName> <remoteBranch> (defaults to upstream master)
         *
         */
        _.defaults(data, {
            addCmd: ['--git-dir='+ data.path +'/.git', '--work-tree='+ data.path, 'add', '.'],
            commitCmd: ['--git-dir='+ data.path +'/.git', '--work-tree='+ data.path, 'commit', '-m', data.message],
            pushCmd: ['--git-dir='+ data.path +'/.git', '--work-tree='+ data.path, 'push', data.remoteName || 'upstream', data.remoteBranch || 'master']
        });

        //run the git commands, using promises to handle when complete
        function cmd(args) {
            var def = Q.defer();
            grunt.util.spawn({ cmd: 'git', args: args }, def.resolve);
            return def.promise;
        }

        //add, commit, and publish the doc repository
        cmd(data.addCmd)
            .then(cmd.bind(this, data.commitCmd))
            .then(cmd.bind(this, data.pushCmd))
            .then(done);
    }


    /**
     * generates the markdown documentation using the jsDox module, for the target files
     *
     * @param target the generation action that we are running
     * @param data the data for the target action
     * @param done the handler to end the async operation
     */
    function generate(target, data, done) {
        var files = this.files,
            dest = null,
            paths = [],
            promises = [],
            folders = [];

        //by default, we generate a table of contents called readme.md
        var options = this.options({
            contentsEnabled: true,
            contentsFile: 'readme.md',
            contentsTitle: 'Documentation',
            templateDir: null
        });

        //map the list of files we'll be generating documentation for
        files.forEach(function(group) {
            dest = group.dest;
            group.src.filter(function(file) {
                var obj = {
                    filename: path.basename(file),
                    folder: path.dirname(file),
                    path: file
                };

                if(options.pathFilter)
                    obj.folder = obj.folder.replace(options.pathFilter, '');

                folders.push(obj);
            });
        });

        //map the set of folders, sort, and generate documentation
        folders = _(folders)
            .groupBy(function(p) { return p.folder; })
            .sortBy(function(p) { return p.length && p[0].folder; })
            .map(function(group) {
                var file = group.length && group[0] || {};
                return {
                    name: file.folder,
                    path: file.path.replace(file.filename, ''),
                    files: group,
                    fileData: {}
                };
            })
            .each(function(folder) {
                var def = Q.defer();

                //queue the promise for the docs, and ensure the target exists (can safely run on an existing folder)
                promises.push(def.promise);
                grunt.file.mkdir(dest +'/'+ folder.name);

                //generate the docs for the folder, resolving the promise when complete
                jsdox.generateForDir(folder.path, dest +'/'+ folder.name, options.templateDir, def.resolve, function(file, fileData) {
                    folder.fileData[file] = fileData;
                });
            });

        //when all docs have been generated, build the table of contents, if needed (this stuff should be moved into a template)
        Q.all(promises).then(function() {
            if(!options.contentsEnabled) return done();

            var buf = [],
                w = function() { buf.push.apply(buf, arguments); };

            w(options.contentsTitle || 'Documentation', '===');

            folders.forEach(function(folder) {
                var docs = [];

                //derive the set of documents we *actually* generated docs for; that way we only add documented
                //code to the table of contents
                folder.files.forEach(function(file) {
                    //reset the path, pointing to the markdown file, and set the file data parsed by jsdox
                    file.path = path.join(file.folder, file.filename.replace('.js', '')).replace(/^\//, '');
                    file.data = folder.fileData[file.filename]||{};
                    if(grunt.file.exists(dest, file.path + '.md')) docs.push(file);
                });

                if(docs.length > 0) {
                    w(folder.name || 'Root', '---');
                    w('name | overview', ':-- | :--');
                    docs.forEach(function(file) {
                        w('['+ file.path +'.js]('+ file.path + '.md' + ') | '+ (file.data.overview?'_'+ file.data.overview +'_':''));
                    });
                    w('- - -');
                }

                w('\n');
            });

            //write out the table of contents, and complete the async generate task
            fs.writeFileSync(path.join(dest, (options.contentsFile || 'readme.md')), buf.join('\n'));
            done();
        });
    }

    grunt.registerMultiTask('jsdox', 'Recursively generates markdown files for your project.', function() {
        var target = this.target,
            data = this.data,
            done = this.async(),
            handler = this.target === 'publish' ? publish : generate;

        //we're either generating documents based on the passed in config; or we're publishing the docs repo...
        handler.call(this, target, data, done);
    });

};
