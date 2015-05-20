var postcss = require('postcss');
var CssSyntaxError = require('postcss/lib/css-syntax-error');
var Filter = require('broccoli-filter');
var Postcss = require('postcss');

function PostcssFilter(inputTree, opts) {
    if (!(this instanceof PostcssFilter)) {
        return new PostcssFilter(inputTree, opts);
    }

    this.inputTree = inputTree;
    this.opts = opts || {};
}

PostcssFilter.prototype = Object.create(Filter.prototype);
PostcssFilter.prototype.constructor = PostcssFilter;
PostcssFilter.prototype.extensions = ['css'];
PostcssFilter.prototype.targetExtension = 'css';

PostcssFilter.prototype.processString = function (str, relativePath) {
    var plugins = this.opts.plugins;

    if ( !plugins || plugins.length < 1 ) {
        throw new Error('You must provide at least 1 plugin in the plugin array');
    }

    var processor = postcss();
    var options = {
        from: relativePath,
        to: relativePath,
        map: this.opts.map
    };

    plugins.forEach(function (plugin) {
        var pluginOptions = plugin.options || {};
        processor.use(plugin.module(pluginOptions));
    });

    return processor.process(str, options)
    .then(function (result) {
        result.warnings().forEach(function (warn) {
            process.stderr.write(warn.toString());
        });
        return result.css;
    })
    .catch(function (error) {
        if ( 'CssSyntaxError' === error.name ) {
            process.stderr.write(error.message + error.showSourceCode());
        } else {
            throw error;
        }
    });
};

module.exports = PostcssFilter;
