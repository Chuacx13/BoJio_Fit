<template>
    <div class = "editProfile-view">
        <h1> Enter your profile details below </h1>
        <ProfileDetailsForm/>
    </div>
</template>

<script>
import ProfileDetailsForm from '@/components/ProfileDetailsForm.vue';

export default {
    name: "EditProfile",

    components: { 
        ProfileDetailsForm
    }
}
</script>

<style scoped>
.editProfile-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: rgb(46, 46, 46);
    min-height: 100vh;
    width: 100%;
    min-height: 100vh; 
    text-align: center;
}

h1 { 
    font-size: 20px;
    font-weight: 900;
    color: orange;
    text-align: center;
    margin-top: 20px;
}
</style>