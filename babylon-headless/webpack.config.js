const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = [
	{
		mode: 'development',
		entry: './src/assets/theCube/app.js', // rect: './src/assets/theRect/app.js'
		devtool: 'inline-source-map',
		plugins: [
			new HtmlWebpackPlugin({
				title: 'Headless Babylon',
				template: 'src/index.html',
			})
		],
		output: {
			filename: 'bundle.js',
			path: path.resolve(__dirname, 'dist/theCube'),
			clean: true
		}
	},
	{
		mode: 'development',
		entry: './src/assets/theRect/app.js',
		devtool: 'inline-source-map',
		plugins: [
			new HtmlWebpackPlugin({
				title: 'Headless Babylon',
				template: 'src/index.html',
			})
		],
		output: {
			filename: 'bundle.js',
			path: path.resolve(__dirname, 'dist/theRect'),
			clean: true
		}
	}
];