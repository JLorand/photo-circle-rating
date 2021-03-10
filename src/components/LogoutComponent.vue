<template>
  <div>
      <a type="button" class="nav-link" @click="Logout">
        Kijelentkezés
      </a>
  </div>
</template>

<script>
import { ref } from "vue";
import {firebase} from '../main.js';
import router from '../router/index.js'
export default {
  name: "LogoutComponent",
  setup() {
    const Logout = (e) => {
      e.preventDefault();
      firebase.auth().signOut().then((response) => {
          router.push('/');
        }).catch((err) => {
          console.log(err);
        });
    };

    return {
      Logout,
    };
  },
};
</script>

<style>
</style>