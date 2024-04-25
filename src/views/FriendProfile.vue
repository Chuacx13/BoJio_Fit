<template>
    <div class = "friend-profile-view">
        <ProfileCard :uid="friendId"/> 
    </div>
</template>
  
<script>
import ProfileCard from '@/components/ProfileCard.vue';

export default {
    name: 'FriendProfile',

    components: {
        ProfileCard
    },

    props: ['friendId'],
}
</script>
  
<style scoped>
.friend-profile-view {
  display: flex;
  justify-content: center;
  width: 100%;
  min-height: 100vh; 
  text-align: center;
  background-color: rgb(46, 46, 46); 
}
</style>