# grunt-jsdox

> Recursively generates markdown files for your project, using the jsDox parser.  Optionally generates a table of contents, and supports git

## Getting Started
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-jsdox --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-jsdox');
```

## The "jsdox" task

### Overview

The `grunt-jsdox` plugin will recursively generate markdown documentation for all the `src` paths defined using the [jsDox](http://jsdox.org) module, outputting to the configured `dest`.

If `contentsEnabled` is _true_, a table of contents will also be generated with links to all of the files documented, sorted and grouped by the containing folder.

If configured, you can also publish the output of the documentation generation task to a remote git repo using the `publish` task.  This is useful for auto-publishing the
documentation for a project, for ex. to your github/bitbucket wiki, as part of the grunt build process.

In your project's Gruntfile, add a section named `jsdox` to the data object passed into `grunt.initConfig()`.


**Full Configuration** (defines each option)
```js
grunt.initConfig({
  jsdox: {
    generate: {
      options: {
        contentsEnabled: true,
        contentsTitle: 'Example Documentation',
        contentsFile: 'readme.md',
        pathFilter: /^example/
      },

      src: ['path/to/code'],
      dest: 'path/to/output'
    },

    [optional additional "generation" task like generate above, can be targed with jsdox:generate-other-docs],

    publish: {
      enabled: true,
      path: '<%= jsdox.generate.dest %>',
      message: 'Markdown Auto-Generated for version <%= pkg.version %>',
      remoteName: 'upstream'
      remoteBranch: 'master'
    }
  }
});
```

**Minimal Configuration** (falls back on defaults)

```js
grunt.initConfig({
  jsdox: {
    generate: {
      options: {
        contentsTitle: 'My Project Documentation',
      },

      src: ['path/to/code'],
      dest: 'path/to/output'
    }
  }
});
```


### Options

#### Generation Task Options

**contentsEnabled**

Type: `Boolean`
Default value: `true`

When _true_, the table of contents file (readme.md by default) is generated at the `dest` root


**contentsTitle**

Type: `String`
Default value: `Documentation`

The title of the table of contents file


**contentsFile**

Type: `String`
Default value: `readme.md`

The name of the table of contents file that is generated


**pathFilter**

Type: `RegExp`

If defined, will filter the final path for each file generated.  Ex, if the `src` included the following path containing moduleA,
`/path/to/code`, then the path to moduleA in the table of contents will be `path/to/code/moduleA`.  If a `filterPath` of `/path\/to/`
is defined, then the path to moduleA in the table of contents will be `code/moduleA`.  This helps avoid unnecessary deep paths, if the
code being documented is buried.


**src**

Type: `Array`

An array of paths to the documents who's folder should be included in the documentation generation


**dest**

Type: `String`

The destination path for the generated documentation




#### Publish Task Options

**enabled**

Type: `Boolean`
Default value: `false`

When _true_, publishing to a remote git repo is enabled


**path**

Type: `String`

The path from the `cwd` to the git repository that will be published


**message**

Type: `String`

The commit message used when `git commit` is called


**remoteName**

Type: `String`

The remote name of the git repository we are publishing to.  This would be one of the names displayed when `git remote -v show` is run.


**remoteBranch**

Type: `String`

The name of the branch that we are publishing to, within the `remoteName` repository.




## Usage Examples

#### Documentation generation
Here's a basic example of generating documentation for all the code in a project.  This would produce a tables of contents called
readme.md, and a folder called `lib` containing the documentation (and any subfolders):

**GruntFile**

```js
jsdox: {
  generate: {
    options: {
      contentsTitle: 'My Project API Documentation',
    },

    src: ['lib/**/*.js'],
    dest: 'docs/markdown'
  }
}
```

**Run the task**

```shell
grunt jsdox:generate
```






## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
