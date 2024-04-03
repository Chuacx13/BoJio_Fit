<template>
    <div class="friends-view">
        <h3>This is the Friends Page</h3>
    </div>
</template>

<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

export default {
    name: "Friends",

    data() {
        return {
            user: null, // Change to null for better type handling
        };
    },

    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                this.user = user;
                await this.fetchUserData(); // Call the method to fetch user data
            }
        });
    },

    methods: {
        async fetchUserData() {
            const db = getFirestore();
            const userDocRef = doc(db, 'Users', this.user.uid);
            try {
                const userDocSnapshot = await getDoc(userDocRef);
                if (userDocSnapshot.exists()) {
                    // Process the user data here if the document exists
                    console.log("User data:", userDocSnapshot.data());
                } else {
                    console.log("User document does not exist");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        },
    },
};
</script>

<style scoped>
/* Add your styles here */
</style>
