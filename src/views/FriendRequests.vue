<template>
    <div class = "friendRequests-view">
        <h1 class="friends-request-header"> Friend Requests </h1>
        <h2 v-if="friendRequests.length > 0">Here are your current friend requests!</h2>
        <ul v-if="friendRequests.length > 0" v-for="request in friendRequests" class="friends-request-display">
            <span>User <strong>{{ request.username }}</strong> wants to be your friend.</span>
            <button @click="acceptRequest(request)" class="request-button-accept">Accept</button>
            <button @click="declineRequest(request)" class="request-button-decline">Decline</button>
        </ul>
        <p v-else class="friends-request-display">No friend requests currently...</p>
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
    flex-direction: column;
    align-items: center;
    text-align: center;
    background-color: rgb(46, 46, 46);
    min-height: 100vh;
}

.friends-request-header {
    position: absolute;
    top: 10%;
    color: orange;
    align-items: center;
    margin-top: 40px;
    margin-bottom: 20px;
    font-size: 30px;
}

.friendRequests-view h2 {
    position: absolute;
    top: 15%;
    color: white;
    margin-top: 30px;
    margin-bottom: 20px;
    font-size: 24px;
}

.friends-request-display {
    position: absolute;
    top: 20%;
    display: flex;
    width: 41%;
    align-items: center;
    margin-top: 20px;
    padding: 40px;
    background-color: rgba(255, 255, 255, 0.1); /* Semi-transparent background */
    border-radius: 10px;
    color: white;
    font-size: 25px;
}

.friends-request-display span {
    font-size: 25px;
    margin: 10px;
}

.friends-request-display span strong {
    font-weight: bold;
    color: orange;
}

.request-button-accept {
    padding: 15px 30px;
    margin-left: 26px;
    margin-right: 26px;
    color: white;
    background-color: green;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease; /* Smooth background color transition */
}

.request-button-decline {
    padding: 15px 30px;
    margin-left: 26px;
    margin-right: 26px;
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