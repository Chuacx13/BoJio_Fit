<template> 
    <div id="app">
        <Navbar v-if="!isLoading"/>
        <Loading v-if="isLoading"/>
        <div class="content-wrapper" v-if="!isLoading">
            <router-view/>
        </div>
    </div>
</template> 

<script> 
import Navbar from './components/Navbar.vue';
import Loading from './components/Loading.vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default {
    name: 'App',
    components: {
        Navbar,
        Loading
    },
    data() {
        return {
            isLoading: true,
            user: false
        }
    },
    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            this.isLoading = true;
            if (user) {
                this.user = user;
            }
            this.isLoading = false;
        })
    }
}
</script>

<style>
#app {
    padding: 0px;
    margin: 0px;
    height: 100vh;
}

html, body {
  margin: 0;
  padding: 0;
  overflow: hidden; 
}

.content-wrapper {
  height: 90vh; 
  overflow-y: auto; 
}
</style>
