import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyB5ZyguGk-wm3U5nCjKMTTbGP28GV0cjiU",   // Auth / General Use
    applicationId: "1:27992087142:web:ce....",      // General Use
    projectId: "instabay-f9ecd",               // General Use
    authDomain: "instabay-f9ecd.firebaseapp.com",         // Auth with popup/redirect
    databaseURL: "https://instabay-f9ecd.firebaseio.com", // Realtime Database
    storageBucket: "instabay-f9ecd.appspot.com",    // Storage
    messagingSenderId: "333411834414",                  // Cloud Messaging
    appId: "1:333411834414:web:16757be46677292f225dbf",
    measurementId: "G-ELZ2DF5X0X"
});

const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const storage = firebaseApp.storage();

export { db, auth, storage };