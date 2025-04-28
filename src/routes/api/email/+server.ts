import { verifyUcan } from '$lib/verifyUcan';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request }) => {
	const xPublicKey = request.headers.get('X-Public-Key');
	const authHeader = request.headers.get('Authorization');

	if (!xPublicKey) {
		return new Response('Missing X-Public-Key', { status: 401 });
	}

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return new Response('Missing or malformed Authorization', { status: 401 });
	}

	const token = authHeader.split(' ')[1];
	const publicDid = 'did:key:z' + xPublicKey;

	try {
		const result = await verifyUcan(token, publicDid, 'read');
		return new Response(JSON.stringify(result));
	} catch (error) {
		return new Response('Unauthorized: ' + error, { status: 401 });
	}
};

export const POST: RequestHandler = async ({ request }) => {
	const xPublicKey = request.headers.get('X-Public-Key');
	const authHeader = request.headers.get('Authorization');

	if (!xPublicKey) {
		return new Response('Missing X-Public-Key', { status: 401 });
	}

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return new Response('Missing or malformed Authorization', { status: 401 });
	}

	const token = authHeader.split(' ')[1];
	const publicDid = 'did:key:z' + xPublicKey;

	try {
		const result = await verifyUcan(token, publicDid, 'create');
		return new Response(JSON.stringify(result));
	} catch (error) {
		return new Response('Unauthorized: ' + error, { status: 401 });
	}
};

export const DELETE: RequestHandler = async ({ request }) => {
	const xPublicKey = request.headers.get('X-Public-Key');
	const authHeader = request.headers.get('Authorization');

	if (!xPublicKey) {
		return new Response('Missing X-Public-Key', { status: 401 });
	}

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return new Response('Missing or malformed Authorization', { status: 401 });
	}

	const token = authHeader.split(' ')[1];
	const publicDid = 'did:key:z' + xPublicKey;

	try {
		const result = await verifyUcan(token, publicDid, 'delete');
		return new Response(JSON.stringify(result));
	} catch (error) {
		return new Response('Unauthorized: ' + error, { status: 401 });
	}
};
