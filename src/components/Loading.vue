<template> 
    <div id="loading">
        <img :src="loading" alt="loading"/>
    </div>
</template>

<script> 
import loading from '@/assets/loading.gif';

export default {
    name: 'Loading',

    data() {
        return {
            loading: loading
        }
    }
}
</script>

<style scoped> 
#loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}
</style>