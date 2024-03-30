<template>
    <div id="tracking-box">
        <form @submit.prevent="saveWorkout">
            <input type="text" id="name-input" v-model="exerciseName" placeholder="Name of Exercise" required>
            <div id="workout-details">
                <input type="number" id="weight-input" v-model="weight" placeholder="Weight" required>
                <input type="number" id="reps-input" v-model="reps" placeholder="Reps" required>
            </div>
            <div id="tracking-buttons">
                <button type="button" id="add-button"> Add Set </button>
                <button type="button" id="delete-button"> Delete Set </button>
            </div>
        </form>
    </div>
</template>

<script>
export default {
    name: "TrackingBox",
    methods: {}
}
</script>

<style scoped>
#tracking-box {
    display: flex;
    justify-content: center;
    text-align: center;
    padding: 20px;
    background: white;
    border-radius: 8px;
}

#workout-details, #tracking-buttons {
    display: flex;
    justify-content: center;
}

#name-input {
    border-radius: 8px;
    margin: 10px;
    padding: 6px;
}

#weight-input, #reps-input {
    border-radius: 8px;
    width: 100px;
    margin: 10px;
    padding: 6px;
}

#add-button {
    background-color: orange;
    border-radius: 10px;
    border: none;
    color: white;
    padding: 6px;
    margin: 10px;
    cursor: pointer;
    width: 100px;
}

#delete-button {
    background-color: red;
    border-radius: 10px;
    border: none;
    color: white;
    padding: 6px;
    margin: 10px;
    cursor: pointer;
    width: 100px;
}
</style>