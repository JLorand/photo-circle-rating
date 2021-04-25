<template>
    <navbar-component/>
    <photo-viewer-component/>
</template>

<script>
import {ref} from 'vue';
import NavbarComponent from "../components/NavbarComponent.vue";
import PhotoViewerComponent from "../components/PhotoViewerComponent.vue";
export default {
    components: { NavbarComponent, PhotoViewerComponent },
    name: "HomeComponent",
    setup(){
        return {
        }
    }
}
</script>

<style>

</style>