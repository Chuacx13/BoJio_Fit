<template>

    <div class = "friends-view">
        <h1 class="friends-header"> Friends </h1>
        <ul v-if="friends.length > 0" v-for="friend in friends" class="friends-display">
            {{ friend.username }} is your friend.
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
        },
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
    top: 0%; 
    left:44%; 
    color: orange;
    align-items: center;
    margin-top: 120px;
    margin-bottom: 40px;
}

.friends-display {
    position: absolute; 
    font-size: 20px;
    top: 15%; 
    right: 25%; 
    display: flex;
    align-items: center;
    width: 50%;
    justify-content: center;
    margin: 40px;
    color: orange;
}
</style>
