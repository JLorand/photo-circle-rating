<template>
<div>
    <form method="POST">
        <div class="form-group row">
            <label for="email_address" class="col-md-4 col-form-label text-md-right">Név</label>
            <div class="col-md-6">
            <input type="text" class="form-control" name="name" v-model="username" maxlength="50" autocomplete="name" autofocus />
            </div>
        </div>
            
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

        <div class="form-group row">
            <label for="password" class="col-md-4 col-form-label text-md-right">Fotókör</label>
            <div class="col-md-6">
                <select class="form-control" v-model="selectedCircle">
                    <option v-for="(circle, index) in circles" v-bind:key="circle.key" v-bind:value="circle.key" :selected="index == 0 ? true : false">
                        {{ circle.value }}
                    </option>
                </select>
            </div>
        </div>

        <div class="row">
            <div class="col-12 text-center">
                <button type="button" class="btn-go" @click="Register">Regisztráció</button>
            </div>
        </div>

        <div class="row">
            <div class="col-12 text-center">
                <span class="user-form-redirect">Korábban már regisztráltál? <router-link to="/login">Bejelentkezés</router-link></span>
            </div>
        </div>
    </form>
</div>
</template>

<script>
import {ref, onBeforeMount} from 'vue';
import {firebase, db} from '../main.js';
import router from '../router/index.js'
export default {
    name: "RegisterComponent",
    setup(){
        const username = ref("");
        const email = ref("");
        const password = ref("");
        const circles = ref([]);
        const selectedCircle = ref('');

        const Register = (e) => {
            e.preventDefault();
            firebase.auth().createUserWithEmailAndPassword(email.value, password.value).then(response => { 
                if(response.operationType === "signIn" && response.user) {
                    updateUserProfile(response.user);
                    createUserDoc(response.user).then(() => {
                        firebase.auth().signOut().then((response) => {
                            router.push('/login');
                        }).catch((err) => {
                            console.log(err);
                        });
                    });
                }
            }).catch(err => {
                console.log(err);
            });
        }

        const updateUserProfile = async (user) => {
            await user.updateProfile({ displayName: username.value }).catch((err) => {
                console.log(err);
            });
        }
        const createUserDoc = (user) => {
            return db.collection('users').doc(user.uid).set({ circleId: selectedCircle.value, name: username.value }, { merge: true });
        }

        const getPhotoCircles = () => {
            db.collection('circles').get().then(snap => {
                let tempCircles = [];
                snap.forEach(doc => {
                    tempCircles.push({ key: doc.id, value: doc.data().name });
                });
                circles.value = tempCircles;
                selectedCircle.value = tempCircles[0]?.key;
            });
        }

        onBeforeMount(() => {
            getPhotoCircles();
        })

        return {
            username,
            email,
            password,
            circles,
            selectedCircle,
            Register
        }
    }
}
</script>

<style>

</style>