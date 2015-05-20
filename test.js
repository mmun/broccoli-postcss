var assert = require('assert');
var fs = require('fs');
var path = require('path');
var broccoli = require('broccoli');
var postcssCompiler = require('./');
var pe = require('postcss-pseudoelements');

var options = {
    plugins: [
        {
            module: pe
        }
    ],
    map: {
        inline: false,
        annotation: false
    }
};

var outputTree = postcssCompiler('fixture', options);

it('should process css', function () {
    return (new broccoli.Builder(outputTree)).build().then(function (dir) {
        var content = fs.readFileSync(path.join(dir.directory, 'fixture.css'), 'utf8');
        assert.strictEqual(content.trim(), 'a:before { content: "test"; }');
    });
});
