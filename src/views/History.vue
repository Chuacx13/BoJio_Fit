<template>
  <div class="container">
    <div class="left-container">
      <div class="left-text">
        <h3><span class="orange-text">WORKOUT</span><br/><span class="white-text">HISTORY</span></h3>
      </div>
      <div class="encouragement-text">
        <p>Review your workout history to<br>find out how much you have<br>improved over time!</p>
      </div>
    </div>

    <div class="right-container">
      <label for="workoutName">Workout Name:</label>
      <input type ="text" v-model="searchQuery" placeholder = "Search by workout name">
      <label for="startDate">Start Date:</label>
      <input type="date" v-model="startDate" placeholder="Start Date">
      <label for="endDate">End Date:</label>
      <input type="date" v-model="endDate" placeholder="End Date">
      <div v-if="filteredWorkouts.length > 0">
        <div class="workout-entry" v-for="(workout, index) in filteredWorkouts" :key="index">
          <h2>{{ workout.date }}: {{ workout.workoutName }}</h2>
          <p>Duration: {{ workout.duration }} minutes</p>
          <ul>
            <li v-for="(exercise, eIndex) in workout.exercises" :key="eIndex">
              {{ exercise.name }}:
              <ul>
                <li v-for="(set, sIndex) in exercise.sets" :key="sIndex">
                  Set {{ sIndex + 1 }}: {{ set.weight }} Kg x {{ set.reps }} reps
                </li>
              </ul>
            </li>
          </ul>
          <button @click="deleteWorkout(index)" class="delete-workout-button">Delete Workout</button>
          <button @click="editWorkout(index)" class="edit-workout-button">Edit Workout</button>
        </div>
      </div>
      <p v-else class="no-workouts">No workouts found for the selected workout name.</p>
    </div>
  </div>
</template>

<script>
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
  name: "History",

  data() {
    return {
      user: null,
      workouts: [],
      searchQuery: '', 
      startDate: null, 
      endDate: null, 
      currDuration: null,
    }
  },

  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.user = user;
        await this.fetchWorkouts();
      }
    });
  },

  methods: {
    async fetchWorkouts() {
      const db = getFirestore();
      const docRef = doc(db, 'Workouts', this.user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        this.workouts = docSnap.data().workoutList.sort((a, b) => new Date(b.date) - new Date(a.date));
      }
    },

    async deleteWorkout(index) {
      try {
        this.currDuration = this.workouts[index].duration;
        this.workouts.splice(index, 1);

        const db = getFirestore();
        const workoutDocRef = doc(db, 'Workouts', this.user.uid);
        await updateDoc(workoutDocRef, { workoutList: this.workouts });

        const badgesDocRef = doc(db, 'Badges', this.user.uid);
        const docBadgesSnap = await getDoc(badgesDocRef);
        const currNumofWorkouts = docBadgesSnap.data().totalNumofWorkouts;
        const currWorkoutMinutes = docBadgesSnap.data().totalWorkoutMinutes;
        await updateDoc(badgesDocRef, { 
          totalNumofWorkouts: currNumofWorkouts - 1,
          totalWorkoutMinutes: currWorkoutMinutes - this.currDuration
        })
      } catch (error) {
        console.error(error);
      }
    }, 

    editWorkout(workoutIndex) {
      this.$router.push({ name:'EditWorkout', params: {workoutIndex} });
    }
  }, 

  computed: {
    filteredWorkouts() {
      const query = this.searchQuery.toLowerCase();
      const startDate = this.startDate ? new Date(this.startDate) : null;
      const endDate = this.endDate ? new Date(this.endDate) : null;

      return this.workouts.filter(workout => {
        const workoutDate = new Date(workout.date);
        const isInDateRange = (!startDate || workoutDate >= startDate) && (!endDate || workoutDate <= endDate);
        const matchesSearchQuery = workout.workoutName.toLowerCase().includes(query);

        return isInDateRange && matchesSearchQuery;
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
    font-weight: normal; 
    white-space: nowrap; 
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

.right-container label {
  margin-left: 1vw;
  font-size: 1vw; 
}

.right-container input[type="text"], 
.right-container input[type="date"]{
  width: 13vw; 
  height: 0.8vh;
  margin: 1vw;
  padding: 0.8vw; 
  font-size: 0.8vw; 
  border-radius: 0.5vw;
}
.workout-entry {
    background-color: #3A3A3A;
    border-radius: 2vw;
    font-size: 1vw;
    padding: 1vw;
    margin: 1vw;
}
    
button {
    font-size: 1vw;
    border-radius: 1vw;
    border: none;
    padding: 0.7vw;
    margin-top: 1vh;
    margin-right: 1vw;
    cursor: pointer;
    color: white;
}

.delete-workout-button {
  background-color: red;
}

.edit-workout-button {
  background-color: orange;
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
    
    