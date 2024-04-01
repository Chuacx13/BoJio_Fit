<template> 
    <Navbar v-if="!isLoading"/>
    <Loading v-if="isLoading"/>
    <router-view/>
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
    },
}
</script>

<style>
#app {
    padding: 0px;
    margin: 0px;
}

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
}
</style>
