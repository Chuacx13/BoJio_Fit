<template>
    <div class="tracking-view">
        <form @submit.prevent="saveWorkout">
            <h1 class="tracking-header"> Workout </h1>
            <input type="number" id="duration-input" v-model="duration" placeholder="Duration(in minutes)" required>
            <div id="exercise-list" v-for="(exercise, index) in exercises" :key="index">
                <TrackingBox :key="index" :exercise="exercise"/>
            </div>
            <div id="tracking-button">
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
            user: false,
            exercises: [],
            duration: '',
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

            try {
                // Get document from "Workouts" collection with unique "uid" document 
                const docSnap = await getDoc(workoutDocRef);

                // If document exist, get workoutList and update it with new workout
                if (docSnap.exists()) {
                    const currentData = docSnap.data();
                    const updatedWorkoutList = [...currentData.workoutList, {
                        timestamp: new Date(),
                        exercises: this.exercises,
                        duration: this.duration
                    }];

                    await setDoc(workoutDocRef, { workoutList: updatedWorkoutList });
                //If document do not exist, set workoutList with new workout
                } else {
                    await setDoc(workoutDocRef, {
                        workoutList: [{
                            timestamp: new Date(),
                            exercises: this.exercises,
                            duration: this.duration
                        }]
                    });
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
    margin-top: 150px;
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
    width: 100px;
}

#add-button {
    background-color: orange;
}

#delete-button {
    background-color: red;
}

#save-workout-button {
    background-color: rgb(53, 170, 53);
}

#duration-input {
    border-radius: 8px;
    min-width: 140px;
    margin: 10px;
    padding: 6px;
    margin-bottom: 20px;
    margin-top: 0px;
}
</style>
