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
        </div>
    </div>
</template>

<script>
import { auth } from '@/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default {
    name: 'SignUp',
    methods: {
        async signup() {
            try {
                if (this.password == this.confirmPassword) {
                    await createUserWithEmailAndPassword(auth, this.email, this.password);
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
}
  
.form-container {
    display: flex;
    justify-content: center;
    align-items: center;
    background: white;
    padding: 2rem;
    border-radius: 8px;
    width: 100%;
    max-width: 340px; 
    height: 100%;
    max-height: 400px;
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
    cursor: pointer;
    transition: background-color 0.3s;
  }

.signup-button:hover {
    background-color: rgb(216, 124, 3); 
}
</style>
  