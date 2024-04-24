<template>
    <div class="feed-view">
        <h1 class="feed-header">Workout Feed</h1>
        <div v-if="workouts.length === 0" class="no-data">
            No workouts to display
        </div>
        <div v-else v-for="workout in sortedWorkouts" :key="workout.id" class="workout-entry">
            <h3>{{ workout.username }}'s {{ workout.workoutName }} on {{ workout.date }}</h3>
            <p><strong>Duration:</strong> {{ workout.duration }} minutes</p>
            <p><strong>Exercises:</strong></p>
            <ul>
                <li v-for="exercise in workout.exercises" :key="exercise.name">
                    {{ exercise.name }}
                    <ul>
                        <li v-for="(set, index) in exercise.sets" :key="index">
                            Set {{ index + 1 }}: {{ set.weight }} lbs x {{ set.reps }} reps
                        </li>
                    </ul>
                </li>
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
    margin-bottom: 10vh;
}

.feed-header {
    color: orange;
    font-size: 3vw;
}

.workout-entry {
    background-color: #3E3E3E;
    padding: 1vw 2vh;
    border-radius: 1vw;
    margin: 0.5vh;
    width: 50%;
    font-size: 1vw; 
}

.workout-entry h3 {
    color: #FFA500; 
}

.workout-entry p, li {
    color: #FFFFFF;
    }
</style>
