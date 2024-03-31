<template>
    <Navbar/>
    <div class = "editProfile-view">
        <form @submit.prevent="submitForm">
            <div class="form">    
                <div class="form-group">
                    <label for="name">Name:</label>
                    <input type="text" id="name" v-model="formData.name" required>
                </div>
                <div class="form-group">
                    <label for="age">Age:</label>
                    <input type="number" id="age" v-model="formData.age" required>
                </div>
                <div class="form-group">
                    <label for="gender">Gender:</label>
                    <select id="gender" v-model="formData.gender" required>
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="height">Height:</label>
                    <input type="number" id="height" v-model="formData.height" required>
                </div>
                <div class="form-group">
                    <label for="weight">Weight:</label>
                    <input type="number" id="weight" v-model="formData.weight" required>
                </div>
                <div class="form-group">
                    <label for="tele">Telegram Handle:</label>
                    <input type="text" id="tele" v-model="formData.telegram" required>
                </div>
                <button type="submit">Save</button>
            </div>    
        </form>
    </div>
</template>

<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Navbar from '@/components/Navbar.vue'

export default {
    name: "EditProfile",

    components: {
        Navbar
    }, 

    data() {
        return {
            user: false,
            formData: {
                name: '',
                age: null,
                gender: '',
                height: null,
                weight: null,
                telegram: ''
            }
        }
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
        submitForm() {
            // save values into FS
            this.$router.push({ name: 'Home'});
        }
    }
}
</script>

<style scoped>
.editProfile-view {
    display: flex;
    justify-content: center;
    background-color: rgb(46, 46, 46);
    height: 100vh;
    width: 100%;
    min-height: 100vh; 
    background-image: url('@/assets/home_background.png');
    background-size: cover;
    background-position: center center; 
    background-repeat: no-repeat; 
    background-attachment: fixed;
    text-align: center;
}

.form {
    margin-top: 15vh;
}

.form-group {
    display: flex;
    align-items: center;
    margin-top: 5vh;

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
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 5vh;
}
</style>