import CryptoJS from "crypto-js";

const secretKey = "erantha-welikala-password-vault-2025";

// Encrypt an object
export function encryptObject(data: Record<string, any>, key: string = secretKey): string {
    const jsonString = JSON.stringify(data);
    const ciphertext = CryptoJS.AES.encrypt(jsonString, key).toString();
    return ciphertext;
}

// Decrypt (for reference)
export function decryptObject(ciphertext: string, key: string = secretKey): Record<string, any> {
    const bytes = CryptoJS.AES.decrypt(ciphertext, key);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
}
