<template>
    <div class="search-users-bar">
        <input type="text" v-model="searchQuery" @input="searchUsers" placeholder="Enter username...">
    </div>
    <div class="search-users-result">
        <ul v-show="searchResults.length > 0">
            <li v-for="otherUser in searchResults">
                <img v-if="otherUser.profilePicture || defaultProfilePic" :src="otherUser.profilePicture" class="profile-picture">
                <span>{{ otherUser.username }}</span>
                <button @click="addFriend(otherUser)">Add Friend</button>
            </li>
        </ul>
    </div>
</template>
  
<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, getDocs, query, collection, where, getDoc, doc, setDoc } from 'firebase/firestore';
import defaultProfilePic from '@/assets/default_profile_pic.jpeg';

export default {
    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.user = user;
            }
        })
    },

    data() {
        return {
            searchQuery: '',
            searchResults: [],
            defaultProfilePic: defaultProfilePic
        };
    },

    methods: {
        async searchUsers() {
            this.searchResults = [];
            if (!this.searchQuery) {
                this.searchResults = [];
                return;
            }
            const db = getFirestore();
            const userDocRef = doc(db, 'Users', this.user.uid);
            const userDocSnapshot = await getDoc(userDocRef);
            const userData = userDocSnapshot.data();
            const currentUsername = userData.username;
            const querySnapshot = await getDocs(
                query(
                    collection(db, "Users"),
                    where("username", ">=", this.searchQuery),
                    where("username", "<", this.searchQuery + 'z'),
                    where("username", "!=", currentUsername)
                )
            );
            try {
                querySnapshot.forEach(doc => {
                    this.searchResults.push(doc.data());
                });
            } catch(error) {
                console.error('Error searching users:', error);
            };
        },

        async addFriend(otherUser) {
            const db = getFirestore();
            const userDocRef = doc(db, 'Users', otherUser.uid);
            const currentUserDocRef = doc(db, 'Users', this.user.uid);

            try {
                const userDocSnap = await getDoc(userDocRef);
                const currentUserDocSnap = await getDoc(currentUserDocRef);
                if (userDocSnap.exists()) {
                    let userData = userDocSnap.data();
                    let currentUserData = currentUserDocSnap.data();
                    let currentUsername = currentUserData.username;
                    const alreadySent = userData.friendRequests.some(request => request.userID === this.user.uid);
                    const alreadyFriend = userData.friends.some(friends => friends.userID === this.user.uid);
                    if (alreadySent) {
                        alert('You have already sent a friend request to this user.');
                    } else if (alreadyFriend) {
                        alert('You are already friends with this user.');
                    } else {
                    // Add the new friend request to friendRequests
                        const updatedFriendRequests = [
                            ...(userData.friendRequests || []), // Ensure existing requests are preserved
                            {
                                userID: this.user.uid,
                            }
                        ];
                        await setDoc(userDocRef, { friendRequests: updatedFriendRequests }, { merge: true });
                        alert('friend request sent');
                    }
                } else {
                    alert('error sending friend request');
                    console.error("User document does not exist");
                }
            } catch (error) {
                console.error('Error adding friend:', error);
            }
        }
    },
};
</script>

<style scoped>
.search-users-bar {
    position: absolute;
    top: 17vh; 
    left: 20vw;
    display: flex;
    align-items: center;
}

.search-users-bar input[type="text"] {
    width: 20vw; 
    height: 1vh; 
    font-size: 1vw;
    padding: 1vh 1vw;
    margin-left: 20vw; 
    margin-top: 5vh;
    margin-bottom: 1vh; 
    display: flex;
    position: fixed;
    background-color: white;
    border-radius: 0.5vw;
}

.search-users-result {
    justify-content: space-between;
    position: absolute;
    margin-top: 2vh; 
    top: 20vh;
    left: 40vw;
    width: 22vw;
    color: white; 
    background-color: #3A3A3A;
    border-radius: 1vw;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Add box shadow for a nicer look */
    overflow-y: auto; /* Enable scrolling for overflow */
}

.search-users-result li {
    list-style: none;
    position: relative; 
    padding: 1vw 0.5vh; 
    transition: background-color 0.3s; /* Add smooth transition */
}

.search-users-result li span {
    font-size: 1vw; 
}

.search-users-result li:hover {
    background-color: #cdc7c7; /* Highlight on hover */
}

.search-users-result button {
    font-size: 0.7vw; 
    transform: translateY(-15%);
    position: absolute; 
    padding: 0.5vw 1vh;
    margin-left: 60%; 
    right: 1vw; 
    background-color: orange;
    color: white;
    border: none;
    border-radius: 0.5vw;
    cursor: pointer;
}

.search-users-result button:hover {
    background-color:green; /* Darker color on hover */
}

.search-users-result li:last-child {
    border-bottom: none;
}

.search-users-result ul {
    padding: 0; 
    margin: 0.5vw; 
}

.profile-picture {
    width: 2vw;
    height: 2vh; 
    border-radius: 50%;
    margin-right: vw;
    position: relative;
}
</style>
