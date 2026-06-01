/**
 * Hashage simple (Amélioration prévue vers SHA-256)
 */
export function hashPassword(password: string): string {
    return btoa(password + 'samci-salt-2024');
}

export function sanitizeInput(str: string): string {
    const map: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return String(str).replace(/[&<>"']/g, m => map[m]);
}