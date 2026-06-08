const ALGORITHM = 'AES-CBC';
const IV_LENGTH = 16;

async function importKey(key: Uint8Array<ArrayBuffer>): Promise<CryptoKey> {
    return crypto.subtle.importKey(
        'raw',
        key,
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

export async function hashKey(key: Uint8Array<ArrayBuffer>): Promise<string> {
    const hash = await crypto.subtle.digest('SHA-256', key);
    return toBase64(hash);
}

export function generateKey(): Uint8Array<ArrayBuffer> {
    return crypto.getRandomValues(new Uint8Array(32));
}

export function downloadKey(key: Uint8Array<ArrayBuffer>, filename = 'encryption.key'): void {
    const blob = new Blob([toBase64(key)], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

export function uploadKey(file: File): Promise<Uint8Array<ArrayBuffer>> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(fromBase64((reader.result as string).trim()));
        reader.onerror = () => reject(new Error('Failed to read key file'));
        reader.readAsText(file);
    });
}

export async function encrypt(text: string, key: Uint8Array<ArrayBuffer>): Promise<string> {
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
    const cryptoKey = await importKey(key);
    const encrypted = await crypto.subtle.encrypt(
        { name: ALGORITHM, iv },
        cryptoKey,
        new TextEncoder().encode(text)
    );
    return toBase64(iv) + ':' + toBase64(encrypted);
}

export async function decrypt(encryptedData: string, key: Uint8Array<ArrayBuffer>): Promise<string> {
    const [ivB64, encryptedB64] = encryptedData.split(':');
    const cryptoKey = await importKey(key);
    const decrypted = await crypto.subtle.decrypt(
        { name: ALGORITHM, iv: fromBase64(ivB64) },
        cryptoKey,
        fromBase64(encryptedB64)
    );
    return new TextDecoder().decode(decrypted);
}
