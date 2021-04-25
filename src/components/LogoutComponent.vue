<template>
    <a href="#" type="button" class="nav-link" @click="logout">
      Kijelentkezés
    </a>
</template>s

<script>
import { ref } from "vue";
import {firebase} from '../main.js';
import router from '../router/index.js'
export default {
  name: "LogoutComponent",
  setup() {
    const logout = (e) => {
      e.preventDefault();
      firebase.auth().signOut().then((response) => {
          router.push('/');
        }).catch((err) => {
          console.log(err);
        });
    };

    return {
      logout,
    };
  },
};
</script>

<style>
</style>