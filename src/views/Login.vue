<template>
    <div class="login-view">
        <div class="form-container">
            <form @submit.prevent="login">
                <h1 class="login-header"> Login </h1>
                <input type="email" v-model="email" placeholder="Email" required>
                <input type="password" v-model="password" placeholder="Password" required>
            <button type="submit" class="login-button">Login</button>
            </form>
        </div>
    </div>
</template>
  
<script>
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/firebase';

export default {
    name: 'Login',
    methods: {
        async login() {
            try {
                await signInWithEmailAndPassword(auth, this.email, this.password);
                alert('Successfully logged in');
                this.$router.push('/');
            } catch (err) {
                if (err.code === 'auth/invalid-credential') {
                    alert('Invalid Credentials');
                } else {
                    console.error(err);
                }
            }
        }
    }
};
</script>
  
<style scoped>
.login-view {
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

.login-header {
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
    max-width: 300px; 
    height: 100%;
    max-height: 280px;
}
  
input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid black; 
    border-radius: 4px;
    box-sizing: border-box;
    margin-bottom: 1rem;
}
  
.login-button {
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

.login-button:hover {
    background-color: rgb(216, 124, 3); 
}
</style>
  