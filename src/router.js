import {create as createRouter} from '@gisatcz/ptr-router';

// base styles need to be imported before all components
import '@gisatcz/ptr-core/lib/styles/reset.css';
import '@gisatcz/ptr-core/lib/styles/base.scss';
import './styles/index.scss';

let router;

// const getStoreFromRequest = request => {
// 	// store is inside request under Symbol "store"
// 	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol#symbols_and_for...in_iteration
// 	return request[Object.getOwnPropertySymbols(request)[0]];
// };

function createRoutes() {
	return {
		'': {
			name: 'home',
			handler: () => {},
		},
	};
}

/**
 * Creates router instance that can be used to manipulate urls.
 *
 * App handler updates store with current page and it's up to views to react to the change.
 * In case of url change, redux selector possibly retrieves different data and passes them
 * into some the component.
 *
 */
const initRouter = (absPath, currentUrl, Store, isPreloaded, navHandler) => {
	router = createRouter({
		rootUrl: absPath,
		currentUrl,
		routes: createRoutes(),
		navHandler,
		store: Store,
		generateUrlsOptions: {
			stringifyQueryParams: params => new URLSearchParams(params).toString(),
		},
	});

	return router;
};

const getRouter = () => router;

export {getRouter, initRouter};
