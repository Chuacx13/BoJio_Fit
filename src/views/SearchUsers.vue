<template>
    <div class = "searchUsers-view">
        <h1 class="searchUsers-header"> Search Users </h1>
        <SearchUsersBar/>
    </div>
</template>
  
<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import SearchUsersBar from '@/components/SearchUsersBar.vue';

export default {
    name: "SearchUsers",

    components: {
        SearchUsersBar
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
.searchUsers-view {
    display: flex;
    background-color: rgb(46, 46, 46);
    min-height: 100vh;
}

.searchUsers-header {
    position: absolute; 
    top: 0%; 
    left:44%; 
    color: orange;
    align-items: center;
    margin-top: 120px;
    margin-bottom: 40px;
}
</style>