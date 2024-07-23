const path = require("path");
const fs = require("fs");
var webpack = require('webpack');
const {
  CleanWebpackPlugin
} = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackInlineSVGPlugin = require('html-webpack-inline-svg-plugin');


function generateHtmlPlugins(templateDir) {
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
  return templateFiles.map((item) => {
    const parts = item.split(".");
    const name = parts[0];
    const extension = parts[1];
    return new HtmlWebpackPlugin({
      filename: `${name}.html`,
      template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
      inject: false,
    });
  });
}

const htmlPlugins = generateHtmlPlugins("./src/html/views");

const config = {
  entry: ["./src/js/index.js", "./src/scss/responsive.scss"],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "./js/bundle.js",
  },
  devtool: "source-map",
  mode: "production",
  optimization: {
    minimize: false,
    minimizer: [
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            "default",
            {
              discardComments: {
                removeAll: true
              },
            },
          ],
        },
      }),
      new TerserPlugin({
        extractComments: true,
      }),
    ],
  },
  module: {
    rules: [{
        test: /\.(sass|scss)$/,
        include: path.resolve(__dirname, "src/scss"),
        use: [{
            loader: MiniCssExtractPlugin.loader,
            options: {},
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
              url: false,
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.html$/,
        include: path.resolve(__dirname, "src/html/includes"),
        use: ["raw-loader"],
      },
    ],
  },
  plugins: [
    /*  new webpack.ProvidePlugin({
       $: 'jquery',
       jQuery: 'jquery',
       'window.jQuery': 'jquery'
     }), */
     new HtmlWebpackInlineSVGPlugin(),
    new MiniCssExtractPlugin({
      filename: "./css/style.bundle.css",
    }),
    new CopyPlugin({
      patterns: [{
          from: "./src/fonts",
          to: "./fonts",
        },
       
        {
          from: "./src/img",
          to: "./img",
        },
        {
          from: "./src/js",
          to: "./js",
        },
        {
          from: "./src/css",
          to: "./css",
        }

      ],
    }),
  ].concat(htmlPlugins),
};

module.exports = (env, argv) => {
  if (argv.mode === "production") {
    config.plugins.push(new CleanWebpackPlugin());
  }
  return config;
};