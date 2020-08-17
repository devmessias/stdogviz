const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Paths
const entry = './src/js/app.js';
const includePath = path.join(__dirname, 'src/js');
const includePathHTML = path.join(__dirname, 'src/html');

const nodeModulesPath = path.join(__dirname, 'node_modules');

let outputPath = path.join(__dirname, 'python/stdogviz/bin/html/js');
let outputDir = path.join(__dirname, 'python/stdogviz/bin/html');

const files = {
    appWebClientJs:{
        entryPoint: './src/js/app.js',
        outputPath: `${outputDir}/js`
    },
}

module.exports = env => {
    // Dev environment
    let devtool = 'eval';
    let mode = 'development';
    let stats = 'minimal';
    // let plugins = [
    //     new webpack.DefinePlugin({
    //         __ENV__: JSON.stringify(env.NODE_ENV)
    //     })
    // ];
    
    
    
    // Prod environment
    if (env.NODE_ENV === 'prod') {
        devtool = 'hidden-source-map';
        mode = 'production';
        stats = 'none';
        outputPath = path.join(__dirname, "python/stdogviz/bin/html/js");
        outputDir = path.join(__dirname, "python/stdogviz/bin/html");
    }
    
    console.log('Webpack build -');
    console.log(`    - ENV: ${env.NODE_ENV}`);
    console.log(`    - outputPath  ${outputPath}`);
    console.log(`    - includePath ${includePath}`);
    console.log(`    - nodeModulesPath: ${nodeModulesPath}`);
    
    
    const compilerWebClientJs = {
      name: "webClientJs",
      entry: [entry],
      output: {
        path: outputPath,
        publicPath: "js",
        filename: "app.js",
      },
      mode,
      module: {
        rules: [
          {
            test: /\.js?$/,
            use: {
              loader: "babel-loader",
            },
            include: includePath,
            exclude: nodeModulesPath,
            //presets: ["@babel/es2015", "@babel/react", "@babel/stage-0"]
          },
         
          //{
          //test: /\.html$/,
          //////include: path.join(__dirname, 'src/html'),
          //// use: ['html-loader?interpolate']
          //use:[
          ////{
          ////loader: 'html-loader',
          ////},
          //]
          //}
        ],
      },

      // options for resolving module requests
      // (does not apply to resolving to loaders)
      resolve: {
        // directories where to look for modules,
        modules: ["node_modules", path.resolve(__dirname, "src")],

        extensions: [".js", ".json"],
      },

      performance: {
        hints: "warning",
      },

      // lets you precisely control what bundle information gets displayed
      stats,

      // enhance debugging by adding meta info for the browser devtools
      // source-map most detailed at the expense of build speed.
      //devtool,
      devtool: "source-map",

      devServer: {
        contentBase: path.join(__dirname, "python/stdogviz/bin/html"),
        //publicPath:  path.join(__dirname, 'build/'),
        //historyApiFallback: true,
        open: true,
        openPage:
          "localhost:9001?use2d=0&highQuality=1&bloom=0&address=localhost:5000",
        port: 9001,
        watchOptions: {
          aggregateTimeout: 200,
          poll: 1000,
        },
      },

      plugins: [
        new webpack.DefinePlugin({
          __ENV__: JSON.stringify(env.NODE_ENV),
        }),
        new HtmlWebpackPlugin({
          title: "stdogViz",
          // alwaysWriteToDisk: true,
          //inject: false,

          template: path.join(__dirname, "src/html/index.html"),
          filename: "../index.html",
          env: env.NODE_ENV,
        }),
      ],
      optimization: {
        // minimizer: [
        //   new UglifyJsPlugin({
        //     cache: false,
        //     parallel: true,
        //     sourceMap: true, // set to true if you want JS source maps
        //   }),
        // ],
        // runtimeChunk: "single",

        // splitChunks: {
        //   cacheGroups: {
        //     vendor: {
        //       test: /[\\\/]node_modules[\\\/]/,
        //       name: "vendors",
        //       chunks: "all",
        //     },
        //   },
        // },
        // }
      },
    };
    
    return [
        compilerWebClientJs,
        //compilerWebClientHTML,
    ]
};