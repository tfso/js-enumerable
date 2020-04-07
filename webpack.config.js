/* eslint-disable */
const webpack = require('webpack');

module.exports = {
    entry: {
        lib: [
            'core-js/modules/es.symbol.async-iterator',
            'core-js/modules/es.symbol',
            './src/index.ts'
        ],
        mocha: [
            'core-js/modules/es.symbol.async-iterator',
            'core-js/modules/es.symbol',
            './src/test/enumerable/primary.ts', 
            './src/test/enumerable/record.ts'
        ]
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
                exclude: [
                    /node_modules/
                ],
                loader: 'babel-loader',
                options: {
                    presets: [
                        ['@babel/preset-env', {
                            useBuiltIns: 'usage',
                            corejs: 3,
                            targets: { chrome: 58, ie: 11 }
                        }],
                        '@babel/preset-typescript'
                    ],
                    plugins: [
                        '@babel/proposal-class-properties',
                        //'@babel/plugin-transform-async-to-generator',
                        //'@babel/proposal-object-rest-spread',
                        //'@babel/plugin-syntax-dynamic-import',
                        [
                            '@babel/plugin-transform-runtime',
                            {
                                corejs: false,
                                helpers: true,
                                regenerator: true,
                                useESModules: true,
                            },
                        ]
                    ]
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.tsx', '.ts'],
    },
    plugins: [
        new webpack.ProvidePlugin({
            jsEnumerable: __dirname + '/src/index'
        })
    ]
}