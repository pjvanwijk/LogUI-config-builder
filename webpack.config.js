const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
    entry: {
        popup: ['./src/popup/popup.js'],
        background: ['./src/background-script/background.js'],
        content: ['./src/content-script/content.js']
    },
    optimization: {
        minimize: false
    },
    module: {
        rules: [
            // {
            //     test: /\.html$/,
            //     use: ['html-loader']
            // },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.svg$/,
                use: ['svg-url-loader']
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]'
                }
            },
            {
                test: /\.vue$/,
                use: ['vue-loader']
            }
        ]
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name]_bundle.js',
        publicPath: '/'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/popup/popup.html',
            filename: 'popup.html'
        }),
        new VueLoaderPlugin()
    ]
}