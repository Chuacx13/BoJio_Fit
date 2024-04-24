<template>
    <div class = "profile-view">
        <div class = "parent-container">
            <div class = "user-info">
                <img class="profile-picture" :src="userInfo.profilePicture || defaultProfilePic" alt="Profile Picture">
                <div class="user-item">
                    <strong>{{ userInfo.username }}</strong>
                </div>
                <div class="user-item">
                    <strong>Age: {{ userInfo.age }}</strong>
                </div>
                <div class="user-item">
                    <strong>Gender: {{ userInfo.gender }}</strong>
                </div>
                <div class="user-item">
                    <strong>Height: {{ userInfo.height }}</strong> 
                </div>
                <div class="user-item">
                    <strong>Weight: {{ userInfo.weight }}</strong> 
                </div>
                <div class="user-item">
                    <strong>Tele: {{ userInfo.telegram }}</strong> 
                </div>
            </div>

            <div class = "badges-info">
                <div class="number-of-workouts">
                    <h3 class = "badge-title"> NUMBER OF WORKOUTS </h3>
                    <div class = "badge-container">
                        <img src="@/assets/badge_icon1.png" alt="Badge Icon" class = "workout-badge">
                        <div class = "badge-text"> {{ flooredWorkouts }} WORKOUTS </div>
                        <strong class = "badge-attained"> {{ flooredWorkouts > 0 ? flooredWorkouts + ' WORKOUT BADGE ATTAINED!' : 'NO WORKOUT BADGE ATTAINED YET' }} </strong>
                    </div>
                    <strong class = "quantity-indicator"> Current Number of Workouts : {{ workoutInfo.length }}</strong>
                </div>

                <div class="number-of-workout-hours">
                    <h3 class = "badge-title"> NUMBER OF WORKOUT HOURS</h3>
                    <div class = "badge-container">
                        <img src="@/assets/badge_icon1.png" alt="Badge Icon" class = "workout-badge">
                        <div class = "badge-text"> {{ flooredWorkoutHours }} TOTAL HOURS </div>
                        <strong class = "badge-attained"> {{ flooredWorkoutHours > 0 ? flooredWorkoutHours + ' WORKOUT HOURS BADGE ATTAINED!' : 'NO WORKOUT HOURS BADGE ATTAINED YET' }} </strong>
                    </div>
                    <strong class = "quantity-indicator"> Current Number of Workout Hours : {{ calculateTotalHours().toFixed(2) }} </strong>
                </div>

                <div class="number-of-badges">
                    <h3 class = "badge-title"> NUMBER OF BADGES </h3>
                    <div class = "badge-container">
                        <img src="@/assets/badge_icon1.png" alt="Badge Icon" class = "workout-badge">
                        <div class = "badge-text"> {{ numberOfBadges }} TOTAL BADGES </div>
                        <strong class = "badge-attained"> {{ numberOfBadges > 1 ? numberOfBadges + ' BADGES ATTAINED!' : numberOfBadges == 1 ? '1 BADGE ATTAINED!' : 'NO BADGES ATTAINED YET' }} </strong>
                    </div>
                    <strong class = "quantity-indicator"> Current Number of Badges : {{ numberOfBadges }} </strong>
                </div>
            </div>
        </div>    
    </div>
</template>
  
<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

