<template>
    <Navbar/>
    <div class = "friends-view">
        <h3>This is the Friends Page</h3>
    </div>
</template>
  
<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Navbar from '@/components/Navbar.vue'

export default {
    name: "Friends",

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

</style>