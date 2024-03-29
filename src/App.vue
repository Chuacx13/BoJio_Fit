<template> 
    <Navbar/>
    <router-view/>
</template> 

<script> 

export default {
    name: 'App',
    components: {
    }
}
</script>

<style>
#app {
    padding: 0px;
    margin: 0px;
}
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
}
</style>
