<template>
    <div class="feed-view">
      <h1 class="feed-header">Workout Feed</h1>
      <div v-for="workout in workouts" :key="workout.id" class="workout-entry">
        <h3>{{ workout.username }}'s Workout on {{ workout.date }}</h3>
        <p><strong>Duration:</strong> {{ workout.duration }} minutes</p>
        <p><strong>Exercises:</strong></p>
        <ul>
          <li v-for="exercise in workout.exercises" :key="exercise.name">{{ exercise.name }}</li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
    name: "Feed",

    data() {
        return {
            user: null,
            workouts: []
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
        async fetchWorkouts() {
            const db = getFirestore();
            this.fetchUserWorkouts(db);

            const friendsListDoc = doc(db, 'Users', this.user.uid);
            const friendsListSnapshot = await getDoc(friendsListDoc);
            if (friendsListSnapshot.exists()) {
                const friends = friendsListSnapshot.data().friends;
                for (const friend of friends) {
                    this.fetchFriendWorkouts(db, friend.userID, friend.username);
                }
            }
        },

        async fetchUserWorkouts(db) {
            const userWorkoutsDoc = doc(db, 'Workouts', this.user.uid);
            const workoutSnapshot = await getDoc(userWorkoutsDoc);
            if (workoutSnapshot.exists()) {
                const workoutData = workoutSnapshot.data().workoutList;
                workoutData.forEach(workout => {
                    this.workouts.push({ ...workout, username: 'You' });
                });
            }
        },

        async fetchFriendWorkouts(db, friendId, friendUsername) {
            const friendWorkoutsDoc = doc(db, 'Workouts', friendId);
            const workoutSnapshot = await getDoc(friendWorkoutsDoc);
            if (workoutSnapshot.exists()) {
                const workoutData = workoutSnapshot.data().workoutList;
                workoutData.forEach(workout => {
                    this.workouts.push({ ...workout, username: friendUsername });
                });
            }
        }
    }
}
</script>

<style scoped>
.feed-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #2E2E2E;
    color: white;
    min-height: 100vh;
}

.feed-header {
    color: orange;
    margin: 20px;
}

.workout-entry {
    background-color: #3E3E3E;
    padding: 20px;
    border-radius: 10px;
    margin: 10px;
    width: 80%;
}

.workout-entry h3 {
    color: #FFA500; 
}

.workout-entry p, li {
    color: #FFFFFF;
    }
</style>
