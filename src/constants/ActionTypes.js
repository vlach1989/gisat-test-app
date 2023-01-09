import {commonActionTypes} from '@gisatcz/ptr-state';
import {utils} from '@gisatcz/ptr-utils';

const specificActionTypes = utils.deepKeyMirror({
	APPTEMPLATEREPLACESTORENAME: {},
});

export default {
	...commonActionTypes,
	...specificActionTypes,
};
