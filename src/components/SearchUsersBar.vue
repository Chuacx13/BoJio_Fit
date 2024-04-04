<template>
    <div class="search-users-bar">
        <input type="text" v-model="searchQuery" @input="searchUsers" placeholder="Search users by username">
    </div>
    <div class="search-users-result">
        <ul v-show="searchResults.length > 0">
            <li v-for="otherUser in searchResults">
                <span>{{ otherUser.username }}</span>
                <button @click="addFriend(otherUser)">Add Friend</button>
            </li>
        </ul>
    </div>
</template>
  
<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, getDocs, query, collection, where, getDoc, doc, setDoc } from 'firebase/firestore';

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
                                username: currentUsername
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
    top: 20%; /* Adjust the vertical position */
    left: 50%;
    transform: translateX(-50%);
    width: 50%;
    display: flex;
    align-items: center;
}

.search-users-bar input[type="text"] {
    padding: 10px;
    width: 100%;
    color: black;
    border: 1px solid #ccc;
    border-radius: 10px;
    font-size: 20px;
}

.search-users-result {
    position: absolute;
    top: 25%; 
    left: 25%;
    width: 50%;
    background-color: white;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Add box shadow for a nicer look */
    max-height: 200px; /* Limit the height of search results */
    overflow-y: auto; /* Enable scrolling for overflow */
}

.search-users-result li {
    list-style: none;
    padding: 20px;
    border-bottom: 1px solid #ccc;
    cursor: pointer; /* Change cursor to pointer for better user interaction */
    transition: background-color 0.3s; /* Add smooth transition */
}

.search-users-result li span {
    font-size: 25px;
}

.search-users-result li:hover {
    background-color: #cdc7c7; /* Highlight on hover */
}

.search-users-result button {
    margin-left: 30px;
    padding: 8px 16px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.search-users-result button:hover {
    background-color: #0056b3; /* Darker color on hover */
}

.search-users-result li:last-child {
    border-bottom: none;
}
</style>
