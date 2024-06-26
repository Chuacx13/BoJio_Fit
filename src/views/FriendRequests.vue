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
import { getFirestore, doc, getDoc, setDoc, updateDoc, getDocs, collection, query, where } from 'firebase/firestore';

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
                    console.log("ran function");
                    const userData = userDocSnapshot.data();
                    const friendUserIds = userData.friendRequests.map(friendRequest => friendRequest.userID);
                    const usersCollectionRef = collection(db, 'Users');
                    const userQuerySnapshot = await getDocs(query(usersCollectionRef, where('uid', 'in', friendUserIds)));
                    this.friendRequests = userQuerySnapshot.docs.map(doc => {
                        return {
                            userID: doc.data().uid,
                            username: doc.data().username
                        };
                    });
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
            try {
                const userData = userDocSnapshot.data();
                await updateDoc(userDocRef, {
                    friendRequests: this.friendRequests.filter(req => req.userID !== request.userID)
                });
                const updatedFriends = [
                    ...(userData.friends || []), // Ensure existing friends are preserved
                    {
                        userID: request.userID,
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
  width: 50%; 
  left: 40%; 
  overflow-y: auto;
  background-color: #2E2E2E;
  color: white;
  position: absolute; 
}

.friends-request-header {
    color: orange;
    font-size: 2vw; 
    margin-bottom: 0;
}

.friend-request-item {
    background-color: #3A3A3A; 
    border-radius: 1vw;
    padding: 1vw 2vh; 
    margin-bottom: 1.5vh; 
}

.friends-request-display {
    position: fixed;
    width: 40%; 
    border-radius: 0.5vw;
    color: white;
    font-size: 1vw;
    padding: 0.5vh; 
}

.friends-request-display li {
    justify-content: space-between;
    list-style: none;
    transition: background-color 0.3s;  
}

.friends-request-display li:hover {
    background-color: #363333;
}

.friends-request-display li span {
    font-size: 1.2vw; 
}

.friends-request-display li span strong {
    font-weight: bold;
    color: orange;
}

.request-buttons-container {
    display: flex; 
    position: relative; 
    align-items: center;
    justify-content: space-between;
}

.request-button-accept,
.request-button-decline {
    font-size: 0.9vw; 
    position: absolute;
    display: flex;
    padding: 0.5vh 1vw;
    color: white;
    border: none;
    border-radius: 0.5vw;
    cursor: pointer;
    transition: background-color 0.3s ease;
    margin-bottom: 1vw;
}

.request-button-accept {
    background-color: green;
    color: white;
    right: 10%;
    margin-right: 1vw;
}

.request-button-decline {
    background-color: red;
    color: white;
    right: 0%;
    margin-left: 1vw; 
}

.request-button-accept:hover {
    background-color: rgb(3, 92, 3);
}

.request-button-decline:hover {
    background-color: rgb(191, 8, 8);
}

</style>