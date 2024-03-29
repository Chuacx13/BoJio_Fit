<template>
    <Navbar/>
    <div class="feed-view">
      <div class="post" v-for="(post, index) in posts" :key="index">
        <h4>{{ post.username }}</h4>
        <p>Training log for the day:</p>
        <ul>
          <li v-for="(exercise, index) in post.exercises" :key="index">
            {{ exercise.name }}: {{ exercise.weight }}kg x {{ exercise.reps }} Reps
          </li>
        </ul>
        <div class="actions">
          <button @click="likePost(post)">❤️ {{ post.likes }} likes</button>
          <div @click="toggleComments(post)">View all {{ post.comments.length }} comments</div>
        </div>
        <!-- Add a comment section here -->
      </div>
    </div>
  </template>
  
  
<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Navbar from '@/components/Navbar.vue'

export default {
    name: "Feed",

    components: {
        Navbar
    }, 

    data() {
        return {
            user: false,
            posts: [
      ]
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
    likePost(post) {
      post.likes++;
    },
    toggleComments(post) {
    }
  }
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

.feed-view {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100vh; 
  background-size: cover;
  background-position: center center; 
  background-repeat: no-repeat; 
  background-attachment: fixed;
  text-align: center; 
  background: rgb(39, 34, 34); 
}
</style>