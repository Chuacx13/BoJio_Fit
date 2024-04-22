<template>
    <div class="overall-container">
        <div class="left-container">
            <div class="left-text">
            <h3><span class="orange-text">WORKOUT</span><br/><span class="white-text">BUDDY</span></h3>
            </div>
            <div class="encouragement-text">
            <p>Find a friend to workout with!<br>Keep each other accountable<br>& hit your fitness goals together!</p>
            </div>
        </div>
        <div class="searchUsers-content">
            <h2><span class="search-text">Search Users</span></h2>
            <SearchUsersBar/>
        </div>
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
  .overall-container {
    display: flex;
    min-height: 100vh; 
    background-color: #2E2E2E; 
  }

  .left-container {
    width: 40%; 
    position: absolute;
    display: flex; 
    background-color: #2E2E2E;
    height: 100%;
    overflow-y: auto;
}
.left-text h3 {
    position: absolute;
    left: 10%;
    top: 35%;  
    font-size: 4vw;
    margin: 0; 
    text-align: left;
    font-weight: bold;
    white-space: nowrap;
}
.orange-text {
    color: orange;
}

.white-text {
    color: white;
}

.encouragement-text { 
    position: absolute;
    display: flex; 
    left: 10%;
    top: 40%;
    transform: translateY(100%);
    text-align: left; 
    color: white;
    font-size: 1.1vw; 
    font-weight: normal; 
    white-space: nowrap; 
}

.search-text { 
    position: absolute; 
    display: flex; 
    color: orange; 
    margin-top: 2vh;
    margin-bottom: 1vh; 
    top: 20vh; 
    left: 40vw; 
}
</style>