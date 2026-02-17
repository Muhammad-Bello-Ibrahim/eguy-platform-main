/**
 * Biometric Authentication Utility
 * Uses Web Authentication API (WebAuthn) for fingerprint/FaceID login
 */

export interface BiometricCredential {
    id: string;
    publicKey: string;
    counter: number;
    createdAt: Date;
    deviceName?: string;
}

/**
 * Check if biometric authentication is available in the current browser
 */
export function isBiometricAvailable(): boolean {
    return !!(
        window.PublicKeyCredential &&
        navigator.credentials &&
        navigator.credentials.create
    );
}

/**
 * Convert ArrayBuffer to Base64 string
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

/**
 * Convert Base64 string to ArrayBuffer
 */
function base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
}

/**
 * Register a new biometric credential
 * @param userId - User's unique identifier
 * @param userName - User's name or email
 * @returns Credential data to be stored in the database
 */
export async function registerBiometric(
    userId: string,
    userName: string
): Promise<BiometricCredential> {
    if (!isBiometricAvailable()) {
        throw new Error('Biometric authentication is not supported in this browser');
    }

    try {
        // Generate a challenge (in production, this should come from the server)
        const challenge = new Uint8Array(32);
        crypto.getRandomValues(challenge);

        // Create credential options
        const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
            challenge,
            rp: {
                name: 'eGuy Platform',
                id: window.location.hostname,
            },
            user: {
                id: new TextEncoder().encode(userId),
                name: userName,
                displayName: userName,
            },
            pubKeyCredParams: [
                { alg: -7, type: 'public-key' }, // ES256
                { alg: -257, type: 'public-key' }, // RS256
            ],
            authenticatorSelection: {
                authenticatorAttachment: 'platform', // Use platform authenticator (FaceID, TouchID, Windows Hello)
                userVerification: 'required',
                requireResidentKey: false,
            },
            timeout: 60000,
            attestation: 'none',
        };

        // Create the credential
        const credential = await navigator.credentials.create({
            publicKey: publicKeyCredentialCreationOptions,
        }) as PublicKeyCredential;

        if (!credential) {
            throw new Error('Failed to create credential');
        }

        const response = credential.response as AuthenticatorAttestationResponse;

        // Extract and encode the credential data
        const credentialData: BiometricCredential = {
            id: credential.id,
            publicKey: arrayBufferToBase64(response.getPublicKey()!),
            counter: 0,
            createdAt: new Date(),
            deviceName: navigator.userAgent.includes('iPhone') ? 'iPhone' :
                navigator.userAgent.includes('iPad') ? 'iPad' :
                    navigator.userAgent.includes('Mac') ? 'Mac' :
                        navigator.userAgent.includes('Windows') ? 'Windows PC' :
                            navigator.userAgent.includes('Android') ? 'Android' : 'Device',
        };

        return credentialData;
    } catch (error: any) {
        if (error.name === 'NotAllowedError') {
            throw new Error('Biometric authentication was cancelled or not allowed');
        } else if (error.name === 'NotSupportedError') {
            throw new Error('Biometric authentication is not supported on this device');
        } else {
            throw new Error(`Failed to register biometric: ${error.message}`);
        }
    }
}

/**
 * Authenticate using biometric credential
 * @param credentialIds - Array of credential IDs to allow
 * @returns Authentication data to be verified by the server
 */
export async function authenticateWithBiometric(
    credentialIds: string[]
): Promise<{
    credentialId: string;
    authenticatorData: string;
    clientDataJSON: string;
    signature: string;
}> {
    if (!isBiometricAvailable()) {
        throw new Error('Biometric authentication is not supported in this browser');
    }

    if (credentialIds.length === 0) {
        throw new Error('No biometric credentials registered');
    }

    try {
        // Generate a challenge (in production, this should come from the server)
        const challenge = new Uint8Array(32);
        crypto.getRandomValues(challenge);

        // Create authentication options
        const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
            challenge,
            allowCredentials: credentialIds.map(id => ({
                id: base64ToArrayBuffer(id),
                type: 'public-key',
                transports: ['internal'] as AuthenticatorTransport[],
            })),
            timeout: 60000,
            userVerification: 'required',
        };

        // Get the credential
        const credential = await navigator.credentials.get({
            publicKey: publicKeyCredentialRequestOptions,
        }) as PublicKeyCredential;

        if (!credential) {
            throw new Error('Failed to authenticate');
        }

        const response = credential.response as AuthenticatorAssertionResponse;

        // Return authentication data
        return {
            credentialId: credential.id,
            authenticatorData: arrayBufferToBase64(response.authenticatorData),
            clientDataJSON: arrayBufferToBase64(response.clientDataJSON),
            signature: arrayBufferToBase64(response.signature),
        };
    } catch (error: any) {
        if (error.name === 'NotAllowedError') {
            throw new Error('Biometric authentication was cancelled or not allowed');
        } else if (error.name === 'NotFoundError') {
            throw new Error('No matching biometric credential found');
        } else {
            throw new Error(`Failed to authenticate: ${error.message}`);
        }
    }
}

/**
 * Get a user-friendly name for the biometric type
 */
export function getBiometricName(): string {
    const ua = navigator.userAgent;
    if (ua.includes('iPhone') || ua.includes('iPad')) {
        return 'Face ID / Touch ID';
    } else if (ua.includes('Mac')) {
        return 'Touch ID';
    } else if (ua.includes('Windows')) {
        return 'Windows Hello';
    } else if (ua.includes('Android')) {
        return 'Fingerprint';
    }
    return 'Biometric';
}
