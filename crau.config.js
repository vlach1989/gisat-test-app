import {EnvironmentPlugin} from 'webpack';

const publicUrl = '';

module.exports = {
	modifyWebpack: config => {
		const newConfig = {
			...config,
			mode: 'production',
			plugins: [
				...config.plugins,
				new EnvironmentPlugin({
					PUBLIC_URL: publicUrl,
				}),
			],
			module: {
				rules: [
					{
						// test: path.resolve(__dirname, 'node_modules/webworldwind-esa/build/dist/worldwind.min.js'),
						test: '/worldwind.min.js/',
						use: 'null-loader',
					},
					{
						test: /\.js$/,
						use: {
							loader: 'babel-loader',
							options: {
								presets: [
									'cra-universal',
									'@babel/preset-env',
									'@babel/preset-react',
								],
								plugins: [
									'lodash',
									'@babel/plugin-transform-modules-commonjs',
									'@babel/plugin-syntax-dynamic-import',
									'@babel/plugin-proposal-class-properties',
									'@babel/plugin-proposal-optional-chaining',
									'@babel/plugin-proposal-nullish-coalescing-operator',
									'dynamic-import-node',
									'react-loadable/babel',
									[
										'file-loader',
										{
											name: 'static/media/[name].[hash:8].[ext]',
											extensions: ['png', 'jpg', 'jpeg', 'gif', 'svg', 'ico'],
											publicPath: publicUrl,
											outputPath: '/public',
											context: '',
											limit: 0,
											emitFile: false,
										},
									],
								],
							},
						},
					},
					{
						test: /\.s[ac]ss$/i,
						use: [
							'url-loader',
							// Creates `style` nodes from JS strings
							'style-loader',
							// Translates CSS into CommonJS
							'css-loader',
							// Compiles Sass to CSS
							'sass-loader',
						],
					},
					{
						test: /\.css/,
						use: [
							// Translates CSS into CommonJS
							'css-loader?url=false',
							// Compiles Sass to CSS
							// "sass-loader"
						],
					},
					{
						test: /\.svg/,
						use: {
							loader: 'svg-url-loader',
							options: {},
						},
					},
					// {
					// 	test: /\.(jpg|jpeg|gif|png|ico)$/,
					// 	exclude: /node_modules/,
					// 	loader:
					// 		'file-loader?name=img/[path][name].[ext]&context=./app/images',
					// },
				],
			},
		};
		return newConfig;
	},
};
