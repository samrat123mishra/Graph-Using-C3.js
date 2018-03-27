module.exports = function(config) {
    config.set({

        browsers: ['PhantomJS'],

        files: [
            { pattern: 'test-context.js' }
        ],
        plugins: [
            'karma-jasmine',
            'karma-phantomjs-launcher',
            'karma-jasmine',
            'karma-coverage',
            'karma-webpack' // *** This 'registers' the Karma webpack plugin.
        ],
        frameworks: ['jasmine'],

        preprocessors: {
            'test-context.js': ['webpack'],
            'src/**/*.js': ['coverage']
        },
        coverageReporter: {
            dir: './build/coverage/',
            reporters: [
                { type: 'html' }
            ]
        },
        reporters: ['progress', 'coverage'],
        singleRun: true,
        webpack: {
            module: {
                preLoaders: [{
                    test: /\.js?$/,
                    exclude: [
                        /node_modules/,
                        /\.spec\.js/
                    ],
                    loader: 'isparta-instrumenter-loader'
                }],
                loaders: [
                    { test: /\.js/, exclude: /node_modules/, loader: 'babel-loader' }
                ]
            },
            watch: true
        }
    });
};