<template>
    <div class = "friendRequests-view">
        <h1 class="friends-request-header"> Friend Requests </h1>
        <ul v-if="friendRequests.length > 0" v-for="request in friendRequests" class="friends-request-display">
            <span>{{ request.username }} wants to be your friend.</span>
            <button @click="acceptRequest(request)" class="request-button">Accept</button>
            <button @click="declineRequest(request)" class="request-button">Decline</button>
        </ul>
        <p v-else class="friends-request-display">No friend requests</p>
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
    top: 0%; 
    left:44%; 
    color: orange;
    align-items: center;
    margin-top: 120px;
    margin-bottom: 40px;
}

.friends-request-display {
    font-size: 20px;
    position: absolute; 
    top: 15%; 
    right: 25%; 
    display: flex;
    align-items: center;
    width: 50%;
    justify-content: center;
    margin: 40px;
    color: orange;
}

.request-button {
    margin: 20px;
}
</style>