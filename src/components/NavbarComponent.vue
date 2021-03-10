<template>
    <header id="header" class="fixed-top d-flex justify-content-center align-items-center header-transparent">
        <nav class="nav-menu d-block">
            <ul>
                <li :class="$route.path === '/home' ? 'active' : ''"><router-link class="nav-link" to="/home">Értékelés</router-link></li>
                <li :class="$route.path === '/photo-upload' ? 'active' : ''"><router-link class="nav-link" to="photo-upload">Kép feltöltése</router-link></li>
                <li><logout-component/></li>
            </ul>
        </nav>
  </header>
</template>

<script>
import {ref} from 'vue';
import LogoutComponent from "../components/LogoutComponent.vue";
export default {
    components: { LogoutComponent },
    name: "NavbarComponent",
    setup(){
        return {
        }
    }
}
</script>

<style>

</style>