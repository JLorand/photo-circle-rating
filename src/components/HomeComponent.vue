<template>
    <navbar-component/>
</template>

<script>
import {ref} from 'vue';
import NavbarComponent from "../components/NavbarComponent.vue";
export default {
    components: { NavbarComponent },
    name: "HomeComponent",
    setup(){
        return {
        }
    }
}
</script>

<style>

</style>