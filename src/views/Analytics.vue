<template>
  <div class="analytics-view">
    <select v-model="selectedExercise" @change="updateGraph" :disabled="!hasWorkouts">
      <option disabled value="">Please select an exercise</option>
      <option v-for="(exercises, name) in workoutProgressData" :key="name" :value="name">{{ name }}</option>
    </select>
    <canvas v-if="hasWorkouts" id="myChart"></canvas>
    <p v-else class="no-data">No workouts to analyse!</p>
  </div>
</template>

  
<script>
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default {
  name: "Analytics",

  data() {
    return {
      user: false,
      selectedExercise: '',
      workoutProgressData: {},
      hasWorkouts: true, 
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
      const workoutDocRef = doc(db, 'Workouts', this.user.uid);
      const docSnap = await getDoc(workoutDocRef);

      if (docSnap.exists()) {
        const workoutData = docSnap.data().workoutList;
        this.processWorkoutData(workoutData);
      } else {
        console.log("No workouts found!");
        this.hasWorkouts = false; 
      }
    },

    processWorkoutData(workoutData) {
      let processedData = {};

      if (workoutData && workoutData.length > 0) {
        workoutData.forEach(workout => {
          workout.exercises.forEach(exercise => {
            if (!processedData[exercise.name]) {
              processedData[exercise.name] = [];
            }
            let averageWeight = exercise.sets.reduce((total, next) => total + next.weight, 0) / exercise.sets.length;
            processedData[exercise.name].push({ date: workout.date, weight: averageWeight }); 
          });
        });

        this.workoutProgressData = processedData;
        this.hasWorkouts = true; 
      } else {
        this.hasWorkouts = false; 
      }
    },

    updateGraph() {
      if (this.selectedExercise && this.workoutProgressData[this.selectedExercise]) {
        const ctx = document.getElementById('myChart').getContext('2d');
        if (this.chartInstance) {
          this.chartInstance.destroy();
        }

        const selectedData = [...this.workoutProgressData[this.selectedExercise]].sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA - dateB; 
        });

        const labels = selectedData.map(data => data.date); 
        const weights = selectedData.map(data => data.weight);

        this.chartInstance = new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [{
              label: 'Weight Progress for ' + this.selectedExercise,
              data: weights,
              fill: false,
              borderColor: 'rgb(255, 165, 0)',
              tension: 0.1
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      }
    }
  }
}
</script>

  
  <style scoped>
  .analytics-view {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      background-color: rgb(46, 46, 46);
      min-height: 100vh;
      justify-content: flex-start; 
      padding-top: 5vh;
  }
  
  #myChart {
    max-width: 800px; 
    max-height: 500px; 
    width: 100%; 
    height: auto; 
  }
  
  select {
      margin: 20px 0;
      padding: 8px 16px; 
      border-radius: 8px;
      background: white; 
      border: 1px solid #ffffff; 
      outline: none; 
      cursor: pointer; 
  }
  
  .no-data {
    color: orange;
    font-size: 1vw; 
}
  </style>
  
  