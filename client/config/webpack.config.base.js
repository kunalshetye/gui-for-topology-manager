const path = require('path');
const _debug = require('debug');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const postcssUrl = require('postcss-url');

const { NoEmitOnErrorsPlugin, LoaderOptionsPlugin } = require('webpack');
const { GlobCopyWebpackPlugin, BaseHrefWebpackPlugin } = require('@angular/cli/plugins/webpack');
const { CommonsChunkPlugin } = require('webpack').optimize;
const { AotPlugin } = require('@ngtools/webpack');

const nodeModules = path.join(process.cwd(), 'node_modules');
const entryPoints = ["inline","polyfills","sw-register","vendor","main"];
const baseHref = undefined;
const deployUrl = undefined;

const ENVIRONMENT = process.env.NODE_ENV

const debug = _debug('app:webpack:base')
debug('Create configuration.')

const config = {
  paths: {
    _base: "/dist",
    js: "/js",
    css: "/css"
  }
}

module.exports = {
  devtool: "source-map",
  resolve: {
    extensions: [
      ".ts",
      ".js",
      ".scss"
    ],
    modules: [
      "./node_modules"
    ]
  },
  resolveLoader: {
    modules: [
      "./node_modules"
    ]
  },
  entry: {
    main: [
      'webpack-dev-server/client?http://0.0.0.0:4200',
      "./src\\main.ts",
      "./src\\scss-base\\main.scss"
    ]
  },
  output: {
    path: path.join(process.cwd(), config.paths._base),
    filename: path.join(config.paths.js, "[name].bundle.js"),
    chunkFilename: path.join(config.paths.js, "[id].chunk.js")
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        enforce: 'pre',
        loader: 'tslint-loader',
        options: { /* Loader options go here */ }
      },
      {
        enforce: "pre",
        test:  /\.js$/,
        loader:  "source-map-loader",
        exclude: [
          /node_modules/
        ]
      },
      {
        test:  /\.json$/,
        loader:  "json-loader"
      },
      {
        test:  /\.html$/,
        loader:  "raw-loader"
      },
      {
        test:  /\.(eot|svg)$/,
        loader:  "file-loader?name=[name].[hash:20].[ext]"
      },
      {
        test:  /\.(jpg|png|gif|otf|ttf|woff|woff2|cur|ani)$/,
        loader:  "url-loader?name=[name].[hash:20].[ext]&limit=10000"
      },
      {
        exclude: [],
        test:  /\.css$/,
        loaders:  [
          "exports-loader?module.exports.toString()",
          "css-loader?{\"sourceMap\":false,\"importLoaders\":1}",
          "postcss-loader"
        ]
      },
      {
        exclude: [],
        test: /\.scss$|\.sass$/,
        loaders: ExtractTextPlugin.extract([
          "exports-loader?module.exports.toString()",
          "css-loader?{\"sourceMap\":false,\"importLoaders\":1}",
          "postcss-loader",
          "sass-loader"
        ])
      },
      {
        exclude: [],
        test:  /\.less$/,
        loaders:  [
          "exports-loader?module.exports.toString()",
          "css-loader?{\"sourceMap\":false,\"importLoaders\":1}",
          "postcss-loader",
          "less-loader"
        ]
      },
      {
        exclude: [],
        test:  /\.styl$/,
        loaders:  [
          "exports-loader?module.exports.toString()",
          "css-loader?{\"sourceMap\":false,\"importLoaders\":1}",
          "postcss-loader",
          "stylus-loader?{\"sourceMap\":false,\"paths\":[]}"
        ]
      },
      {
        test:  /\.ts$/,
        loader:  "@ngtools/webpack"
      }
    ]
  },
  plugins: [
    new NoEmitOnErrorsPlugin(),
    new GlobCopyWebpackPlugin({
      patterns: [
        "favicon.ico"
      ],
      globOptions: {
        cwd: process.cwd() + "/src",
        dot: true,
        ignore: "**/.gitkeep"
      }
    }),
    new ProgressPlugin(),
    new HtmlWebpackPlugin({
      "template": "./src\\index.html",
      "filename": "./index.html",
      "hash": false,
      "inject": true,
      "compile": true,
      "favicon": false,
      "minify": false,
      "cache": true,
      "showErrors": true,
      "chunks": "all",
      "excludeChunks": [],
      "title": "Webpack App",
      "xhtml": true,
      "chunksSortMode": function sort(left, right) {
        let leftIndex = entryPoints.indexOf(left.names[0]);
        let rightindex = entryPoints.indexOf(right.names[0]);
        if (leftIndex > rightindex) {
            return 1;
        }
        else if (leftIndex < rightindex) {
            return -1;
        }
        else {
            return 0;
        }
    }
    }),
    new BaseHrefWebpackPlugin({}),
    new CommonsChunkPlugin({
      name: "inline",
      minChunks: null
    }),
    new CommonsChunkPlugin({
      name: "vendor",
      minChunks: (module) => module.resource && module.resource.startsWith(nodeModules),
      chunks: [
        "main"
      ]
    }),
    new ExtractTextPlugin({
       filename: path.join(config.paths.css, '[name].bundle.css'),
      allChunks: true,
    }),
    new LoaderOptionsPlugin({
      sourceMap: false,
      options: {
        postcss: [
          autoprefixer(),
          postcssUrl({"url": (URL) => {
            // Only convert absolute URLs, which CSS-Loader won't process into require().
            //if (!URL.startsWith('/')) {
            //    return URL;
            //}
            // Join together base-href, deploy-url and the original URL.
            // Also dedupe multiple slashes into single ones.
            return `/${baseHref || ''}/${deployUrl || ''}/${URL}`.replace(/\/\/+/g, '/');
        }})
        ],
        sassLoader: {
          sourceMap: false,
          includePaths: []
        },
        lessLoader: {
          sourceMap: false
        },
        context: ""
      }
    }),
    new AotPlugin({
      mainPath: "main.ts",
      hostReplacementPaths: {
        "environments\\environment.ts": "environments\\environment.ts"
      },
      exclude: [],
      tsConfigPath: "src\\tsconfig.json",
      skipCodeGeneration: true
    })
  ],
  node: {
    "fs": "empty",
    "global": true,
    "crypto": "empty",
    "tls": "empty",
    "net": "empty",
    "process": true,
    "module": false,
    "clearImmediate": false,
    "setImmediate": false
  }
};
