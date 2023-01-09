import Analytics from 'analytics';
import googleAnalytics from '@analytics/google-analytics';
import {appKey, gaId} from '../constants/app';

/* Initialize analytics & load plugins */
const analytics = Analytics({
	app: appKey,
	plugins: [
		googleAnalytics({
			//disable tracking while development
			trackingId: process.env.NODE_ENV === 'development' ? null : gaId,
			customDimensions: {
				// userGroups: 'dimension1',
			},
		}),
	],
});

export default analytics;
