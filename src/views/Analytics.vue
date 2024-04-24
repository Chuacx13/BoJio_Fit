<template>
    <div class="analytics-view">
      <select v-model="selectedExercise" @change="updateGraph">
        <option disabled value="">Please select an exercise</option>
        <option v-for="(exercises, name) in workoutProgressData" :key="name" :value="name">{{ name }}</option>
      </select>
      <canvas id="myChart"></canvas>
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
        }
      },
  
      processWorkoutData(workoutData) {
        let processedData = {};
  
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
    justify-content: center;
    margin-bottom: 10vh; 
  }
  
  #myChart {
    max-width: 600px;
    max-height: 400px; 
  }
  
  select {
  margin: 20px 0;
  padding: 8px 16px; /* Add padding */
  border-radius: 8px; /* Rounded corners */
  background: white; /* Optional: changes background color */
  border: 1px solid #ccc; /* Optional: adds a light border */
  outline: none; /* Optional: removes focus outline */
  cursor: pointer; /* Optional: changes cursor on hover */
  }
</style>
  