<template>
    <div class="feed-view">
        <h1 class="feed-header">Workout Feed</h1>
        <div v-if="workouts.length === 0" class="no-data">
            No workouts to display
        </div>
        <div v-else v-for="workout in sortedWorkouts" :key="workout.id" class="workout-entry">
            <div class="workout-details">
                <h3>{{ workout.username }}'s {{ workout.workoutName }} on {{ workout.date }}</h3>
                <p><strong>Duration:</strong> {{ workout.duration }} minutes</p>
                <p><strong>Exercises:</strong></p>
                <ul>
                    <li v-for="exercise in workout.exercises" :key="exercise.name">
                        {{ exercise.name }}
                        <ul>
                            <li v-for="(set, index) in exercise.sets" :key="index">
                                Set {{ index + 1 }}: {{ set.weight }} Kg x {{ set.reps }} Reps
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
            <img :src="workout.profilePic || defaultProfilePic" class="profile-pic" alt="Profile Picture">
        </div>
    </div>
</template>


<script>
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
    name: "Feed",
    data() {
        return {
            user: null,
            workouts: [],
            defaultProfilePic: '@/assets/default_profile_pic.jpeg' // Ensure this path is correct
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
            await this.fetchUserWorkouts(db, this.user.uid, 'You');
            const friendsListDoc = doc(db, 'Users', this.user.uid);
            const friendsListSnapshot = await getDoc(friendsListDoc);
            if (friendsListSnapshot.exists()) {
                const friends = friendsListSnapshot.data().friends;
                for (const friend of friends) {
                    await this.fetchUserWorkouts(db, friend.userID, friend.username);
                }
            }
        },
        async fetchUserWorkouts(db, userId) {
            const userDoc = doc(db, 'Users', userId);
            const userSnapshot = await getDoc(userDoc);
            const userProfile = userSnapshot.data();
            const username = userProfile ? userProfile.username : 'Unknown User'; 
            const profilePic = userProfile && userProfile.profilePicture ? userProfile.profilePicture : this.defaultProfilePic;

            const workoutsDoc = doc(db, 'Workouts', userId);
            const workoutSnapshot = await getDoc(workoutsDoc);
            if (workoutSnapshot.exists()) {
                const workoutData = workoutSnapshot.data().workoutList;
                workoutData.forEach(workout => {
                    this.workouts.push({ ...workout, username, profilePic });
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
    display: flex;
    justify-content: space-between; 
    align-items: center; 
    background-color: #3E3E3E;
    padding: 1vw;
    border-radius: 1vw;
    margin: 0.5vh;
    width: 70%;
}

.profile-pic {
    width: 80px; 
    height: 80px; 
    border-radius: 50%;
    margin-right: 20px; 
    order: 2; 
}

.workout-details {
    flex: 1;
    font-size: 1vw;
    order: 1; 
}

.workout-entry h3 {
    color: #FFA500;
}

.workout-entry p, li {
    color: #FFFFFF;
}
</style>

