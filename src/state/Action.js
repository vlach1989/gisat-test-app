import {config as getConfig} from '@gisatcz/ptr-core';
import {Action as CommonAction} from '@gisatcz/ptr-state';
import {appKey} from '../constants/app';

import * as APPTEMPLATEREPLACESTORENAME from './APPTEMPLATEREPLACESTORENAME/actions'; // eslint-disable-line

require('dotenv').config();

const getAppEnvConfig = () => {
	if (process?.env) {
		const apiBackendProtocol = process.env?.REACT_APP_apiBackendProtocol;
		const apiBackendHost = process.env?.REACT_APP_apiBackendHost;
		const apiBackendPath = process.env?.REACT_APP_apiBackendPath;
		const requestPageSize = process.env?.REACT_APP_requestPageSize;

		return {
			...(apiBackendProtocol ? {apiBackendProtocol} : {}),
			...(apiBackendHost ? {apiBackendHost} : {}),
			...(apiBackendPath ? {apiBackendPath} : {}),
			...(requestPageSize ? {requestPageSize} : {}),
		};
	} else {
		return {};
	}
};

function init(path) {
	return dispatch => {
		dispatch(CommonAction.app.setBaseUrl(path));

		const config = getConfig(getAppEnvConfig());
		dispatch(CommonAction.app.updateLocalConfiguration(config));
		dispatch(CommonAction.app.setKey(appKey));

		dispatch(CommonAction.app.loadConfiguration()).then(() => {
			dispatch(
				CommonAction.layerTemplates.useIndexed(
					{
						application: true,
					},
					null,
					null,
					1,
					100,
					'init'
				)
			);

			dispatch(
				CommonAction.periods.useIndexed(
					{
						application: true,
					},
					null,
					null,
					1,
					100,
					'init'
				)
			);

			//
			// Continue by settings app secific initialisation like setting active view
			//

			// const viewKey = Select.app.getConfiguration(getState(), 'initialViewKey');
			// if (viewKey) {
			// 	dispatch(CommonAction.views.useKeys([viewKey])).then(() => {
			// 		dispatch(CommonAction.views.applyAndSetActive(viewKey, CommonAction));
			// 	});
			// }
		});
	};
}

export default {
	...CommonAction,
	init,
	APPTEMPLATEREPLACESTORENAME: {
		...APPTEMPLATEREPLACESTORENAME,
	},
};
