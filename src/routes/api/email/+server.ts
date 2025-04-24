import { verifyUcan } from '$lib/verifyUcan';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request }) => {
    const xDID = request.headers.get('X-DID');
    const authHeader = request.headers.get("Authorization")

    if (!xDID) {
        return new Response("Missing X-Public-Key", { status: 401 })
    }

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return new Response("Missing or malformed Authorization", { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    try {
        const result = await verifyUcan(token, xDID, 'read');
        return new Response(JSON.stringify(result));
    } catch (error) {
        return new Response("Unauthorized: " + error, { status: 401 });
    }
}