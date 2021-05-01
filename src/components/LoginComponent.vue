<template>
<div>
    <div class="text-center col-md-8 offset-md-2 mb-md-5" style="font-size: 1rem;">
        <div v-show="errorMessage && errorMessage.length > 0" class="alert alert-danger" role="alert">
            <i class="fas fa-info-circle"></i>
            <span v-html="errorMessage"></span>
        </div>
    </div>
    <form method="POST">
    <div class="form-group row">
        <label for="email_address" class="col-md-4 col-form-label text-md-right">Email</label>
        <div class="col-md-6">
            <input type="text" class="form-control" name="email" v-model="email" maxlength="50" autocomplete="email" autofocus placeholder="Add meg az email címed..."/>
        </div>
    </div>

    <div class="form-group row">
        <label for="password" class="col-md-4 col-form-label text-md-right">Jelszó</label>
        <div class="col-md-6">
            <input type="password" class="form-control" name="password" v-model="password" maxlength="50" autocomplete="new-password" placeholder="Add meg a jelszavad..."/>
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
import { ref } from 'vue';
import { firebase } from '../main.js';
import router from '../router/index.js'
export default {
    name: "LoginComponent",
    setup() {
        const email = ref("");
        const password = ref("");
        const errorMessage = ref("");

        const Login = (e) => {
            e.preventDefault();
            errorMessage.value = '';
            firebase.auth().signInWithEmailAndPassword(email.value, password.value).then(response => {
                router.push('/home');
            }).catch(err => {
                console.log(err);
                handleAuthError(err);
            });
        }

        const handleAuthError = (err) => {
            errorMessage.value = " <strong>Sikertelen bejelentkezés!</strong> ";
            if(err.code.indexOf("auth/invalid-email") > -1) {
                errorMessage.value += 
                    `Helytelen email címet adtál meg.`;
            }
            else if(err.code.indexOf("auth/wrong-password") > -1) {
                errorMessage.value += 
                    `Helytelen jelszót adtál meg.`;
            }
        }

        return {
            email,
            password,
            errorMessage,
            Login,
            handleAuthError
        }
    }
}
</script>

<style>

</style>