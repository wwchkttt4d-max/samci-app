import { db } from './firebase-config.js';
import { collection, getDocs, addDoc, query, where } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// Exemple : Récupérer tous les stocks
export async function getStocks() {
    const querySnapshot = await getDocs(collection(db, "stocks"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Exemple : Ajouter une vente
export async function saveVente(venteData) {
    return await addDoc(collection(db, "ventes"), venteData);
}