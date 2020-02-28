// /* eslint-disable */
// let gulp = require("gulp");
// let browserify = require("browserify");
// let babelify = require("babelify");
// let source = require("vinyl-source-stream");

// let config = {
//     src: "src/test/index.ts",
//     filename: "bundle-mocha.js",
//     dest: "./lib"
// };
// let extensions = ['.js', '.ts', '.json'];

// browserify({ extensions })
//     .plugin('tsify', {
//         target: 'es6'
//     })
//     .add(require.resolve('@babel/polyfill'))
//     .transform(babelify.configure({
//         presets: [
//             [
//                 "@babel/env",
//                 {
//                     'targets': {
//                         'browsers': [
//                             "ie >= 11"
//                         ],
//                     },
//                     'modules': false
//                 }
//             ]
//         ],
//         // plugins: [
//         //     ["@babel/plugin-transform-classes", {
//         //         "loose": true
//         //     }]
//         // ],
//         extensions
//     }))
//     .add(config.src)
//     .bundle()
//     .on("error", function(e){
//         console.log(e.message); throw e;
//     })
//     .pipe(source(config.filename))
//     .pipe(gulp.dest(config.dest));