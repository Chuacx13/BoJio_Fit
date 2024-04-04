<template>
    <div class = "friends-view">
        <h1 class="friends-header"> Friends </h1>
        <ul v-if="friends.length > 0" v-for="friend in friends" class="friends-display">
            <span><strong>{{ friend.username }}</strong> is your friend.</span>
            <button class="view-profile-button">View Profile</button>
        </ul>
        <p v-else class="friends-display">You have no friends currently...</p>
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
        }
    }
}
</script>

<style scoped>
.friends-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    background-color: rgb(46, 46, 46);
    min-height: 100vh;
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
    display: flex;
    width: 40%;
    align-items: center;
    margin-top: 20px;
    padding: 40px;
    background-color: rgba(255, 255, 255, 0.1); /* Semi-transparent background */
    border-radius: 10px;
    color: white;
    font-size: 25px;
}

.friends-display span {
    font-size: 25px;
    margin: 10px;
}

.friends-display span strong {
    font-weight: bold;
    color: orange;
}

.view-profile-button {
    padding: 15px 30px;
    margin-left: 26px;
    margin-right: 26px;
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
