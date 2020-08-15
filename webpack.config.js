const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

// Paths
const entry = './src/js/app.js';
const includePath = path.join(__dirname, 'src/js');
const nodeModulesPath = path.join(__dirname, 'node_modules');

let outputPath = path.join(__dirname, 'public/js');
let outputDir = path.join(__dirname, 'public');

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
    let plugins = [
        new webpack.DefinePlugin({
            __ENV__: JSON.stringify(env.NODE_ENV)
        })
    ];
    
    
    
    // Prod environment
    if (env.NODE_ENV === 'prod') {
        devtool = 'hidden-source-map';
        mode = 'production';
        stats = 'none';
        outputPath = path.join(__dirname, "build/js");
        outputDir = path.join(__dirname, "build");
    }
    
    console.log('Webpack build -');
    console.log(`    - ENV: ${env.NODE_ENV}`);
    console.log(`    - outputPath  ${outputPath}`);
    console.log(`    - includePath ${includePath}`);
    console.log(`    - nodeModulesPath: ${nodeModulesPath}`);
    
    
    const compilerWebClientJs ={
        name: "webClientJs",
        entry: [
            entry,
        ],
        output: {
            path: outputPath,
            publicPath: 'js',
            filename: 'app.js'
        },
        mode,
        module: {
            rules: [
                {
                    test: /\.js?$/,
                    use: {
                        loader: 'babel-loader',
                    },
                    include: includePath,
                    exclude: nodeModulesPath,
                    //presets: ["@babel/es2015", "@babel/react", "@babel/stage-0"]
                },
                {
                    test: /\.(vsh|fsh|glsl)$/,
                    use:{
                        loader: 'glsl-shader-loader',
                        options: {}
                    },
                    include: includePath,
                    exclude: nodeModulesPath,
                    
                }
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

            ]
        },
        
        // options for resolving module requests
        // (does not apply to resolving to loaders)
        resolve: {
            // directories where to look for modules,
            modules: [
                'node_modules',
                path.resolve(__dirname, 'src')
            ],
            
            extensions: ['.js', '.json'],
        },
        
        performance: {
            hints: 'warning'
        },
        
        // lets you precisely control what bundle information gets displayed
        stats,
        
        // enhance debugging by adding meta info for the browser devtools
        // source-map most detailed at the expense of build speed.
        //devtool,
        devtool: 'source-map',
        
        devServer: {
            contentBase: 'public',
            open: true, 
            openPage: 'localhost:9001?use2d=0&highQuality=1&bloom=0&address=localhost:',
            port: 9001,
            watchOptions: {
                aggregateTimeout: 200,
                poll: 1000
            }
        },
        
        plugins:[
            new HtmlWebpackPlugin({
                title: 'stdogViz',
                template: path.join(__dirname, 'src/html/index.html'),
              //  filename: path.join(__dirname, 'public/index.html'),
                env: env.NODE_ENV,
            }),
        ],
        optimization: {
            minimizer: [
                new UglifyJsPlugin({
                    cache: true,
                    parallel: true,
                    sourceMap: true // set to true if you want JS source maps
                }),
                //new OptimizeCSSAssetsPlugin({})
            ],
            runtimeChunk: 'single',
            
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        test: /[\\\/]node_modules[\\\/]/,
                        name: 'vendors',
                        chunks: 'all'
                    },
                }
            }
        }
    };
    const compilerJupyterClient ={
        name: "jupyterClient",
        entry: [
            './src/js/appJupyter.js',
        ],
        output: {
            path: outputPath,
            publicPath: 'js',
            filename: 'appJupyter.js'
        },
        //mode,
        mode:    'production',
        module: {
            rules: [
                {
                    test: /\.js?$/,
                    use: {
                        loader: 'babel-loader',
                    },
                    include: includePath,
                    exclude: nodeModulesPath,
                },
                {
                    test: /\.(vsh|fsh|glsl)$/,
                    use:{
                        loader: 'glsl-shader-loader',
                        options: {}
                    },
                    include: includePath,
                    exclude: nodeModulesPath,
                    
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
            ]
        },
        
        // options for resolving module requests
        // (does not apply to resolving to loaders)
        resolve: {
            // directories where to look for modules,
            modules: [
                'node_modules',
                path.resolve(__dirname, 'src')
            ],
            
            extensions: ['.js', '.json'],
        },
        
        performance: {
            hints: 'warning'
        },
        
        // lets you precisely control what bundle information gets displayed
        stats,
        
        // enhance debugging by adding meta info for the browser devtools
        // source-map most detailed at the expense of build speed.
        devtool,
        
        devServer: {
            contentBase: 'src/public',
            
            open:false,
            hot:true,
        },
        
        optimization: {
            //minimizer: [
            //new UglifyJsPlugin({
            //cache: false,
            //parallel: true,
            //sourceMap: false // set to true if you want JS source maps
            //}),
            //////new OptimizeCSSAssetsPlugin({})
            //],
            //runtimeChunk: 'single',
            
            //splitChunks: {
            //cacheGroups: {
            //vendor: {
            //test: /[\\\/]node_modules[\\\/]/,
            //name: 'vendors',
            //chunks: 'all'
            //},
            //}
            //}
            
        }
    };
    
    return [
        compilerWebClientJs,
        //compilerJupyterClient
        //compilerWebClientHTML,
    ]
};