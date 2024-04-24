<template>
    <div class = "friends-view">
        <div class="left-container">
            <div class="left-text">
                <h3><span class="orange-text">FIND YOUR</span><br/><span class="white-text">FRIEND</span></h3>
            </div>
            <div class="encouragement-text">
                <p>Curious about how your friend is doing?<br>Click their profile to find out more!</p>
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
import { getFirestore, doc, getDoc, getDocs, collection, query, where } from 'firebase/firestore';

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
                    const friendUserIds = userData.friends.map(friend => friend.userID);
                    const usersCollectionRef = collection(db, 'Users');
                    const userQuerySnapshot = await getDocs(query(usersCollectionRef, where('uid', 'in', friendUserIds)));
                    this.friends = userQuerySnapshot.docs.map(doc => {
                        return {
                            userID: doc.data().uid,
                            username: doc.data().username
                        };
                    });

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
    min-height: 100vh;
    background-color: rgb(46, 46, 46);
}

.left-container {
    width: 40%; 
    position: absolute;
    display: flex; 
    flex-direction: column; 
    background-color: #2E2E2E;
    height: 100%;
    overflow-y: auto;
}

.left-text h3 {
    position: absolute;
    left: 10%;
    top: 35%;  
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
    margin-top: 3vh;
    position: absolute;
    left: 10%;
    top: 40%;
    transform: translateY(100%);
    text-align: left; 
    color: white;
    font-size: 1.1vw; 
    font-weight: normal; 
    white-space: nowrap; 
 }
    
 .right-container {
    position: relative;
    width: 50%; 
    left: 40%; 
    overflow-y: auto;
    background-color: #2E2E2E;
    color: white;
}


.friends-header {
    color: orange;
    font-size: 2vw; 
}


.friends-display {
    position: relative;
    width: 50%; 
    background-color: #3A3A3A;
    border-radius: 0.5vw;
    color: white;
    font-size: 1vw;
    margin: 0; 
    padding: 0 0.5vw;
}

.friends-display li {
    justify-content: space-between;
    list-style: none;
    display: flex;
    position: relative; 
    padding: 1vh 0.2vw;
    transition: background-color 0.3s; /* Add smooth transition */
}

.friends-display li:hover {
    background-color: #363333; /* Highlight on hover */
}

.friends-display li span {
    font-size: 1vw;
    width: 50%;
}

.friends-display li span strong {
    font-weight: bold;
    color: orange;
}

.view-profile-button {
    font-size: 0.5vw;
    padding: 0.5vw;
    color: white;
    background-color: orange;
    border: none;
    border-radius: 0.5vw;
    cursor: pointer;
    transition: background-color 0.3s ease; /* Smooth background color transition */
}

.view-profile-button:hover {
    background-color: green; /* Darker color on hover */
}
</style>
