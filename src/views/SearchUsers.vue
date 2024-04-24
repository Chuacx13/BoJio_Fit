<template>
    <div class="overall-container">
      <div class="left-container">
        <div class="left-text">
          <h3><span class="orange-text">WORKOUT</span><br/><span class="white-text">BUDDY</span></h3>
        </div>
        <div class="encouragement-text">
          <p>Find a friend to workout with!<br>Keep each other accountable<br>& hit your fitness goals together!</p>
        </div>
      </div>
      <div class="searchUsers-content">
        <div class="search-text"><h3>Search Users</h3></div> 
        <div class="search-users-container">
          <div class="search-users-bar">
            <input type="text" v-model="searchQuery" @input="handleSearchInput" placeholder="Enter username...">
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
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { getAuth, onAuthStateChanged } from "firebase/auth";
  import { getFirestore, getDocs, query, collection, where, getDoc, doc, setDoc } from 'firebase/firestore';
  import { debounce } from 'lodash';
  import defaultProfilePic from '@/assets/default_profile_pic.jpeg';
  
  export default {
    name: "SearchUsers",
  
    data() {
      return {
        user: false,
        searchQuery: '',
        searchResults: [],
        defaultProfilePic: defaultProfilePic
      };
    }, 
  
    mounted() {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.user = user;
        }
      })
    },
  
    methods: {
      debouncedSearchUsers: debounce(function() {
        this.searchUsers();
      }, 200),
  
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
  
      handleSearchInput() {
        this.debouncedSearchUsers();
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
  .overall-container {
    display: flex;
    min-height: 100vh; 
    background-color: #2E2E2E; 
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
    display: flex; 
    left: 10%;
    top: 40%;
    transform: translateY(100%);
    text-align: left; 
    color: white;
    font-size: 1.1vw; 
    font-weight: normal; 
    white-space: nowrap; 
  }
  
  .search-users-bar {
    position: absolute;
    display: flex;
    align-items: center;
  }
  
  .search-users-bar input[type="text"] {
    width: 20vw; 
    font-size: 0.8vw;
    padding: 0.8vh 1vw;
    position: absolute;
    background-color: white;
    border-radius: 0.5vw;
    margin-bottom: 0.5vh;
  }
  
  .search-users-result {
    justify-content: space-between;
    position: absolute;
    margin-top: 2vh; 
    width: 22.5vw;
    color: white; 
    background-color: #3A3A3A;
    border-radius: 1vw;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Add box shadow for a nicer look */
    overflow-y: auto; /* Enable scrolling for overflow */
  }
  
  .search-users-result li {
    display: flex; 
    align-items: center;
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
    height: 2vw; 
    border-radius: 50%;
    margin-right: 0.5vw;
    margin-left: 0.5vw;
    position: relative;
}

.searchUsers-content {  
    position: relative;
    left: 40%;
}
.search-users-container {
    position: relative; 
}

.search-text { 
    margin-bottom: 1vh;
    font-size: 2vw;
    color: orange; 
  }
  </style>
  