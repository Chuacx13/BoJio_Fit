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
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
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
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

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
             profilePicture: null
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
            // Get document reference from "Workouts" collection with unique "uid" document 
            const userDocRef = doc(db, 'Users', this.user.uid);
            const docSnap = await getDoc(userDocRef);

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
        }
    }
}
</script>

<style scoped> 
.form-group {
    display: flex;
    align-items: center;
    padding: 20px;
}

label {
    width: 80px;
    margin-right: 10px;
    display: block;
    color: white;
}

input, select {
    flex: 1;
    padding: 8px;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 4px;
}

button {
    width: 100%;
    padding: 10px 0;
    background-color: orange;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 5vh;
}
</style>