export default {
    name: 'FriendProfile',
    props: ['friendId'],

    data() {
        return {
            user: false,
            userInfo: [],
            workoutInfo: [],
            displayNumber: 0,
            defaultProfilePic: null,
        }
    },

    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                this.user = user;
                await this.fetchUserInfo();
                await this.fetchWorkoutInfo();
            }
        })
    },

    computed: {
        flooredWorkouts() {
            return Math.floor(this.workoutInfo.length / 25) * 25;
        },
        flooredWorkoutHours() {
            let total = 0;
            this.workoutInfo.forEach(workout => {
                total += workout.duration / 60;
            });
            total = total.toFixed(2);
            return Math.floor(total / 25) * 25
        },
        numberOfBadges() {
            let numberOfWorkoutBadges = this.flooredWorkouts / 25;
            let numberOfWorkoutHourBadges = this.flooredWorkoutHours / 25;
            return numberOfWorkoutBadges + numberOfWorkoutHourBadges;
        }
    },

    methods: {
        async fetchUserInfo() {
            const db = getFirestore()
            const userInfoRef = doc(db, "Users", this.friendId);
            const docSnap = await getDoc(userInfoRef);
            if (docSnap.exists()) {
                this.userInfo = docSnap.data();
            } else {
                console.error("User information not found");
            }
        },
        async fetchWorkoutInfo() {
             const db = getFirestore()
             const workoutInfoRef = doc(db, "Workouts", this.friendId);
             const docSnap = await getDoc(workoutInfoRef);
             if (docSnap.exists()) {
                this.workoutInfo = docSnap.data().workoutList;
             } else {
                console.error("Workout information not found")
             }
        },
        calculateTotalHours() {
            let total = 0;
            this.workoutInfo.forEach(workout => {
                total += workout.duration / 60;
            });
            return total;
        },
        async loadDefaultProfilePic() {
            try {
                const { default: defaultProfilePic } = await import('@/assets/default_profile_pic.jpeg');
                this.defaultProfilePic = defaultProfilePic;
            } catch(error) {
                console.error("Error loading default profile picture", error);
            }
        }
    }
  };
</script>
  
<style scoped>
.user-info {
    display:flex;
    flex-direction: wrap;
    justify-content: space-between;
    margin-top: 5vh;
    height: 1vh;
    align-items: center;
}

.user-item {
    display: flex;
    margin-right: 5vw;
    color: whitesmoke;
    align-items: center;
}

.user-item strong {
    min-width: 5vw;
    font-size: 1vw;
}

.user-item span {
    flex: 1; 
    text-align: right; 
}

.profile-view {
  display: flex;
  justify-content: center;
  width: 100%;
  min-height: 100vh; 
  text-align: center;
  background-color: rgb(46, 46, 46); 
}

.edit-profile-button {
    background-color: orange;
    border-radius: 1vw;
    border: none;
    padding: 0.5vw 1vw;
    cursor: pointer;
    margin-left: auto;
}

.profile-picture {
    width: 6vw; 
    height: 8vh; 
    border-radius: 50%;
    margin-right: 5vw;
}

.badges-info {
    width: 80vw;
    height: auto; 
    padding: 2vw;
    margin-top: 5vh;
    display: flex;
    justify-content: center;
    flex-direction: row;
}

.parent-container {
    display: flex;
    flex-direction: column; 
    align-items: center; 
    width: 100vw;
}

.number-of-workouts,
.number-of-workout-hours,
.number-of-badges {
    width: 30%; 
    height: 100%; 
    background-color: white;
    border-radius: 1vw;
    margin: 0 1vw; /* Adjust the margin as needed */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.badge-title {
    max-height: 5%;
    height: 5%;
    color: orange;
    font-size: 1vw;
}

.badge-container {
    height: 80%;
    background-color: white;
    position: relative;
    width: 100%;
    height: auto;
}

.workout-badge {
    width: 100%;
    height: auto;
}

.quantity-indicator {
    height: 10%;
    font-size: 1vw;
    color: orange;
    margin-top: 0vh;
    margin-bottom: 1vh;
    width: 100%;
    height: auto;
}

.badge-text {
    position: absolute;
    bottom: 52.5%; 
    left: 50%; 
    transform: translateX(-50%);
    color: white; 
    font-size: 2vw;
}

.badge-attained {
    font-size: 0.8vw;
    color: orange;
}

.view-analytics {
    margin-top: 2vh;
}

.view-analytics-button, .edit-profile-button {
    font-size: 1vw;
    background-color: orange;
    border-radius: 1vw;
    border: none;
    padding: 1vh 2vw;
    cursor: pointer;
    margin-left: auto;
    min-height: 20%;
    color: white; 
}

.view-analytics-button { 
    position: relative; 
    display: flex;
}
.profile-picture {
    width: 4vw;
    height: 4vw;  
    border-radius: 50%;
    margin-right: 5vw;
}
</style>