const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const TsConfigsPathsWebpackPlugin = require('tsconfig-paths-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        plugins: [
            new TsConfigsPathsWebpackPlugin({
                configFile: path.resolve(__dirname,"tsconfig.json")
            })
        ]
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                include: [
                    path.resolve(__dirname,"Client/*"),
                    path.resolve(__dirname,"Client/Components/*")
                ],
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: "awesome-typescript-loader"
                }
            },
            {
                test: /\.(png|jp(e*)g|svg|eot|ttf|woff(2*))$/,
                use: [{loader: "url-loader"}]
            },
            {
                test: /\.(s*)[ca]ss$/,
                exclude: /node_modules/,
                use : [{
                    loader: "style-loader"
                },{
                    loader: "css-loader"
                },{
                    loader: "sass-loader"
                }]
            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: path.resolve(__dirname,"Client/index.html")
        })
    ],
    entry: "./Client/index.tsx",
    output: {
        path: path.join(__dirname,"Build"),
        filename: "bundle.min.js"
    }
};