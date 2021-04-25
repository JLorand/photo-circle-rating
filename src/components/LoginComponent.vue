<template>
<div>
    <form method="POST">
    <div class="form-group row">
        <label for="email_address" class="col-md-4 col-form-label text-md-right">Email</label>
        <div class="col-md-6">
            <input type="text" class="form-control" name="email" v-model="email" maxlength="50" autocomplete="email" />
        </div>
    </div>

    <div class="form-group row">
        <label for="password" class="col-md-4 col-form-label text-md-right">Jelszó</label>
        <div class="col-md-6">
            <input type="password" class="form-control" name="password" v-model="password" maxlength="50" autocomplete="new-password" />
        </div>
    </div>

    <div class="row">
        <div class="col-12 text-center">
            <button type="button" class="btn-go" @click="Login">Bejelentkezés</button>
        </div>
    </div>

    <div class="row">
        <div class="col-12 text-center">
            <span class="user-form-redirect">Esetleg még nem regisztráltál? <router-link to="/register">Regisztráció</router-link></span>
        </div>
    </div>
    </form>
</div>
</template>

<script>
import {ref} from 'vue';
import {firebase} from '../main.js';
import router from '../router/index.js'
export default {
    name: "LoginComponent",
    setup() {
        const email = ref("");
        const password = ref("");

        const Login = (e) => {
            e.preventDefault();
            firebase.auth().signInWithEmailAndPassword(email.value, password.value).then(response => {
                router.push('/home');
            }).catch(err => {
                console.log(err);
            });
        }

        return {
            email,
            password,
            Login
        }
    }
}
</script>

<style>

</style>