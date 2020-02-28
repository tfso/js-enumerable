/* eslint-disable */
const webpack = require('webpack');

module.exports = {
    entry: {
        lib: ['@babel/polyfill', './src/index.ts'],
        mocha: ['@babel/polyfill', './src/test/enumerable.ts']
    },
    optimization: {
        minimize: true
    },
    output: {
        path: __dirname,
        filename: './lib/bundle-[name].js',
        library: 'jsEnumerable'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|tsx|ts)$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: [
                        '@babel/preset-env',
                        '@babel/preset-typescript'
                    ],
                    plugins: [
                        '@babel/proposal-class-properties',
                        //'@babel/proposal-object-rest-spread'
                    ]
                }
            }
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.jsx', '.tsx', '.ts'],
    },
    plugins: [
        new webpack.ProvidePlugin({
            jsEnumerable: __dirname + '/src/index'
        })
    ]
}