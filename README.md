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
        pathFilter: /^example/,
        templateDir: 'path/to/my/mustache'
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

**templateDir**

Type: `String`

The directory containing your custom mustache templates to override JSDox's default styles. See JSDox's [`templates/` directory](https://github.com/sutoiku/jsdox/tree/master/templates)
for the list of mustache templates you can override.

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



#### Publishing to a git repo
Before running the publish task, a git repository with a remote must already be configured; all this thing does it run git commands, specifically in
the following order:

1. git add .
2. git commit -m <commit message>
3. git push <remote> <branch>

This example assumes your github/bitbucket/whatever wiki is located in a docs/markdown subfolder.  In a real-world situation, your nested
documentation folder _may also_ be a git repo, so running git commands against it require targetting that repo directly (otherwise git will target
the parent repo).  For example, running a simple ``git add .`` against a nested repo looks like:

```shell
git --git-dir=docs/markdown/.git --work-tree=docs/markdown add .
```

``grunt-jsdox`` makes this assumption by default, so --git-dir and --work-tree are automatically set to ``dest`` when running the ``publish``
task.  Next, if a remote isn't configured already (run `git remote -v show` to see whats there), you need to configure one before continuing:

```shell
git remote add <name> <git repo url>

ex:
git remote add upstream https://github.com/yourname/yourrepo.wiki.git
```

**GruntFile**

```js
jsdox: {
  generate: {
    options: {
      contentsTitle: 'My Project API Documentation',
    },

    src: ['lib/**/*.js'],
    dest: 'docs/markdown'
  },

  publish: {
    enabled: true,
    path: '<%= jsdox.generate.dest %>',
    message: 'Markdown Auto-Generated for version <%= pkg.version %>',
    remoteName: 'upstream'
  }
}

...

//define a custom task to clean, generate, then publish
grunt.registerTask('generate-docs', ['clean:docs', 'jsdox:generate', 'jsdox:publish']);
```

**Run the task**

```shell
grunt generate-docs
```


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
