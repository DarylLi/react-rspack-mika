const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const terserPlugin = require("terser-webpack-plugin");
const rspack = require("@rspack/core");
const { defineConfig } = require("@rspack/cli");

const webpack = require("webpack");
const config = defineConfig({
  mode: "development",
  // entry: [path.join(__dirname,'/src/main.js'),path.join(__dirname,'/src/extra.js'),path.join(__dirname,'/src/haha.js')],
  entry: {
    main: path.join(__dirname, "/src/app.jsx"),
  },
  output: {
    path: path.join(__dirname, "/build"),
    filename: "[name].bundle.js",
    libraryTarget: "umd",
    library: "[name]_kuroMi",
  },
  module: {
    rules: [
      {
        test: /\.css$/, // 正则匹配以.css结尾的文件
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(scss|sass)$/, // 正则匹配以.scss和.sass结尾的文件
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(tsx?)|(ts?)$/,
        exclude: [/node_modules/],
        loader: "builtin:swc-loader",
        options: {
          jsc: {
            parser: {
              syntax: "typescript",
            },
          },
        },
        type: "javascript/auto",
      },
      {
        test: /\.(jsx?)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  targets:
                    "iOS 9, Android 4.4, last 2 versions, > 0.2%, not dead",
                },
              ],
              ["@babel/preset-react"],
            ],
          },
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          name: "img/[name].[hash:7].[ext]",
        },
      },
      {
        test: path.resolve(__dirname, "node_modules/webpack-dev-server/client"),
        loader: "null-loader",
      },
    ],
  },
  devServer: {
    open: true,
    port: "9000",
    allowedHosts: [
      "host.com",
      "subdomain.host.com",
      "subdomain2.host.com",
      "host2.com",
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "index.html",
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
      },
    }),
    new CleanWebpackPlugin(),
    new rspack.HotModuleReplacementPlugin(),
  ],
  optimization: {
    minimize: true,
    minimizer: [new terserPlugin()],
  },
  resolve: {
    extensions: [".ts", ".js", ".tsx", ".jsx", ".wasm"],
    alias: {
      "@components": path.resolve(__dirname, "src/components/"),
      "@constants": path.resolve(__dirname, "src/constants/"),
      "@mock": path.resolve(__dirname, "src/mock/"),
      "@store": path.resolve(__dirname, "src/store/"),
      "@utils": path.resolve(__dirname, "src/utils/"),
      "@server": path.resolve(__dirname, "server/"),
      "@pkg": path.resolve(__dirname, "pkg/"),
    },
  },
});

// const devserver = new WebpackDevServer(
//   {
//     headers: { "Access-Control-Allow-Origin": "*" },
//     hot: true, // 热更新
//     host: "127.0.0.1", // 地址
//     port: "8081", // 端口
//     open: true, // 是否自动打开
//     setupExitSignals: true,
//     compress: true,
//   },
//   webpack(config)
// );
// devserver.start();

module.exports = config;
