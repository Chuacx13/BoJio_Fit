import firebase from 'firebase/compat/app';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_VUE_API_KEY,
    authDomain: import.meta.env.VITE_VUE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_VUE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_VUE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_VUE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_VUE_ID
};  

firebase.initializeApp(firebaseConfig);
export default firebase;