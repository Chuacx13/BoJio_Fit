<template>
    <div class="history-view" v-if="user">
        <div class="left-text">
            <h3><span class="orange-text">WORKOUT</span><br/><span class="white-text">HISTORY</span></h3>
        </div>
        <div class="encouragement-text">
            <p>Review your workout history to<br/>find out how much you have<br/>improved over time!</p>
        </div>
        <div class ="search-bar"> 
            <input type = "date" v-model="selectedDate" @change="searchWorkouts" /> 
        </div>
        <div v-if="workoutsByDate.length > 0">
            <ul>
                <li v-for="(workout, index) in workoutsByDate" :key="index">
                    <button @click="showWorkoutDetails(workout.number)">{{ workout.date }}</button>
                </li>
            </ul>
        </div>
        <div v-else>
            <p class ="no-workouts">No workouts found for the selected date.</p>
        </div>
        <div class="workout-details" v-if="selectedWorkout">
            <h2>Workout {{ selectedWorkout.number }}</h2>
                <p>Date: {{ selectedWorkout.date }}</p>
                <p>Duration: {{ selectedWorkout.duration }} minutes</p>
                <div v-for="(exercise, exerciseIndex) in selectedWorkout.exercises" :key = "exerciseIndex"> 
                    <p>Exercise: {{ exercise.name }}</p>
                    <div v-for="(set, setIndex) in exercise.sets" :key = "setIndex"> 
                        <p>Set {{ setIndex + 1 }}: <br>Weight: {{ set.weight }}kg, Reps: {{ set.reps }}</p>
                    </div>
                </div>
                <button @click="closeWorkoutDetails">Close</button>
            </div>
        </div>
        <div class="history-view" v-else>
            <h3>Sign Up Now</h3>
        </div>
</template>

<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDoc, getFirestore, doc} from "firebase/firestore";

export default {
    name: "History",

    data() {
        return {
            user: false,
            selectedDate: null, 
            workoutsByDate: [],
            selectedWorkout: null,
        };
    }, 

    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.user = true; 
                this.fetchWorkoutHistory(user.uid);
            }
        })
    },

    methods: { 
        async searchWorkouts() { 
            if(!this.selectedDate === null) return; 
            const db = getFirestore(); 
            const workoutRef = doc(db, 'Workouts', this.user.uid); 

            try { 
                const doc = await getDoc(workoutRef); 
                if (doc.exists()) { 
                    const workouts = doc.data().workoutList;
                    this.workoutsByDate = workouts.filter(
                        (workout) =>
                        workout.timestamp.toDate().toLocaleDateString() ===
                        this.selectedDate
                    );
                }
            } catch (error) { 
                console.error(error); 
            }
         }, 
        showWorkoutDetails(workoutNumber) {
            this.selectedWorkout = this.workoutsByDate.find(
                (workout) => workout.number === workoutNumber
            );
        }, 

        closeWorkoutDetails() { 
            this.selectedWorkout = null;
        }, 
    }, 
}; 
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

.search-bar {
    position: absolute;  
    top: 120px; 
    width: 150px; 
}

.search-bar input[type="date"] {
    width: 100%; /* Take up full width of parent */
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.no-workouts {
    position: absolute; 
    color: white; 
    font-size: 1.5vw; 
    right: 30%; 
    width: 30vw; 
}

</style>

