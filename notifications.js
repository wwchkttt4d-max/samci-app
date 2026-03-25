import { db } from "./js/firebase.js";
import {
  collection,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// --- INITIALISATION DES NOTIFICATIONS ---

const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    console.warn("Ce navigateur ne supporte pas les notifications");
    return;
  }

  if (Notification.permission === "default") {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("Permission de notification refusée");
    }
  }
};

// --- ENVOI DE NOTIFICATION ---
const sendNotification = (title, message) => {
  if (Notification.permission === "granted") {
    new Notification(title, {
      body: message,
      icon: "https://cdn-icons-png.flaticon.com/512/1827/1827347.png" // Optionnel : ajoutez un logo
    });
  }
}

// --- ÉCOUTE TEMPS RÉEL ---
const usersCollection = collection(db, "Users");

// Variable pour ignorer le premier snapshot (chargement initial)
let isInitialLoad = true;

onSnapshot(usersCollection, (snapshot) => {
  snapshot.docChanges().forEach((change) => {
    // On ne notifie que si le type est 'added' ET que ce n'est pas le chargement initial
    if (change.type === "added" && !isInitialLoad) {
      const newUser = change.doc.data();
      sendNotification(
        "SAMCI-AVICOLE", 
        `Nouvel utilisateur : ${newUser.name || newUser.email}`
      );
    }
  });
  
  // Après le premier chargement, on passe à false
  isInitialLoad = false;
});

// Initialiser les permissions au démarrage
requestNotificationPermission();