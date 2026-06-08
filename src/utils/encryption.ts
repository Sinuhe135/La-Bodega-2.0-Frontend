const ALGORITHM = 'AES-CBC';
const IV_LENGTH = 16;

async function importKey(key: string): Promise<CryptoKey> {
    return crypto.subtle.importKey(
        'raw',
        fromBase64(key),
        { name: ALGORITHM },
        false,
        ['encrypt', 'decrypt']
    );
}

function toBase64(buffer: ArrayBuffer | Uint8Array): string {
    const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
    return btoa(String.fromCharCode(...bytes));
}

function fromBase64(b64: string): Uint8Array<ArrayBuffer> {
    return new Uint8Array(Array.from(atob(b64), c => c.charCodeAt(0)));
}

export function generateKey(): string {
    return toBase64(crypto.getRandomValues(new Uint8Array(32)));
}

export async function encrypt(text: string, key: string): Promise<string> {
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
    const cryptoKey = await importKey(key);
    const encrypted = await crypto.subtle.encrypt(
        { name: ALGORITHM, iv },
        cryptoKey,
        new TextEncoder().encode(text)
    );
    return toBase64(iv) + ':' + toBase64(encrypted);
}

export async function decrypt(encryptedData: string, key: string): Promise<string> {
    const [ivB64, encryptedB64] = encryptedData.split(':');
    const cryptoKey = await importKey(key);
    const decrypted = await crypto.subtle.decrypt(
        { name: ALGORITHM, iv: fromBase64(ivB64) },
        cryptoKey,
        fromBase64(encryptedB64)
    );
    return new TextDecoder().decode(decrypted);
}
