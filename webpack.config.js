/**
 * Created by debayan.das on 13-10-2017.
 */
let path = require('path');
let webpack = require('webpack');
module.exports = {
    output: {
        path: __dirname + "/build",
        filename: '[name]/index.js'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel-loader'
        }, {
            test: /\.json$/,
            loader: 'json-loader'
        }]
    },
    plugins: [
        new webpack.ProvidePlugin({
            jQuery: 'jquery',
            $: 'jquery',
            'window.jQuery': 'jquery'
        })
    ]
};