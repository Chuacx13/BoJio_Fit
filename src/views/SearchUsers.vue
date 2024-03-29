<template>
    <div class = "searchUsers-view">
        <h3>This is the Search Users Page</h3>
    </div>
</template>
  
<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
    name: "SearchUsers",

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