const path = require('path');
const SentryWebpackPlugin = require("@sentry/webpack-plugin");
const webpack = require('webpack');

module.exports = {
	configureWebpack(config) {
		const name = path.basename(config.context);
		const output = {
			output: {
				filename: 'js/' + name + '.app.[hash:8].js',
				chunkFilename: 'js/' + name + '.chunk-vendors.[hash:8].js'
			},
			module: {
				rules: [
					{
						test: /\.vue$/,
						use: [
							'cache-loader',
						]
					}
				]
			},
			devtool: 'source-map',
			plugins: []
		};
		const env = {
			PRODUCTION: false,
			SENTRY: false
		};
		if(process.env.NODE_ENV == 'production') {
			if(process.env.SENTRY_AUTH_TOKEN) {
				const date = new Date().toLocaleString('ru-RU', {timeZone: 'Europe/Moscow'}).replace(', ', '-');
				output.plugins.push(new SentryWebpackPlugin({
					org: 'malinovka-team',
					project: 'webapps',
					authToken: process.env.SENTRY_AUTH_TOKEN,
					release: name + '-' + date,
					include: './dist',
					ignore: ['node_modules', 'vue.config.js'],
					setCommits: {
						auto: true,
						ignoreEmpty: true
					}
				}));
				env.SENTRY = true;
			}
			env.PRODUCTION = true;
		}
		output.plugins.push(new webpack.DefinePlugin(env));
		return output;
	},
	chainWebpack: (config) => {
		config.plugin('copy').tap(args => {
			if(process.env.NODE_ENV != 'production') {
				args[0].push({
					from: path.join(args[0][0].from, '/../../assets'),
					to: args[0][0].to,
					toType: 'dir',
					ignore: []
				});
			}
			return args;
		});
	},
	productionSourceMap: true
}