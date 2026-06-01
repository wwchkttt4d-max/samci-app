import { Product } from '../types';

function calculateTotal(items: { prix: number, qty: number }[]): number {
    return items.reduce((sum, item) => sum + (item.prix * item.qty), 0);
}

describe('Système de Vente AVICO-PRO', () => {
    test('Calcul correct du total du panier', () => {
        const cart = [
            { prix: 1800, qty: 2 }, // 3600
            { prix: 2200, qty: 1 }  // 2200
        ];
        expect(calculateTotal(cart)).toBe(5800);
    });

    test('Le total doit être 0 si le panier est vide', () => {
        expect(calculateTotal([])).toBe(0);
    });

    test('Gestion des prix négatifs (sécurité)', () => {
        const cart = [{ prix: -100, qty: 1 }];
        expect(calculateTotal(cart)).toBeLessThanOrEqual(0);
    });
});