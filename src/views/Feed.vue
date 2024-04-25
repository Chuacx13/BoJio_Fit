<template>
    <div class="container">
      <div class="left-container">
        <div class="left-text">
          <h3><span class="orange-text">WORKOUT</span><br/><span class="white-text">FEED</span></h3>
        </div>
        <div class="encouragement-text">
          <p>View the latest workouts<br>of your friends</p>
        </div>
      </div>
  
      <div class="right-container">
        <div v-if="workouts.length === 0" class="no-workouts">
          No workouts to display
        </div>
        <div v-else class="workout-entry" v-for="workout in sortedWorkouts" :key="workout.id">
          <img :src="workout.profilePic || defaultProfilePic" class="profile-pic" alt="Profile Picture">
          <div class="workout-details">
            <h3>{{ workout.username }} {{ workout.workoutName }} on {{ workout.date }}</h3>
            <p><strong>Duration:</strong> {{ workout.duration }} minutes</p>
            <p><strong>Exercises:</strong></p>
            <ul>
              <li v-for="exercise in workout.exercises" :key="exercise.name">
                {{ exercise.name }}
                <ul>
                  <li v-for="(set, index) in exercise.sets" :key="index">
                    Set {{ index + 1 }}: {{ set.weight }} Kg x {{ set.reps }} reps
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </template>
  


<script>
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
    name: "Feed",
    data() {
        return {
            user: null,
            workouts: [],
            defaultProfilePic: '@/assets/default_profile_pic.jpeg' 
        }
    },
    computed: {
        sortedWorkouts() {
            return this.workouts.sort((a, b) => new Date(b.date) - new Date(a.date));
        }
    },
    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.user = user;
                this.fetchWorkouts();
            }
        });
    },
    methods: {
        async fetchUserWorkouts(db, userId) {
            const userDoc = doc(db, 'Users', userId);
            const userSnapshot = await getDoc(userDoc);
            if (userSnapshot.exists()) {
                const userData = userSnapshot.data();
                const profilePic = userData.profilePicture || this.defaultProfilePic;
                const username = (this.user && this.user.uid === userId) ? "Your" : userData.username;  
                const workoutsDoc = doc(db, 'Workouts', userId);
                const workoutSnapshot = await getDoc(workoutsDoc);
                if (workoutSnapshot.exists()) {
                    const workoutData = workoutSnapshot.data().workoutList;
                    workoutData.forEach(workout => {
                        this.workouts.push({ ...workout, username, profilePic });
                    });
                }
            }
        },

        async fetchWorkouts() {
            this.workouts = []; 
            const db = getFirestore();
            const auth = getAuth();
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    this.user = user;
                    await this.fetchUserWorkouts(db, user.uid); 
                    const friendsListDoc = doc(db, 'Users', user.uid);
                    const friendsListSnapshot = await getDoc(friendsListDoc);
                    if (friendsListSnapshot.exists()) {
                        const friends = friendsListSnapshot.data().friends;
                        for (const friend of friends) {
                            await this.fetchUserWorkouts(db, friend.userID); 
                        }
                    }
                }
            });
        }
    }
}
</script>

<style scoped>
.container {
    display: flex;
    min-height: 100vh;
    background-color: rgb(46, 46, 46);
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
    padding-top: 10px;
}
    
.right-container {
  margin-top: 1vh;
  margin-bottom: 10vh;
  width: 50%; 
  height: 80%; 
  left: 40%; 
  background-color: #2E2E2E;
  color: white;
  display: flex;
  position: relative; 
  flex-direction: column;
}

.workout-entry {
    display: flex;
    justify-content: space-between;
    align-items: center; 
    background-color: #3A3A3A;
    border-radius: 2vw;
    font-size: 1.2vw;
    padding: 1vw;
    margin: 1vw;
    width: 80%;
}

.profile-pic {
    width: 4vw;
    height: 4vw;
    border-radius: 50%;
    margin-left: 10px; 
    margin-bottom: 25%;
}

.workout-details {
    flex: 0.95; 
    text-align: left;
}

.no-workouts {
    position: absolute; 
    display: flex; 
    color: white; 
    font-size: 1vw; 
    margin-left: 1vw; 
    margin-top: 40%; 
}
</style>



