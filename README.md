# Sage CUBE CSS Boilerplate Acorn Package

This repo can be used to integrate the [CUBE CSS Boilerplate](https://github.com/Set-Creative-Studio/cube-boilerplate/tree/main) into a Sage project. See ["A CSS project boilerplate"](https://piccalil.li/blog/a-css-project-boilerplate) by Andy Bell for an explaination of this methodology.

## Installation

You can install this package with Composer:

```bash
composer require csorrentino/sage-cube-boilerplate
```

### New Projects

If it's a brand new project, you can delete app.css and tailwind.config.js before publishing the resources. 

### Existing Projects
If you've already started working on a project you'll want to look at `publishes/resources/styles/app.css` and `publishes/tailwind.config.js` to incorporate the changes manually.

### Publishing Tailwind.config.js and CSS resources

```shell
$ wp acorn vendor:publish --provider="Csorrentino\SageCubeBoilerplate\Providers\SageCubeBoilerplateServiceProvider"
```
### Updating bud.config

In your `bud.config.js` file, you'll need to add this for postcss-import-ext-glob to run in the correct order:

```
/**
   * Add postcss plugins
   *
   * @see {@link https://bud.js.org/extensions/bud-postcss#adding-a-plugin}
   */
  app.postcss
    .setPlugin('postcss-import-ext-glob')
    .use((plugins) => ['postcss-import-ext-glob', ...plugins]);
```
## Additional Dev Dependencies

- postcss-js
- postcss-imort-ext-glob
- slugify

You can install these in your Sage theme with:

```shell
$ yarn add postcss-js postcss-import-ext-glob slugify -D
```


## Usage

From a Blade template:

```blade
@include('Example::example')
```

From WP-CLI:

```shell
$ wp acorn example
```
