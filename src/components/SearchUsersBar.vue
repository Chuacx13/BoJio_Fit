<template>
    <div class="search-users-bar">
        <input type="text" v-model="searchQuery" @input="searchUsers" placeholder="Search users by username">
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
            const querySnapshot = await getDocs(
                query(
                    collection(db, "Users"),
                    where("username", ">=", this.searchQuery),
                    where("username", "<", this.searchQuery + 'z'),
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
                    if (alreadySent) {
                        alert('You have already sent a friend request to this user.');
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
    top: 15%; 
    right: 25%; 
    display: flex;
    align-items: center;
    width: 50%;
    justify-content: center;
    margin: 40px;
}

.search-users-bar input[type="text"] {
    padding: 10px;
    width: 50%;
    color: black;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
}

.search-users-bar ul {
    padding: 0;
    margin-top: 5px;
    background-color: white; 
    border-radius: 5px;
    padding: 10px;
    width: 50%;
    color: black;
    border-radius: 5px;
    font-size: 16px;
}

.search-users-bar li {
    padding: 10px;
    border-bottom: 1px solid #ccc;
}

.search-users-bar li:last-child {
    border-bottom: none;
}
</style>
  