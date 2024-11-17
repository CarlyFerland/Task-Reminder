// Import the functions you need from the SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore , enableIndexedDbPersistence} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";


// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyAkqUMoDzySLV_UuyFho2NjbGuY6RjPzKM",
  authDomain: "todo-list-c72bf.firebaseapp.com",
  projectId: "todo-list-c72bf",
  storageBucket: "todo-list-c72bf.firebasestorage.app",
  messagingSenderId: "89742573420",
  appId: "1:89742573420:web:3a060418212babcf13bd49"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and export it for use in your app
 const db = getFirestore(app);

 // Enable Firestore offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
      console.log('Offline persistence failed - possibly multiple tabs open.');
  } else if (err.code === 'unimplemented') {
      console.log('Offline persistence is not available in this browser.');
  }
});

export { db };
