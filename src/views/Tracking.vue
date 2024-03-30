<template>
    <div class="tracking-view">
        <h1 class="tracking-header"> Workout </h1>
        <TrackingBox/>
    </div>
</template>
  
<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import TrackingBox from '@/components/TrackingBox.vue';

export default {
    name: "Tracking",
    components: {
        TrackingBox
    },

    data() {
        return {
            user: false,
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
}
</script>

<style scoped>
.tracking-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: rgb(46, 46, 46);
    height: 100vh;
}

.tracking-header {
    color: orange;
    margin-top: 150px;
}
</style>
