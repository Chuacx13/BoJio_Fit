<template>
    <div class = "profile-view">
        <div class = "user-info">
            <div class="user-item">
                <strong>John Doe</strong> 
                <!-- {{ user.name }} -->
            </div>
            <div class="user-item">
                <strong>Age:</strong> 
                <!-- {{ user.age }} -->
            </div>
            <div class="user-item">
                <strong>Gender:</strong> 
                <!-- {{ user.gender }} -->
            </div>
            <div class="user-item">
                <strong>Height:</strong> 
                <!-- {{ user.height }} -->
            </div>
            <div class="user-item">
                <strong>Weight:</strong> 
                <!-- {{ user.weight }} -->
            </div>
            <div class="user-item">
                <strong>Tele:</strong> 
                <!-- {{ user.telegram }} -->
            </div>
            <router-link class="nav-route" to="/editProfile" exact>Edit Profile</router-link>
        </div>
    </div>    
    <div class="numberOfWorkouts">
        <!-- link to no. of workouts -->
    </div>
    <div class="numberOfWorkoutHours">
        <!-- link to no. of workout hours -->
    </div>
    <div class="numberOfBadges">
        <!-- link to no. of badges -->
    </div>
</template>
  
<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
// import firebase from 'firebase/app';
// import 'firebase/auth';
// import 'firebase/firestore';

export default {
    name: "Profile",

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
    }
    // created() {
    //     this.fetchUserDetails();
    // },
    // methods: {
    //     fetchUserDetails() {
    //         const user = firebase.auth().currentUser;
    //         if (user) {
    //             firebase.firestore().collection('users').doc(user.uid).get().then(doc => {
    //                 if (doc.exists) {
    //                     this.user = doc.data();
    //                 }
    //             }).catch(error => {
    //                 console.error('No user logged in.');
    //             })
    //         }
    //     }
    // }
}
</script>

<style scoped>
.user-info {
    display:flex;
    flex-direction: row;
    margin-left: 10vw;
    margin-top: 15vh;
}

.user-item {
    margin-right: 10vw;
    color: white;
}

.profile-view {
  display: flex;
  justify-content: center;
  width: 100%;
  min-height: 100vh; 
  background-image: url('@/assets/home_background.png');
  background-size: cover;
  background-position: center center; 
  background-repeat: no-repeat; 
  background-attachment: fixed;
  text-align: center; 
}

.nav-route {
    height: 5vh;
}
</style>