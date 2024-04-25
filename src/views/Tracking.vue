<template>
    <div class="tracking-view">
        <form @submit.prevent="saveWorkout">
            <h1 class="tracking-header"> Workout </h1>
            <input type="text" id="workout-name-input" v-model="workoutName" placeholder="Name your Workout!" required>
            <input type="date" id="date-input" v-model="date" placeholder="Date" required>
            <input type="number" id="duration-input" v-model="duration" placeholder="Duration(in minutes)" required>
            <div id="exercise-list" v-for="(exercise, index) in exercises" :key="index">
                <TrackingBox :key="index" :exercise="exercise"/>
            </div>
            <div id="tracking-buttons">
                <button type="button" id="add-button" @click="addExercise"> Add Exercise </button>
                <button type="button" id="delete-button" @click="deleteExercise"> Delete Exercise </button>
            </div>
            <button type="submit" id="save-workout-button"> Save Workout </button>
        </form>
    </div>
</template>
  
<script>
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import TrackingBox from '@/components/TrackingBox.vue';

export default {
    name: "Tracking",
    components: {
        TrackingBox
    },

    data() {
        return {
            user: null,
            exercises: [],
            duration: null,
            workoutName: '',
            date: null
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

    methods: {
        addExercise() {
            const newExercise = {
                name: '',
                sets: [{ weight: null, reps: null }]
            };
            this.exercises.push(newExercise);
        },

        deleteExercise() {
            this.exercises.pop();
        },
        
        async saveWorkout() {
            // Get database
            const db = getFirestore();
            // Get document reference from "Workouts" collection with unique "uid" document 
            const workoutDocRef = doc(db, 'Workouts', this.user.uid);
            // Get document reference from "Badges" collection with unique "uid" document 
            const badgesDocRef = doc(db, 'Badges', this.user.uid);
            try {
                // Get document from "Workouts" collection with unique "uid" document 
                const docWorkoutSnap = await getDoc(workoutDocRef);
                // Get document from "Badges" collection with unique "uid" document 
                const docBadgesSnap = await getDoc(badgesDocRef);

                // If document exist, get workoutList and update it with new workout
                if (docWorkoutSnap.exists()) {
                    const currentWorkoutData = docWorkoutSnap.data();
                    const updatedWorkoutList = [...currentWorkoutData.workoutList, {
                        date: this.date,
                        workoutName: this.workoutName,
                        exercises: this.exercises,
                        duration: this.duration
                    }];


                    const currNumofWorkouts = docBadgesSnap.data().totalNumofWorkouts;
                    const currWorkoutMinutes = docBadgesSnap.data().totalWorkoutMinutes;
                    await setDoc(workoutDocRef, { workoutList: updatedWorkoutList });
                    await setDoc(badgesDocRef, { 
                        totalNumofWorkouts: currNumofWorkouts + 1, 
                        totalWorkoutMinutes: currWorkoutMinutes + this.duration
                    })
                //If document do not exist, set workoutList with new workout
                } else {
                    await setDoc(workoutDocRef, {
                        workoutList: [{
                            date: this.date,
                            workoutName: this.workoutName,
                            exercises: this.exercises,
                            duration: this.duration
                        }]
                    });

                    await setDoc(badgesDocRef, { 
                        totalNumofWorkouts: 1, 
                        totalWorkoutMinutes: this.duration
                    })
                }
                //Reload page after successful saving of workout
                window.location.reload();
            } catch (error) {
                console.error(error);
            }
        }
    }
}
</script>

<style scoped>
.tracking-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    background-color: rgb(46, 46, 46);
    min-height: 100vh;
}

.tracking-header {
    color: orange;
    margin-bottom: 20px;
}

#tracking-buttons {
    display: flex;
    align-items: center;
    justify-content: center;
}

#add-button, #delete-button, #save-workout-button {
    border-radius: 10px;
    border: none;
    padding: 6px;
    color: white;
    margin: 10px;
    cursor: pointer;
    min-width: 100px;
    min-height: 30px;
}

#add-button {
    background-color: orange;
}

#delete-button {
    background-color: red;
}

#save-workout-button {
    background-color: rgb(53, 170, 53);
    margin-bottom: 30px;
}

#duration-input, #workout-name-input, #date-input {
    border-radius: 8px;
    min-width: 140px;
    margin: 10px;
    padding: 6px;
    margin-bottom: 20px;
    margin-top: 0px;
}
</style>
