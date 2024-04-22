<template>
    <div class = "friendRequests-view">
        <div class="left-container">
            <div class="left-text">
                <h3><span class="orange-text">ADD NEW</span><br/><span class="white-text">FRIENDS</span></h3>
            </div>
            <div class="encouragement-text">
                <p>Your friend found you.<br>Accept their friend request now to<br>start tracking each other's progress!</p>
            </div>
        </div>
        <div class="right-container">
            <h2 class="friends-request-header"> Friend Requests </h2>
            <ul v-if="friendRequests.length > 0" class="friends-request-display">
                <li v-for="request in friendRequests" class="friend-request-item">
                    <div class="friend-request-text">
                        <span><strong>{{ request.username }}</strong> has requested to follow you.</span>
                    </div>
                    <div class="request-buttons-container">
                        <button @click="acceptRequest(request)" class="request-button-accept">Accept</button>
                        <button @click="declineRequest(request)" class="request-button-decline">Delete</button>
                    </div>
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
                const otherUserDocRef = doc(db, 'Users', request.userID);
                const otherUserDocSnapshot = await getDoc(otherUserDocRef);
                const otherUserData = otherUserDocSnapshot.data();
                const updatedOtherFriends = [
                    ...(otherUserData.friends || []), // Ensure existing friends are preserved
                    {
                        userID: this.user.uid,
                        username: userData.username
                    }
                ];
                await setDoc(otherUserDocRef, { friends: updatedOtherFriends }, { merge: true });
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
    background-color: #2E2E2E;
    min-height: 100vh;
}

.left-container {
    width: 40%; 
    position: absolute;
    display: flex; 
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
    position: absolute;
    left: 10%;
    top: 40%;
    transform: translateY(100%);
    text-align: left; 
    color: white;
    font-size: 1.1vw; 
    font-weight: normal; 
    margin: 1; 
    white-space: nowrap; 
 }
    
 .right-container {
  margin-top: 1vh;
  width: 50%; 
  height: 100%; 
  left: 40%; 
  overflow-y: auto;
  background-color: #2E2E2E;
  color: white;
  display: flex;
  position: absolute; 
  flex-direction: column;
  }

.friends-request-header {
    margin-top: 2vh;
    margin-bottom: 1vh;
    color: orange;
    font-size: 1.5vw; 
}

.friends-request-display {
    background-color: #3A3A3A;
    border-radius: 1vw;
    padding: 1vw 1vh;
}

.friends-request-display li {
    list-style: none;
    transition: background-color 0.3s;
}

.friends-request-display li:hover {
    background-color: #363333;
}

.friends-request-display li span {
    font-size: 1.5vw;
    margin-left: 1vw;
    width: 50%;
}

.friends-request-display li span strong {
    font-weight: bold;
    color: orange;
}

.request-buttons-container {
    display: flex; 
    position: relative; 
    align-items: center;
}

.request-button-accept,
.request-button-decline {
    font-size: 0.7vw; 
    position: absolute; 
    display: flex;
    padding: 0.5vw 1vh;
    right: 5vw; 
    background-color: red;
    color: white;
    border: none;
    border-radius: 0.5vw;
    cursor: pointer;
    transition: background-color 0.3s ease;
    margin-bottom: 2.5vh; 
}

.request-button-accept {
    background-color: green;
    color: white;
    right: 6vw;
}

.request-button-decline {
    background-color: red;
    color: white;
    right: 2vw;
}

.request-button-accept:hover {
    background-color: rgb(3, 92, 3);
}

.request-button-decline:hover {
    background-color: rgb(191, 8, 8);
}

</style>