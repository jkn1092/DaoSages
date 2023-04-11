import { InMemoryCache } from '@apollo/client';
import {getAddressVar, isBrainerVar, isFinderVar, isWiseVar} from './service';

export const cache = new InMemoryCache({
	typePolicies: {
		Query: {
			fields: {
				isFinder: {
					read() {
						return isFinderVar();
					},
				},
				isBrainer: {
					read() {
						return isBrainerVar();
					},
				},
				isWise: {
					read() {
						return isWiseVar();
					},
				},
				getAddress: {
					read() {
						return getAddressVar();
					},
				},
			},
		},
	},
});
