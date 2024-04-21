<template>
    <div class = "friendRequests-view">
        <div class="left-container">
            <div class="left-text">
                <h3><span class="white-text">ADD NEW</span><br/><span class="orange-text">FRIENDS</span></h3>
            </div>
            <div class="encouragement-text">
                <p>Your friend found you.<br>Accept their friend request now to<br>start tracking each other's progress!</p>
            </div>
        </div>
        <div class="right-container">
            <h1 class="friends-request-header"> Friend Requests </h1>
            <ul v-if="friendRequests.length > 0" class="friends-request-display">
                <li v-for="request in friendRequests">
                    <span>User <strong>{{ request.username }}</strong> wants to be your friend.</span>
                    <button @click="acceptRequest(request)" class="request-button-accept">Accept</button>
                    <button @click="declineRequest(request)" class="request-button-decline">Decline</button>
                </li>
            </ul>
            <p v-else class="friends-request-display">No friend requests currently...</p>
        </div>
    </div>
</template>
  
<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export default {
    name: "FriendRequests",

    data() {
        return {
            user: false,
            friendRequests: [],
        }
    }, 

    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.user = user;
                this.fetchFriendRequests();
            }
        })
    },

    methods: {
        async fetchFriendRequests() {
            const db = getFirestore();
            const userDocRef = doc(db, 'Users', this.user.uid);
            const userDocSnapshot = await getDoc(userDocRef);
            try {
                if (userDocSnapshot.exists()) {
                    const userData = userDocSnapshot.data();
                    this.friendRequests = userData.friendRequests;
                } else {
                    console.log('error loading friend requests');
                }
            } catch(error) {
                console.log(error);
            }
        },

        async acceptRequest(request) {
            const db = getFirestore();
            const userDocRef = doc(db, 'Users', this.user.uid);
            const userDocSnapshot = await getDoc(userDocRef);
            console.log(request.userID);
            console.log(request.username);
            try {
                const userData = userDocSnapshot.data();
                await updateDoc(userDocRef, {
                    friendRequests: this.friendRequests.filter(req => req.userID !== request.userID)
                });
                const updatedFriends = [
                    ...(userData.friends || []), // Ensure existing friends are preserved
                    {
                        userID: request.userID,
                        username: request.username
                    }
                ];
                await setDoc(userDocRef, { friends: updatedFriends }, { merge: true });
                alert('friend request accepted');
                window.location.reload();
            } catch (error) {
                console.error('Error accepting request:', error);
            }
        },

        async declineRequest(request) {
            const db = getFirestore();
            const userDocRef = doc(db, 'Users', this.user.uid);
            try {
                await updateDoc(userDocRef, {
                    friendRequests: this.friendRequests.filter(req => req.userID !== request.userID)
                });
                alert('friend request declined');
                window.location.reload();
            } catch (error) {
                console.error('Error declining request:', error);
            }
        }
    }
}
</script>

<style scoped>
.friendRequests-view {
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
    font-size: 4vmax;
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
    position: absolute;
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

.friends-request-display {
    position: absolute;
    top: 20%;
    width: 50%;
    margin-top: 2.2vh;
    padding: 30px;
    background-color: rgba(255, 255, 255, 0.1); /* Semi-transparent background */
    border-radius: 10px;
    color: white;
    font-size: 20px;
}

.friends-request-display li {
    list-style: none;
    display: flex;
    position: relative; 
    padding: 2vh 2vw; 
    transition: background-color 0.3s; /* Add smooth transition */
}

.friends-request-display li:hover {
    background-color: #363333; /* Highlight on hover */
}

.friends-request-display li span {
    font-size: 3vmin;
    margin: 1.1vmin;
    width: 50%;
}

.friends-request-display li span strong {
    font-weight: bold;
    color: orange;
}

.request-button-accept {
    padding: 15px 30px;
    margin-left: 2.5vw;
    margin-right: 2.5vw;
    color: white;
    background-color: green;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease; /* Smooth background color transition */
}

.request-button-decline {
    padding: 15px 30px;
    margin-left: 2.5vw;
    margin-right: 2.5vw;
    color: white;
    background-color: red;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease; /* Smooth background color transition */
}

.request-button-accept:hover {
    background-color: rgb(3, 92, 3); /* Darker color on hover */
}

.request-button-decline:hover {
    background-color: rgb(191, 8, 8); /* Darker color on hover */
}
</style>