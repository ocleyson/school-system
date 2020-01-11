import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

export function loadFirebase() {
    try {
        const config = {
            apiKey: "",
            authDomain: "",
            databaseURL: "",
            projectId: "",
            storageBucket: "",
            messagingSenderId: "",
            appId: ""
        };
        firebase.initializeApp(config);
    } catch (err) {
        // we skip the "already exists" message which is
        // not an actual error when we're hot-reloading
        if (!/already exists/.test(err.message)) {
          console.error('Firebase initialization error', err.stack);
        }
    }
    return firebase;
}