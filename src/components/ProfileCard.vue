<template>
    <div class="profile-card">
        <div class="user-info">
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
                <strong>Height: {{ userInfo.height }} cm</strong> 
            </div>
            <div class="user-item">
                <strong>Weight: {{ userInfo.weight }} kg</strong> 
            </div>
            <div class="user-item">
                <strong>Tele: @{{ userInfo.telegram }}</strong> 
            </div>
            <button v-if="isUser" class="edit-profile-button" @click="redirectToEditProfile">Edit Profile</button>
        </div>

        <div class="badges-info">
            <div class="number-of-workouts">
                <h3 class="badge-title"> NUMBER OF WORKOUTS </h3>
                <div class="badge-container">
                    <img src="@/assets/badge_icon1.png" alt="Badge Icon" class="workout-badge">
                    <div class="badge-text"> {{ flooredWorkouts > 0 ? flooredWorkouts + ' WORKOUTS' : 'NO BADGES YET' }} </div>
                    <strong class="badge-attained"> {{ flooredWorkouts > 0 ? flooredWorkouts + ' WORKOUT BADGE ATTAINED!' : 'NO WORKOUT BADGE ATTAINED YET!' }} </strong>
                </div>
                <strong class="quantity-indicator"> Current Number of Workouts : {{ badgeInfo.totalNumofWorkouts > 0 ? badgeInfo.totalNumofWorkouts : 0 }}</strong>
            </div>

            <div class="number-of-workout-hours">
                <h3 class="badge-title"> NUMBER OF WORKOUT HOURS</h3>
                <div class="badge-container">
                    <img src="@/assets/badge_icon1.png" alt="Badge Icon" class="workout-badge">
                    <div class="badge-text"> {{ flooredWorkoutHours > 0 ? flooredWorkoutHours + ' TOTAL HOURS' : 'NO BADGES YET' }} </div>
                    <strong class="badge-attained"> {{ flooredWorkoutHours > 0 ? flooredWorkoutHours + ' WORKOUT HOURS BADGE ATTAINED!' : 'NO WORKOUT HOURS BADGE ATTAINED YET!' }} </strong>
                </div>
                <strong class="quantity-indicator"> Current Number of Workout Hours : {{ calculateTotalHours }} </strong>
            </div>

            <div class="number-of-badges">
                <h3 class="badge-title"> NUMBER OF BADGES </h3>
                <div class="badge-container">
                    <img src="@/assets/badge_icon1.png" alt="Badge Icon" class="workout-badge">
                    <div class="badge-text"> {{ numberOfBadges > 0 ? numberOfBadges + ' TOTAL BADGES' : 'NO BADGES YET' }} </div>
                    <strong class="badge-attained"> {{ numberOfBadges > 1 ? numberOfBadges + ' BADGES ATTAINED!' : numberOfBadges == 1 ? '1 BADGE ATTAINED!' : 'NO BADGES ATTAINED YET!' }} </strong>
                </div>
                <strong class="quantity-indicator"> Current Number of Badges : {{ numberOfBadges > 0 ? numberOfBadges : 0 }} </strong>
            </div>
        </div>
    </div>     
</template>
  
<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

export default {
    name: "ProfileCard",

    props: {
        uid: {
            type: String,
            required: true, 
        },
    }, 

    data() {
        return {
            user: null,
            userInfo: [],
            badgeInfo: [],
            displayNumber: 0,
            defaultProfilePic: null
        }
    }, 

    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                 this.user = user
                 await this.fetchUserInfo();
                 await this.fetchBadgeInfo();
                 this.loadDefaultProfilePic();
            }
        })
    },

    computed: {
        flooredWorkouts() {
            return Math.floor(this.badgeInfo.totalNumofWorkouts / 25) * 25;
        },

        flooredWorkoutHours() {
            let numHours = this.badgeInfo.totalWorkoutMinutes / 60;
            return Math.floor(numHours / 25) * 25
        },

        numberOfBadges() {
            let numberOfWorkoutBadges = this.flooredWorkouts / 25;
            let numberOfWorkoutHourBadges = this.flooredWorkoutHours / 25;
            return numberOfWorkoutBadges + numberOfWorkoutHourBadges;
        },

        calculateTotalHours() {
            if (this.badgeInfo.totalWorkoutMinutes) {
                return (this.badgeInfo.totalWorkoutMinutes/60).toFixed(2);
            } else {
                return 0;
            }
        }, 

        isUser() { 
            if (this.user) {
                console.log(this.uid)
                console.log(this.user.uid)
                return this.user.uid === this.uid;
            } else {
                return false;
            }
        }
    },

    methods: {
        async fetchUserInfo() {
            const db = getFirestore()
            const userInfoRef = doc(db, "Users", this.uid);
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

        async fetchBadgeInfo() {
             const db = getFirestore()
             const badgeInfoRef = doc(db, "Badges", this.uid);
             const docSnap = await getDoc(badgeInfoRef);
             if (docSnap.exists()) {
                this.badgeInfo = docSnap.data();
             } else {
                console.error("Workout information not found")
             }
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
    min-width: 5vw;
    font-size: 1vw;
}

.user-item span {
    flex: 1; 
    text-align: right; 
}

.edit-profile-button {
    background-color: orange;
    border-radius: 1vw;
    border: none;
    padding: 0.5vw 1vw;
    cursor: pointer;
    margin-left: auto;
}

.edit-profile-button {
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
    margin: 0 1vw; 
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

.edit-profile-button {
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

.profile-picture {
    width: 4vw;
    height: 4vw;  
    border-radius: 50%;
    margin-right: 5vw;
}
</style>