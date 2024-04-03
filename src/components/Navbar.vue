<template>
    <nav class="navbar" :class="{'navbar-transparent': isTransparent}" v-if = "user">
        <img class="navbar-logo" :src="logo" alt="BoJio Fit Logo"> 
        <router-link class="nav-route" to="/" exact>HOME</router-link>
        <router-link class="nav-route" to="/tracking" exact>TRACKING</router-link>
        <router-link class="nav-route" to="/history" exact>HISTORY</router-link>
        <router-link class="nav-route" to="/searchUsers" exact>SEARCH USERS</router-link>
        <router-link class="nav-route" to="/friendRequests" exact>FRIEND REQUESTS</router-link>
        <router-link class="nav-route" to="/feed" exact>FEED</router-link>
        <router-link class="nav-route" to="/friends" exact>FRIENDS</router-link>
        <router-link class="nav-route" to="/analytics" exact>ANALYTICS</router-link>
        <router-link class="nav-route profile-link" to="/profile" exact>PROFILE</router-link>
        <button id = "btn" @click="signOut()"> LOGOUT </button>
    </nav>
    <nav class="navbar" :class="{'navbar-transparent': isTransparent}" v-else>
        <router-link class="nav-route" to="/" exact>Home</router-link>
        <router-link class="nav-route" to="/login">Login</router-link>
        <router-link class="nav-route" to="/signup">Sign Up</router-link>
    </nav>
</template>

<script>
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import logo from '@/assets/logo.png';
export default {
    name: 'Navbar',

    data() {
        return {
            user: false,
            logo: logo, 
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
            signOut(auth, this.user);
            this.user = false;
            this.$router.push('/login');
        }
    }, 

    computed: {
        isTransparent() {
            const routes = ['/', '/login', '/signup'];
            return routes.includes(this.$route.path);
        }
    }
}
</script>

<style scoped>
.navbar {
    display: flex;
    justify-content: center; 
    align-items: center;
    width: 100%;
    height: 100px;
    position: fixed; 
    z-index: 1000; 
    background-color: rgb(46, 46, 46);
    right: 17px;
    box-sizing: border-box;
}

.navbar-transparent{
    background-color: transparent;
}

.nav-route.router-link-active {
    color: orange; 
}

.navbar-logo {
    height: 150px; 
    width: auto; 
    margin-top: 20px; 
}

.nav-route, #btn {
    color: white;
    padding: 10px 40px 10px 40px; 
    text-decoration: none;
    transition: background-color 0.3s, color 0.3s;
    font-size: 15px; 
    font-weight: bold; 
    white-space: nowrap;
}

.nav-route:hover, #btn:hover {
    background-color: rgba(255, 255, 255, 0.2); 
    color: white; 
}

#btn {
    background-color: transparent;
    border: none;
    cursor: pointer;
    text-decoration: none;
}

#btn:hover {
    color: white;
    background-color: rgb(195, 195, 188);
}

.profile-link {
    border: 1px solid white;
}
</style>