<template>
    <Navbar/>
    <div class="home-view" v-if="user">
        <div class="promotional-text">
            <p>UNLEASH YOUR MIND.</p>
            <p>UNLOCK YOUR POTENTIAL.</p>
        </div>
        <div class="tracking-text">
            <p>START TRACKING YOUR WORKOUTS TODAY!</p>
        </div>
    </div>
    <div class="home-view" v-else>
        <h3>Sign Up Now</h3>
    </div>
</template>

<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Navbar from '@/components/Navbar.vue'

export default {
    name: "Home",

    components: {
        Navbar
    }, 

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
}
</script>

<style scoped>
.navbar {
    display: flex;
    justify-content: center; 
    align-items: center;
    height: 120px; 
    width: 100%;
    position: fixed;
    top: 100;
    left: 0;
    background: transparent; 
}

.home-view {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100vh; 
  background-image: url('@/assets/home_background.png');
  background-size: cover;
  background-position: center center; 
  background-repeat: no-repeat; 
  background-attachment: fixed;
  text-align: center; 
}

.promotional-text p {
    -webkit-text-stroke: 2px orange; 
    color: transparent;
    font-size: 4em; 
    margin: 0; 
    text-align: center;
    font-weight: bold; 
    white-space: nowrap; 
}

.tracking-text p {
    color: white;
    font-size: 2.2em; 
    font-weight: bold; 
    margin: 1; 
    white-space: nowrap; 
}
</style>