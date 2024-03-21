<template> 
    <Navbar/>
    <router-view/>
</template> 

<script> 
import Navbar from '@/components/Navbar.vue'

export default {
    name: 'App',
    components: {
        Navbar
    }
}
</script>

<style>
#app {
    padding: 0px;
    margin: 0px;
}
</style>
