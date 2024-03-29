<template>
    <div class="history-view" v-if="user">
        <div class="left-text">
            <h3><span class="orange-text">WORKOUT</span><br/><span class="white-text">HISTORY</span></h3>
        </div>
        <div class="encouragement-text">
            <p>Review your workout history to<br/>find out how much you have<br/>improved over time!</p>
        </div>
        <div class="workout-history">
            <div v-for="(workout, index) in workoutHistory" :key="index" class="workout-item">
                <div class="workout-item-content">
                    <p>Workout{{ workout.number }}</p>
                    <p>Date: {{ workout.date }}</p>
                    <p>Exercise: {{ workout.exercise }}</p>
                    <p>Reps: {{ workout.reps }}</p>
                </div>
            </div>
        </div>
    </div>
    <div class="history-view" v-else>
        <h3>Sign Up Now</h3>
    </div>
</template>

<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
    name: "History",

    data() {
        return {
            user: false,
            workoutHistory: [
                { number: 1, date: '2024-01-01', exercise: 'bicep curls', reps: '12' },
                { number: 2, date: '2024-01-02', exercise: 'bench press', reps: '12' },
                { number: 3, date: '2024-01-03', exercise: 'hammer curls', reps: '12' },
            ]
        }
    }, 

    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.user = user;
            }
        })
    },
}
</script>

<style scoped>
.navbar {
    display: flex;
    justify-content: center; 
    align-items: center;
    height: 120px; 
    width: 100%;
    position: fixed;
    top: 100;
    left: 0;
    background: transparent; 
}

.history-view {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100vh; 
  background-image: url('@/assets/home_background.png');
  background-size: cover;
  background-position: center center; 
  background-repeat: no-repeat; 
  background-attachment: fixed;
  text-align: center; 
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

.workout-history {
    display: flex; 
    flex-direction: row; /* Display items in a row */
    justify-content: flex-end;
    position: absolute;
    right: 5%;
    width: 100%; 
    text-align: left;
}

.workout-item {
    margin-bottom: 20px; /* Add margin between items */
    margin-left: 20px;
}

.workout-item-content {
    border: 1px solid white; /* Add border */
    padding: 30px; /* Add padding */
    background-color: white;
}
</style>
