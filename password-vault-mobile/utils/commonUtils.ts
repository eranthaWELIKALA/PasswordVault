import { jwtDecode } from "jwt-decode";

export const isTokenValid = (token: string): boolean => {
    try {
        const decoded = jwtDecode<{ exp: number }>(token);
        return decoded.exp * 1000 > Date.now();
    } catch {
        return false;
    }
};


export function toPascalCase(str: string) {
    return str.replace(/(^\w|_\w)/g, (match) =>
        match.replace("_", "").toUpperCase()
    );
}