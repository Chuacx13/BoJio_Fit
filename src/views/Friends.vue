<template>
    <div class = "friends-view">
        <div class="left-container">
            <div class="left-text">
                <h3><span class="white-text">FIND YOUR</span><br/><span class="orange-text">FRIEND</span></h3>
            </div>
            <div class="encouragement-text">
                <p>Curious about how<br>your friend is doing?<br>Click their profile to find out more!</p>
            </div>
        </div>
        <div class="right-container">
            <h1 class="friends-header"> Friends </h1>
            <ul v-if="friends.length > 0" class="friends-display">
                <li v-for="friend in friends">
                    <span><strong>{{ friend.username }}</strong> is your friend.</span>
                <button @click="redirectToFriendProfile(friend.userID)" class="view-profile-button">View Profile</button>
                </li>
            </ul>
            <p v-else class="friends-display">You have no friends currently...</p>
        </div>
    </div>
</template>

<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from 'firebase/firestore';

export default {
    name: "Friends",

    data() {
        return {
            user: false,
            friends: [],
        }
    }, 

    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                this.user = user;
                this.fetchFriends();
            }
        })
    },

    methods: {
        async fetchFriends() {
            const db = getFirestore();
            const userDocRef = doc(db, 'Users', this.user.uid);
            const userDocSnapshot = await getDoc(userDocRef);
            try {
                if (userDocSnapshot.exists()) {
                    const userData = userDocSnapshot.data();
                    this.friends = userData.friends;
                    console.log(this.friends);
                } else {
                    console.log('error loading friends');
                }
            } catch(error) {
                console.log(error);
            }
        },
        redirectToFriendProfile(friendId) {
            this.$router.push({ name: 'FriendProfile', params: { friendId } });
        }
    }
}
</script>

<style scoped>
.friends-view {
    display: flex;
    background-color: rgb(46, 46, 46);
    min-height: 100vw;
}

.left-container {
    width: 60%; 
    position: fixed;
    background-color: #2E2E2E;
    height: 80vh;
    overflow-y: auto;
}

.left-text h3 {
    position: absolute;
    left: 10%;
    top: 40%;  
    font-size: 4vw;
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
    left: 10%;
    top: 45%;
    transform: translateY(100%);
    text-align: left; 
    color: white;
    font-size: 1.2vmax; 
    font-weight: normal; 
    margin: 1; 
    white-space: nowrap; 
 }

.friends-request-header {
    position: relative;
    top: 10%;
    color: orange;
    align-items: center;
    margin-top: 4.4vh;
    margin-bottom: 2.2vh;
    font-size: 2vw;
}

.right-container {
    width: 50%; 
    margin-left: 40%; 
    margin-top: 2.2vh;
    overflow-y: auto;
    background-color: #2E2E2E;
    color: white;
    display: flex;
}

.friends-header {
    position: absolute;
    top: 10%;
    color: orange;
    align-items: center;
    margin-top: 40px;
    margin-bottom: 20px;
    font-size: 30px;
}

.friends-display {
    position: absolute;
    top: 20%;
    width: 40%;
    align-items: center;
    margin-top: 20px;
    padding: 30px;
    background-color: rgba(255, 255, 255, 0.1); /* Semi-transparent background */
    border-radius: 10px;
    color: white;
    font-size: 25px;
}

.friends-display li {
    list-style: none;
    display: flex;
    position: relative; 
    padding: 2vh 2vw; 
    transition: background-color 0.3s; /* Add smooth transition */
}

.friends-display li:hover {
    background-color: #363333; /* Highlight on hover */
}

.friends-display li span {
    font-size: 4vmin;
    margin: 1.1vmin;
    width: 50%;
}

.friends-display li span strong {
    font-weight: bold;
    color: orange;
}

.view-profile-button {
    padding: 15px 30px;
    min-width: 130px;
    margin-left: 2.5vw;
    margin-right: 2.5vw;
    color: white;
    background-color: blue;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease; /* Smooth background color transition */
}

.view-profile-button:hover {
    background-color: rgb(42, 42, 197); /* Darker color on hover */
}
</style>
