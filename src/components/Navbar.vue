<template>
    <nav class="navbar" v-if = "user">
        <router-link class="nav-route" to="/" exact>Home</router-link>
        <router-link class="nav-route" to="/tracking" exact>Tracking</router-link>
        <router-link class="nav-route" to="/history" exact>History</router-link>
        <router-link class="nav-route" to="/searchUsers" exact>Search Users</router-link>
        <router-link class="nav-route" to="/friendRequests" exact>Friend Requests</router-link>
        <router-link class="nav-route" to="/feed" exact>Feed</router-link>
        <router-link class="nav-route" to="/friends" exact>Friends</router-link>
        <router-link class="nav-route" to="/profile" exact>Profile</router-link>
        <button id = "btn" @click="signOut()"> Logout </button>
    </nav>
    <nav class="navbar" v-else>
        <router-link class="nav-route" to="/" exact>Home</router-link>
        <router-link class="nav-route" to="/login">Login</router-link>
        <router-link class="nav-route" to="/signup">Sign Up</router-link>
    </nav>
</template>

<script>
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
export default {
    name: 'Navbar',

    data() {
        return {
            user: false,
        }
    }, 

    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.user = user;
            }
        })
    },

    methods: {
        signOut() {
            const auth = getAuth();
            const user = auth.currentUser;
            signOut(auth, user)
            this.$router.push('/');
            window.location.reload();
        }
    }
}
</script>

<style>
.navbar {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 4rem;
    background-color: white;
    color: black;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    font-family: monospace;
}

.nav-route {
    display: block;
    color: black;
    text-align: center;
    padding: 14px 20px;
    text-decoration: none;
    transition: padding 0.3s, background-color 0.3s;
    border-radius: 8px;
}

.nav-route:hover {
    color: white;
    background-color: rgb(195, 195, 188);
}

#btn {
    padding: 14px 20px;
    font-size: 12px;
    background-color: transparent;
    color: black;
    border: none;
    cursor: pointer;
    text-decoration: none;
    transition: padding 0.3s, background-color 0.3s;
    border-radius: 8px;
    font-family: monospace;
}

#btn:hover {
    color: white;
    background-color: rgb(195, 195, 188);
}
</style>