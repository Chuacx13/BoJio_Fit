<template>
    <div class = "profile-view">
        <div class = "parent-container">
            <div class = "user-info">
                <img class="profile-picture" :src="userInfo.profilePicture || defaultProfilePic" alt="Profile Picture">
                <div class="user-item">
                    <strong>{{ userInfo.username }}</strong>
                </div>
                <div class="user-item">
                    <strong>Age: {{ userInfo.Age }}</strong>
                </div>
                <div class="user-item">
                    <strong>Gender: {{ userInfo.Gender }}</strong>
                </div>
                <div class="user-item">
                    <strong>Height: {{ userInfo.Height }}</strong> 
                </div>
                <div class="user-item">
                    <strong>Weight: {{ userInfo.Weight }}</strong> 
                </div>
                <div class="user-item">
                    <strong>Tele: {{ userInfo.Telegram }}</strong> 
                </div>
                <button class="edit-profile-button" @click="redirectToEditProfile">Edit Profile</button>
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

            <div class = "view-analytics">
                <button class ="view-analytics-button" @click="redirectToAnalytics"> View Analytics</button>
            </div>
        </div>    
    </div>    
</template>
  
<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

export default {
    name: "Profile",

    data() {
        return {
            user: false,
            userInfo: [],
            workoutInfo: [],
            displayNumber: 0,
            defaultProfilePic: null
        }
    }, 

    async mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                 this.user = user
                 await this.fetchUserInfo();
                 await this.fetchWorkoutInfo();
                 this.loadDefaultProfilePic();
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
            const userInfoRef = doc(db, "Users", this.user.uid);
            const docSnap = await getDoc(userInfoRef);
            if (docSnap.exists()) {
                this.userInfo = docSnap.data();
            } else {
                console.error("User information not found");
            }
        },
        redirectToEditProfile() {
            this.$router.push({name : 'EditProfile'})
        },
        redirectToAnalytics() {
            this.$router.push({name : 'Analytics'})
        },
        async fetchWorkoutInfo() {
             const db = getFirestore()
             const workoutInfoRef = doc(db, "Workouts", this.user.uid);
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
}
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
    min-width: 100px; 
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
    border-radius: 10px;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    margin-left: auto;
}

.profile-picture {
    width: 80px; 
    height: auto; 
    margin-right: 5vw;
}

.badges-info {
    background-color: rgb(46, 46, 46);
    width: 80vw;
    height: 60vh;
    padding: 20px;
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

.number-of-workouts {
    width: 30%; 
    height: 100%; 
    background-color: white;
    border-radius: 10px;
    margin: 0 30px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    
}

.number-of-workout-hours {
    width: 30%;
    height: 100%; 
    background-color: white;
    border-radius: 10px;
    margin: 0 30px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.number-of-badges {
    width: 30%; 
    height: 100%; 
    background-color: white;
    border-radius: 10px;
    margin: 0 30px; 
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.badge-title {
    max-height: 5%;
    height: 5%;
    color: orange;
}

.badge-container {
    height: 80%;
    background-color: white;
    position: relative;
}

.workout-badge {
    width: 100%;
    height: 80%;
}

.quantity-indicator {
    margin-top: auto;
    height: 10%;
    font-size: 1vw;
    color: orange;
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
    font-size: 1vw;
    color: orange;
}

.view-analytics {
    margin-top: 2vh;
}

.view-analytics-button {
    background-color: orange;
    border-radius: 10px;
    border: none;
    padding: 1vh 5vw;
    cursor: pointer;
    margin-left: auto;
}

</style>