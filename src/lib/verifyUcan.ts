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

    const decoded = ucans.parse(encodedUcan)

    console.log("ISS:", decoded.payload.iss)
    console.log("AUD:", decoded.payload.aud)
    console.log("ATT:", decoded.payload.att)
    console.log("Action:", decoded.payload.att[0].can)
    console.log("EXP:", decoded.payload.exp)
    console.log("PRF:", decoded.payload.prf)

    console.log(serverDidKey);
    console.log(rootIssuerDidKey);
    console.log(encodedUcan);
    console.log(recipient);
    console.log(action);

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

    console.log(result);

    if (result.ok) {
        return result.value;
    } else {
        throw new Error('Unauthorized: ' + result.error);
    }
}