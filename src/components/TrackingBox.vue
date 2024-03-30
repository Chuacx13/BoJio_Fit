<template>
    <div id="tracking-box">
        <input type="text" id="name-input" v-model="exercise.name" placeholder="Name of Exercise" required>
        <div id="workout-details" v-for="(set, index) in exercise.sets" :key="index">
            <input type="number" id="weight-input" v-model="set.weight" placeholder="Weight" required>
            <input type="number" id="reps-input" v-model="set.reps" placeholder="Reps" required>
        </div>
        <div id="tracking-buttons">
            <button type="button" id="add-button" @click="addSet"> Add Set </button>
            <button type="button" id="delete-button" @click="deleteSet"> Delete Set </button>
        </div>
    </div>
</template>

<script>
export default {
    name: "TrackingBox",

    props: {
        exercise: Object
    },

    methods: {
        addSet() {
            this.exercise.sets.push({ weight: null, reps: null });
        },

        deleteSet() {
            if (this.exercise.sets.length > 1) {
                this.exercise.sets.pop();
            }
        }
    }
}
</script>

<style scoped>
#tracking-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    padding: 20px;
    background: white;
    border-radius: 8px;
    margin-bottom: 20px;
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

#add-button, #delete-button {
    border-radius: 10px;
    border: none;
    color: white;
    padding: 6px;
    margin: 10px;
    cursor: pointer;
    width: 100px;
}

#add-button {
    background-color: orange;
}

#delete-button {
    background-color: red;
}
</style>