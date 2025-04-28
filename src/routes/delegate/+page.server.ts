import * as ucans from '@ucans/ucans';
import { PRIVATE_SERVER_KEY } from '$env/static/private';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	if (!PRIVATE_SERVER_KEY) {
		throw new Error('Server DID key is not configured');
	}

	const keypair = ucans.EdKeypair.fromSecretKey(PRIVATE_SERVER_KEY);
	const serverDidKey = keypair.did();
	return { serverDidKey };
};
