<template>
    <Navbar/>
    <div class = "profile-view">
        <h3>This is the Profile Page</h3>
    </div>
</template>
  
<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Navbar from '@/components/Navbar.vue'

export default {
    name: "Profile",

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