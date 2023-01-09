import path from 'path';

import {createReactAppExpress} from '@cra-express/core';
import {Provider} from '@gisatcz/ptr-state';
import createStore from '../src/state/Store';
import {UIDReset} from 'react-uid';
import {createRenderFn} from '@gisatcz/ptr-core';
import Loadable from 'react-loadable';

let App = require('../src/app').App;
const clientBuildPath = path.resolve(__dirname, '../client');

function handleUniversalRender(req, res) {
	const absPath = req.protocol + '//' + req.hostname + process.env.PUBLIC_URL;
	let requiredUrl = req.url;
	const navHandler = url => {
		requiredUrl = url;
	};

	const {store, requestCounter} = createStore(
		{
			absPath,
			currentUrl: req.url,
			navHandler,
		},
		{}
	);
	req.store = store;

	const createElFn = () => {
		let modules = [];
		const appEl = (
			<UIDReset>
				<Provider store={store}>
					<Loadable.Capture report={moduleName => modules.push(moduleName)}>
						<App />
					</Loadable.Capture>
				</Provider>
			</UIDReset>
		);

		// console.log("Preloaded modules:", modules);

		if (requiredUrl != req.url) {
			res.redirect(301, requiredUrl);
			return;
		}

		return appEl;
	};

	const renderFn = createRenderFn({
		requestCounter,
		createElFn,
	});

	// return requestCounter.createReadyP().then(() => renderFn());
	// temporary hack
	// wait 500ms until store is updated
	return requestCounter.createReadyP().then(() => {
		const p = new Promise(resolve => {
			setTimeout(() => {
				resolve(renderFn());
			}, 500);
		});

		return p;
	});
}

function resolveHtmlFilenameByRequest() {
	return process.env.PUBLIC_URL;
}

const app = createReactAppExpress({
	clientBuildPath,
	resolveHtmlFilenameByRequest,
	universalRender: handleUniversalRender,
	handleRender(req, res, data, rawTemplateHtml) {
		const state = req.store.getState();

		const templateHtml = rawTemplateHtml.replace(
			'<title>Loading...</title>',
			data.helmet.title.toString()
		);

		const [beginHtml, endHtml] = templateHtml.split(`<div id="root"></div>`);
		const preloadedStateHtml = `<script>window.__PRELOADED_STATE__ = ${JSON.stringify(
			state
		).replace(/</g, '\\u003c')};</script>`;

		const finalHtml = `${beginHtml}<div id="root">${data.html}</div>${preloadedStateHtml}${endHtml}`;

		res.send(finalHtml);
	},
});

if (module.hot) {
	module.hot.accept('../src/app', () => {
		App = require('../src/app').App;
		console.log('✅ Server hot reloaded App');
	});
}

export default app;
