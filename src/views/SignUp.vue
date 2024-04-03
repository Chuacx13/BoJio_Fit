<template>
    <div class="signup-view">
        <div class="form-container">
            <form @submit.prevent="signup">
                <h1 class="signup-header"> Create New Account </h1>
                <input type="text" v-model="username" placeholder="Username" required>
                <input type="email" v-model="email" placeholder="Email" required>
                <input type="password" v-model="password" placeholder="Password" required>
                <input type="password" v-model="confirmPassword" placeholder="Confirm Password" required>
            <button type="submit" class="signup-button">Sign Up</button>
            </form>
            <p> ---- Or Connect using Google ---- </p>
            <div id="firebaseui-auth-container"></div>
        </div>
    </div>
</template>

<script>
import { auth } from '@/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import firebase from '@/uifire.js';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

export default {
    name: 'SignUp',

    data() {
        return {
            email: '',
            password: ''
        }
    },
    
    mounted() {
        var ui = firebaseui.auth.AuthUI.getInstance();
        if (!ui) {
            ui = new firebaseui.auth.AuthUI(firebase.auth());
        }

        var uiConfig = {
            signInSuccessUrl: '/',
            signInOptions: [
                {
                    provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                    fullLabel: 'Sign Up with Google',
                    buttonColor: 'black'
                }
            ]
        }

        ui.start('#firebaseui-auth-container', uiConfig);
    },

    methods: {
        async signup() {
            try {
                const db = getFirestore();
                if (this.password == this.confirmPassword) {
                    const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
                    const user = userCredential.user;
                    const userDocRef = doc(db, 'Users', user.uid);
                    await setDoc(userDocRef, { username: this.username, uid: user.uid, friendRequests: [], friends: [] });
                    alert('Successfully Signed Up');
                    this.$router.push('/');
                } else {
                    alert ('Different Password');
                }
            } catch (err) {
                if (err.code === 'auth/email-already-in-use') {
                    alert('Account already exist.');
                } else if (err.code === 'auth/weak-password') {
                    alert('Password should at least be 6 characters long');
                } else {
                    console.error(err);
                }
            }
        }
    }
};
</script>
  
<style scoped>
.signup-view {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100%;
    top: 0px;
    position: fixed;
    background-image: url('@/assets/auth_background.png');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
}

.signup-header {
    color: rgb(240, 152, 70);
    font-size: 2em;
    text-align: center;
    margin: 0px 0px 2rem 0px;
    font-weight: 900;
}
  
.form-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: white;
    padding: 2rem;
    border-radius: 8px;
    width: 100%;
    max-width: 340px; 
    height: 100%;
    max-height: 460px;
}
  
input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid black; 
    border-radius: 4px;
    box-sizing: border-box;
    margin-bottom: 1rem;
}
  
.signup-button {
    background-color: rgb(240, 152, 70); 
    color: white;
    width: 100%;
    padding: 0.75rem;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 900;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-bottom: 1rem;
}

.signup-button:hover {
    background-color: rgb(216, 124, 3); 
}

p {
    margin: 0px;
    font-weight: 900;
}
</style>
  