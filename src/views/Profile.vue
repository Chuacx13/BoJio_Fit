<template>
    <div class = "profile-view">
        <div class = "user-info">
            <div class="user-item">
                <strong>{{ userInfo.username }}</strong>
            </div>
            <div class="user-item">
                <strong>Age: {{ userInfo.Age }}</strong>
            </div>
            <div class="user-item">
                <strong>Gender: {{ userInfo.Gender }}</strong>
            </div>
            <div class="user-item">
                <strong>Height: {{ userInfo.Height }}</strong> 
            </div>
            <div class="user-item">
                <strong>Weight: {{ userInfo.Weight }}</strong> 
            </div>
            <div class="user-item">
                <strong>Tele: {{ userInfo.Telegram }}</strong> 
            </div>
            <button class="edit-profile-button" @click="redirectToEditProfile">Edit Profile</button>
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
import { getFirestore, doc, getDoc } from "firebase/firestore";
// import firebase from 'firebase/app';
// import 'firebase/auth';
// import 'firebase/firestore';

export default {
    name: "Profile",

    data() {
        return {
            user: false,
            userInfo: []
        }
    }, 

    async mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                 this.user = user
                 await this.fetchUserInfo();
            }
        })
    },

    methods: {
        async fetchUserInfo() {
            const db = getFirestore()
            const UserInfoRef = doc(db, "Users", this.user.uid);
            const docSnap = await getDoc(UserInfoRef);
            if (docSnap.exists()) {
                this.userInfo = docSnap.data();
            } else {
                console.error("User information not found");
            }
        },
        redirectToEditProfile() {
            this.$router.push({name : 'EditProfile'})
        }
    }
}
</script>

<style scoped>
.user-info {
    display:flex;
    flex-direction: wrap;
    justify-content: space-between;
    margin-top: 120px;
    height: 5vh;
    align-items: center;
}

.user-item {
    display: flex;
    margin-right: 5vw;
    color: whitesmoke;
    align-items: center;
}

.user-item strong {
    min-width: 100px; /* Adjust the width as needed */
}

.user-item span {
    flex: 1; /* Expand to fill remaining space */
    text-align: right; /* Align text to the right */
}

.profile-view {
  display: flex;
  justify-content: center;
  width: 100%;
  min-height: 100vh; 
  text-align: center;
  background-color: rgb(46, 46, 46); 
}

.edit-profile-button {
    background-color: orange;
    border-radius: 10px;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    margin-left: auto;
}
</style>