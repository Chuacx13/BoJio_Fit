<template>
    <div class="home-view">
        <div class="promotional-text">
            <p>UNLEASH YOUR MIND.</p>
            <p>UNLOCK YOUR POTENTIAL.</p>
        </div>
        <div class="tracking-text">
            <p>START TRACKING YOUR WORKOUTS TODAY!</p>
        </div>
    </div>
</template>

<script>
export default {
    name: "Home",
}
</script>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100vh; 
  position: fixed;
  background-image: url('@/assets/home_background.png');
  background-size: cover;
  background-position: center center; 
  background-repeat: no-repeat; 
  background-attachment: fixed;
  text-align: center; 
}

.promotional-text p {
    -webkit-text-stroke: 2px orange; 
    color: transparent;
    font-size: 4em; 
    margin: 0; 
    text-align: center;
    font-weight: bold; 
    white-space: nowrap; 
}

.tracking-text p {
    color: white;
    font-size: 2.2em; 
    font-weight: bold; 
    margin: 1; 
    white-space: nowrap; 
}
</style>