<template> 
    <div class="edit-workout-view">
        <form @submit.prevent="saveWorkout">
            <h1 class="edit-workout-header"> Edit your Workout </h1>
            <input type="text" id="workout-name-input" v-model="workoutName" placeholder="Name your Workout!" required>
            <input type="date" id="date-input" v-model="date" placeholder="Date" required>
            <input type="number" id="duration-input" v-model="duration" placeholder="Duration(in minutes)" required>
            <div id="exercise-list" v-for="(exercise, index) in exercises" :key="index">
                <TrackingBox :key="index" :exercise="exercise"/>
            </div>
            <div id="edit-workout-buttons">
                <button type="button" id="add-button" @click="addExercise"> Add Exercise </button>
                <button type="button" id="delete-button" @click="deleteExercise"> Delete Exercise </button>
            </div>
            <button type="submit" id="save-workout-button"> Save Workout </button>
        </form>
    </div>
</template>

<script>
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import TrackingBox from '@/components/TrackingBox.vue';

export default {
    name: "EditWorkout", 

    components: {
        TrackingBox
    },

    data() {
        return {
            user: null,
            exercises: [],
            duration: null,
            workoutName: '',
            date: null,
            currentWorkout: null, 
            workoutIndex: null,
            oldDuration: null
        }
    }, 

    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                this.user = user;
                this.workoutIndex = this.$route.params.workoutIndex;
                await this.fetchWorkout(this.workoutIndex);
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

        // How document for workouts look:
        // workoutList: [{
        //     timestamp: new Date(),
        //     exercises: [{
        //         name: '',
        //         sets: [{ weight: null, reps: null }]
        //     }],
        //     duration: this.duration
        // }]
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

                    const workouts = docWorkoutSnap.data().workoutList.sort((a, b) => new Date(b.date) - new Date(a.date));
                    // Update the workout at the specified index
                    workouts[this.workoutIndex] = {
                        date: this.date,
                        workoutName: this.workoutName,
                        exercises: this.exercises,
                        duration: this.duration
                    };

                    await updateDoc(workoutDocRef, { workoutList: workouts });

                    const currNumofWorkouts = docBadgesSnap.data().totalNumofWorkouts;
                    const currWorkoutMinutes = docBadgesSnap.data().totalWorkoutMinutes;
                    await updateDoc(badgesDocRef, { 
                        totalNumofWorkouts: currNumofWorkouts, 
                        totalWorkoutMinutes: currWorkoutMinutes - this.oldDuration + this.duration
                    })
                } 
                //Go back to History page after successful edit of workout
                this.$router.push({ name: 'History' });
            } catch (error) {
                console.error(error);
            }
        },

        async fetchWorkout(workoutIndex) {
            const db = getFirestore();
            const docRef = doc(db, 'Workouts', this.user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                this.currentWorkout = docSnap.data().workoutList.sort((a, b) => new Date(b.date) - new Date(a.date))[workoutIndex];
                this.exercises = this.currentWorkout.exercises;
                this.duration= this.currentWorkout.duration;
                this.workoutName = this.currentWorkout.workoutName;
                this.date = this.currentWorkout.date;
                this.oldDuration = this.currentWorkout.duration;
            }
        }
    }
}
</script>

<style scoped>
.edit-workout-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    background-color: rgb(46, 46, 46);
    min-height: 100vh;
}

.edit-workout-header {
    color: orange;
    margin-bottom: 20px;
}

#edit-workout-buttons {
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

