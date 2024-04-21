<template>
    <div class="searchUsers-view">
      <div class="left-container">
        <div class="left-text">
          <h3><span class="orange-text">Workout</span><br/><span class="white-text">Buddy</span></h3>
        </div>
        <div class="encouragement-text">
          <p>Find a friend to workout with!<br>Keep each other accountable<br>and hit your fitness goals together!</p>
        </div>
      </div>
      <div class="searchUsers-content">
        <h1 class="searchUsers-header">Search Users</h1>
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

.left-container {
    width: 30%; 
    position: fixed;
    background-color: #2E2E2E;
    height: 100%;
    overflow-y: auto;
}

.left-text h3 {
    position: absolute;
    left: 10%;
    top: 30%;  
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
    left: 10%;
    top: 35%;
    transform: translateY(100%);
    text-align: left; 
    color: white;
    font-size: 1.1vw; 
    font-weight: normal; 
    margin: 1; 
    white-space: nowrap; 
 }
.searchUsers-view {
    display: flex;
    background-color: rgb(46, 46, 46);
    height: 100%;
}

.searchUsers-header {
    position: absolute; 
    display: flex;
    color: orange;
    font-size: 1.5vw; 
    top: 6vw;
    left: 40vw;
}
</style>