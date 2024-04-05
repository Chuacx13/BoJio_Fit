<template>
    <div id="not-found">
      <h1>Page Not Found :(</h1>
      <h2>Please click on the above available options</h2>
    </div>
</template>
  
<script>
export default {
    name: "NotFound"
}
</script>

<style scoped> 
#not-found {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

h1 {
    margin-top: 120px;
    font-size: 50px;
}
</style>

