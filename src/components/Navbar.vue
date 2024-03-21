<template>
    <nav class="navbar">
        <router-link class="nav-route" to="/" exact>Home</router-link>
        <router-link class="nav-route" to="/login">Login</router-link>
        <router-link class="nav-route" to="/signup">Sign Up</router-link>
    </nav>]
</template>

<script>
export default {
    name: 'Navbar'
}
</script>

<style>
.navbar {
    width: 100%;
    height: 3rem;
    position: relative;
    background-color: transparent;
    z-index: 100;
}

.nav-route {
    float: left;
    display: block;
    color: white;
    text-align: center;
    padding: 14px 20px;
    text-decoration: none;
}

.nav-route:hover {
    color: rgb(240, 152, 70);
}

.nav-route.router-link-exact-active {
    color: rgb(240, 152, 70);
    background-color: transparent;
}
</style>
