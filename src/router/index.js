import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import SignUp from '@/views/SignUp.vue'
import Home from '@/views/Home.vue'
import Tracking from '@/views/Tracking.vue'
import History from '@/views/History.vue'
import SearchUsers from '@/views/SearchUsers.vue'
import FriendRequests from '@/views/FriendRequests.vue'
import Feed from '@/views/Feed.vue'
import Analytics from '@/views/Analytics.vue'
import Friends from '@/views/Friends.vue'
import Profile from '@/views/Profile.vue'
import EditProfile from '@/views/EditProfile.vue'
import NotFound from '@/views/NotFound.vue'
import SetUpProfile from '@/views/SetUpProfile.vue'
import FriendProfile from '@/views/FriendProfile.vue'
import EditWorkout from '@/views/EditWorkout.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/signup',
        name: 'SignUp',
        component: SignUp
    },
    {
        path: '/tracking',
        name: 'Tracking',
        component: Tracking
    },
    {
        path: '/history',
        name: 'History',
        component: History
    },
    {
        path: '/searchUsers',
        name: 'SearchUsers',
        component: SearchUsers
    },
    {
        path: '/friendRequests',
        name: 'FriendRequests',
        component: FriendRequests
    },
    {
        path: '/feed',
        name: 'Feed',
        component: Feed
    }, 
    {
        path: '/friends',
        name: 'Friends',
        component: Friends
    },
    {
        path: '/profile',
        name: 'Profile',
        component: Profile
    },
    {
        path: '/analytics',
        name: 'Analytics',
        component: Analytics
    },
    {
        path: '/editprofile',
        name: 'EditProfile',
        component: EditProfile
    }, 
    {
        path: '/:catchAll(.*)',
        name: 'NotFound',
        component: NotFound
    },
    {
        path: '/setupprofile',
        name: 'SetUpProfile',
        component: SetUpProfile
    },
    {
        path: '/friendprofile/:friendId',
        name: 'FriendProfile',
        component: FriendProfile,
        props: true
    }, 
    {
        path: '/editworkout/:workoutIndex',
        name: 'EditWorkout',
        component: EditWorkout,
        props: true
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router