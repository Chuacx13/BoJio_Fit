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
        <div v-if="workouts && workouts.length > 0">
          <div class="workout-entry" v-for="(workout, index) in workouts" :key="index">
            <h2>{{ workout.date }} - {{ workout.workoutName }}</h2>
            <p>Duration: {{ workout.duration }} minutes</p>
            <ul>
              <li v-for="(exercise, eIndex) in workout.exercises" :key="eIndex">
                {{ exercise.name }} - Sets:
                <ul>
                  <li v-for="(set, sIndex) in exercise.sets" :key="sIndex">
                    Set {{ sIndex + 1 }}: {{ set.weight }} Kg x {{ set.reps }} reps
                  </li>
                </ul>
              </li>
            </ul>
            <button @click="deleteWorkout(index)">Delete Workout</button>
          </div>
        </div>
        <p v-else class="no-workouts">No workouts found for the selected date.</p>
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
        workouts: []
      }
    },
  
    async mounted() {
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
        this.workouts.splice(index, 1);
  
        const db = getFirestore();
        const workoutDocRef = doc(db, 'Workouts', this.user.uid);
  
        await updateDoc(workoutDocRef, { workoutList: this.workouts });
      }
    }
  }
  </script>
  
 <style scoped>
 body {
  margin: 0;
  background-color: #2E2E2E; 
}
 .container {
   display: flex;
   min-height: 100vh;
 }
 
 .left-container {
   width: 30%; 
   position: fixed;
   background-color: #2E2E2E;
   height: 100vh;
   overflow-y: auto;
 }

 .left-text h3 {
    position: absolute;
    left: 5%;
    top: 40%;  
    font-size: 5vw;
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
    left: 5%;
    top: 45%;
    transform: translateY(100%);
    text-align: left; 
    color: white;
    font-size: 1.5vw; 
    font-weight: normal; 
    margin: 1; 
    white-space: nowrap; 
}
 
 .right-container {
   width: 70%; 
   margin-left: 30%; 
   margin-top: 100px;
   overflow-y: auto;
   background-color: #2E2E2E;
   color: white;
 }
 
 .history-header {
   color: orange;
   margin-top: 30px;
 }
 
 .workout-entry {
   background-color: #3A3A3A;
   border-radius: 10px;
   padding: 20px;
   margin: 10px;
 }
 
 button {
   border-radius: 10px;
   border: none;
   padding: 10px;
   margin-top: 10px;
   cursor: pointer;
   background-color: red;
   color: white;
 }

 .no-workouts {
    position: absolute; 
    color: white; 
    font-size: 1.5vw; 
    right: 30%; 
    width: 30vw; 
}
 </style>
 
  