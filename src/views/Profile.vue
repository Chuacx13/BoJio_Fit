<template>
    <div class="profile-view" v-if="isUser">
        <ProfileCard :uid="this.user.uid"/>
        <div class="view-analytics-section">
            <button class="view-analytics-button" @click="redirectToAnalytics">View Analytics</button>
        </div>  
    </div>    
</template>
  
<script>
import ProfileCard from "@/components/ProfileCard.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
    name: "Profile",

    components: {
        ProfileCard
    }, 

    data() {
        return {
            user: null
        }
    },  
    
    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                 this.user = user;
            }
        })
    },

    methods: {
        redirectToAnalytics() {
            this.$router.push({name : 'Analytics'})
        },
    }, 

    computed: {
        isUser() {
            return this.user;
        },
    }
}
</script>

<style scoped>
.profile-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100vh; 
  text-align: center;
  background-color: rgb(46, 46, 46); 
}

.view-analytics-section {
    margin-top: 2vh;
}

.view-analytics-button {
    font-size: 1vw;
    background-color: orange;
    border-radius: 1vw;
    border: none;
    padding: 1vh 2vw;
    cursor: pointer;
    margin-left: auto;
    min-height: 20%;
    color: white; 
}
</style>