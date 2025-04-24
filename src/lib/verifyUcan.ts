import * as ucans from '@ucans/ucans';
import { PRIVATE_SERVER_KEY, PRIVATE_ROOT_ISSUER_DID_KEY } from '$env/static/private';

export async function verifyUcan(encodedUcan: string, recipient: string, action: string) {
    if (!PRIVATE_SERVER_KEY) {
        throw new Error('Server DID key is not configured');
    }

    if (!PRIVATE_ROOT_ISSUER_DID_KEY) {
        throw new Error('Root issuer DID key is not configured');
    }

    const keypair = ucans.EdKeypair.fromSecretKey(PRIVATE_SERVER_KEY);
    const serverDidKey = keypair.did();
    const rootIssuerDidKey = PRIVATE_ROOT_ISSUER_DID_KEY;

    const result = await ucans.verify(encodedUcan, {
        audience: serverDidKey,
        requiredCapabilities: [
            {
                capability: {
                    with: { scheme: "mailto", hierPart: recipient },
                    can: { namespace: "email", segments: [action] }
                },
                rootIssuer: rootIssuerDidKey,
            }
        ],
        isRevoked: async () => false
    })

    if (result.ok) {
        return result.value;
    } else {
        throw new Error('Unauthorized: ' + result.error);
    }
}