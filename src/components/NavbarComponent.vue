<template>
    <header id="header" class="d-flex justify-content-center align-items-center header-transparent">
        <nav class="nav-menu d-block">
            <ul>
                <li :class="$route.path === '/home' ? 'active' : ''"><router-link class="nav-link" to="/home">Értékelés</router-link></li>
                <li v-show="isUploadVisible == true" :class="$route.path === '/photo-upload' ? 'active' : ''"><router-link class="nav-link" to="photo-upload">Kép feltöltése</router-link></li>
                <li><logout-component/></li>
            </ul>
        </nav>
  </header>
</template>

<script>
import {onBeforeMount, ref} from 'vue';
import LogoutComponent from "../components/LogoutComponent.vue";
import {firebase, db } from '../main.js';
export default {
    components: { LogoutComponent },
    name: "NavbarComponent",
    setup(){
        const isUploadVisible = ref(false);

        onBeforeMount(() => {
            firebase.auth().onAuthStateChanged((user) => {
                if(user) {
                    const userDocRef = db.collection('images').where("userId", "==", user.uid).get()
                    .then((querySnapshot) => {
                        if(querySnapshot.empty) {
                            isUploadVisible.value = true;
                        }
                    });
                }
            });
        });

        return {
            isUploadVisible
        }
    }
}
</script>

<style>

</style>