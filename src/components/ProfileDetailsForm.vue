<template> 
    <form @submit.prevent="submitForm">
        <div class="form">    
            <div class="form-group">
                <label for="name">Name:</label>
                <input type="text" id="name" v-model="name" required>
            </div>
            <div class="form-group">
                <label for="age">Age:</label>
                <input type="number" id="age" v-model="age" required>
            </div>
            <div class="form-group">
                <label for="gender">Gender:</label>
                <select id="gender" v-model="gender" required>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div class="form-group">
                <label for="height">Height:</label>
                <input type="number" id="height" v-model="height" required>
            </div>
            <div class="form-group">
                <label for="weight">Weight:</label>
                <input type="number" id="weight" v-model="weight" required>
            </div>
            <div class="form-group">
                <label for="tele">Telegram Handle:</label>
                <input type="text" id="telegram" v-model="telegram" required>
            </div>
            <div class="form-group">
                <label for="profilePicture">Profile Picture:</label>
                <input type="file" id="profilePicture" accept="image/*" @change="handleProfilePicChange">
            </div>
            <button type="submit">Save</button>
        </div>    
    </form>
</template>

<script> 
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, getDocs, collection, query, where } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import defaultProfilePic from '@/assets/default_profile_pic.jpeg';

export default {
    name: 'ProfileDetailsForm',

    data() {
        return {
             user: false,
             name: '',
             age: '',
             gender: '',
             height: '',
             weight: '',
             telegram: '',
             profilePicture: defaultProfilePic
        }
    }, 

    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.user = user;
                this.fetchUserData(user);
            }
        })
    },
    
    methods: {
        async fetchUserData(user) {
            const db = getFirestore();
            const userDocRef = doc(db, 'Users', this.user.uid);
            const docSnap = await getDoc(userDocRef);
            try {
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    this.name = userData.username; 
                    this.age = userData.age;
                    this.gender = userData.gender;
                    this.height = userData.height;
                    this.weight = userData.weight;
                    this.telegram = userData.telegram;
                    this.profilePicture = userData.profilePicture;
                }
            } catch (err) {
                console.log(err);
            }
        },

        async submitForm() {
            const db = getFirestore();
            const userDocRef = doc(db, 'Users', this.user.uid);
            const docSnap = await getDoc(userDocRef);

            const isDuplicateUsername = await this.checkDuplicateUsername(this.name);
            if (isDuplicateUsername) {
                console.error('Username already exists. Please choose a different username.');
                alert('Username already exists. Please choose a different username.');
                return;
            }

            try {
                if (docSnap.exists()) {
                    await setDoc(userDocRef, {
                        username: this.name,
                        age: this.age,
                        gender: this.gender,
                        height: this.height,
                        weight: this.weight,
                        telegram: this.telegram,
                        profilePicture: this.profilePicture,
                        uid: this.user.uid, 
                        friendRequests: docSnap.data().friendRequests, 
                        friends: docSnap.data().friends
                    }, {merge: true});
                    this.$router.push({ name: 'Profile' });
                } else {
                    await setDoc(userDocRef, {
                        username: this.name,
                        age: this.age,
                        gender: this.gender,
                        height: this.height,
                        weight: this.weight,
                        telegram: this.telegram,
                        profilePicture: this.profilePicture,
                        uid: this.user.uid, 
                        friendRequests: [], 
                        friends: []
                    })
                    this.$router.push({ name: 'Home' });
                }
            } catch (error) {
                console.error(error);
            }
        },

        async handleProfilePicChange(event) {
            const file = event.target.files[0];
            const storage = getStorage();
            const storageRef = ref(storage, `profile_pictures/${this.user.uid}/${file.name}`);

            try {
                const snapshot = await uploadBytesResumable(storageRef, file);
                const dlURL = await getDownloadURL(snapshot.ref);
                this.profilePicture = dlURL;
                console.log("Download URL:", dlURL);
            } catch (error) {
                console.error("Error uploading image:", error);
            }   
        }, 

        async checkDuplicateUsername(username) {
            const db = getFirestore();
            const usersCollectionRef = collection(db, 'Users');
            const querySnapshot = await getDocs(query(usersCollectionRef, where('username', '==', username)));
            const currentUserUid = this.user.uid;
            const filteredDocs = querySnapshot.docs.filter(doc => doc.id !== currentUserUid);
            return !(filteredDocs.length === 0);
        }
    }
}
</script>

<style scoped> 
.form-group {
    display: flex;
    align-items: center;
    padding: 3vh;
}

label {
    width: 8vw;
    margin-right: 1vw;
    display: block;
    color: white;
    font-size: 1vw;
}

input, select {
    flex: 1;
    padding: 0.5vh;
    box-sizing: border-box;
    border: 0.1vh solid #ccc;
    border-radius: 0.4vh;
    font-size: 1vw;
}

button {
    width: 90%;
    padding: 1vh 0;
    background-color: orange;
    color: white;
    border: none;
    border-radius: 0.4vh;
    cursor: pointer;
    margin-top: 3vh;
    margin-bottom: auto;
    font-size: 1vw;
}
</style>