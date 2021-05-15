<template>
    <h1 v-if="!isRegisterFinished">Regisztráció</h1>
    <div class="container-fluid pt-5" v-if="!isRegisterFinished">
        <div class="row" >
            <div class="col-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2 col-xl-6 offset-xl-3">
                <div class="user-form">
                    <div class="card">
                        <div class="card-body pt-5 pb-5">
                            <div class="text-center col-md-8 offset-md-2 mb-md-5" style="font-size: 1rem;">
                                <div v-show="errorMessage && errorMessage.length > 0" class="alert alert-danger" role="alert">
                                    <i class="fas fa-info-circle"></i>
                                    <span v-html="errorMessage"></span>
                                </div>
                            </div>
                            <form method="POST">
                                <div class="form-group row">
                                    <label for="email_address" class="col-md-4 col-form-label text-md-right">Név</label>
                                    <div class="col-md-6">
                                        <input type="text" class="form-control" name="name" v-model="username" maxlength="50" autocomplete="name" autofocus placeholder="Add meg a neved...">
                                    </div>
                                </div>
                                    
                                <div class="form-group row">
                                    <label for="email_address" class="col-md-4 col-form-label text-md-right">Email</label>
                                    <div class="col-md-6">
                                    <input type="text" class="form-control" name="email" v-model="email" maxlength="50" autocomplete="email" placeholder="Add meg az email címed..."/>
                                    </div>
                                </div>

                                <div class="form-group row">
                                    <label for="password" class="col-md-4 col-form-label text-md-right">Jelszó</label>
                                    <div class="col-md-6">
                                    <input type="password" class="form-control" name="password" v-model="password" maxlength="50" autocomplete="new-password" placeholder="Add meg a jelszavad..." />
                                    </div>
                                </div>

                                <div class="form-group row">
                                    <label for="password" class="col-md-4 col-form-label text-md-right">Fotóklub</label>
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
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="rating-inactive" style="margin-top:0;">
        <div class="rating-inactive-title">
            <h1 style="font-size: 2.5rem; font-family: Open Sans, sans-serif">A regisztráció már véget ért.</h1>
            <p class="leed">Ha még nem regisztráltál volna, vedd fel a kapcsolatot az adminisztrátorral...</p>
            <div class="row">
                <div class="col-12 text-center">
                    <span class="user-form-redirect">Korábban már regisztráltál? <router-link to="/login">Bejelentkezés</router-link></span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onBeforeMount } from 'vue';
import { firebase, db } from '../main.js';
import router from '../router/index.js'
export default {
    name: "RegisterComponent",
    setup(){
        const username = ref("");
        const email = ref("");
        const password = ref("");
        const circles = ref([]);
        const selectedCircle = ref('');
        const errorMessage = ref('');
        const isRegisterFinished = ref(false);

        const Register = (e) => {
            e.preventDefault();
            errorMessage.value = '';
            if(!username.value) {
                handleAuthError({code: "auth/no-username"});
                return;
            }

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
                handleAuthError(err);
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

        const handleAuthError = (err) => {
            errorMessage.value = " <strong>Sikertelen regisztráció!</strong> ";
            if(err.code.indexOf("auth/no-username") > -1) {
                errorMessage.value += "Nem adtad meg a neved.";
            }
            else if(err.code.indexOf("auth/invalid-email") > -1) {
                errorMessage.value += 
                    `Az email cím formátuma nem megfelelő.<br/>
                    Helyes formátum: a@a.hu`;
            }
            else if(err.code.indexOf("auth/email-already-in-use") > -1) {
                errorMessage.value += 
                    `Az email cím már létezik.<br/>`;
            }
            else if(err.code.indexOf("auth/invalid-password") > -1 || err.code.indexOf("auth/weak-password") > -1) {
                errorMessage.value += 
                    `Helytelen jelszót adtál meg.<br/>
                    A jelszónak legalább 8 karakter hosszúnak kell lennie és tartalmaznia kell:<br/>
                    Nagybetűt (A-Z), kisbetűt (a-z) és számot (0-9). pl: Alma1234`;
            }
        }

        const getUploadEndDate = () => {
        db.collection('rules').get().then((doc) => {
            if (doc.size > 0) {
                let ratingStartDate = doc.docs[0].data().ratingStartDate;
                let registerFinishDate = new Date(new Date(ratingStartDate).setDate(new Date(ratingStartDate).getDate()-1)).toISOString();
                isRegisterFinished.value = registerFinishDate < new Date().toISOString();
            }
        });
        };

        onBeforeMount(() => {
            getPhotoCircles();
            getUploadEndDate();
        })

        return {
            username,
            email,
            password,
            circles,
            selectedCircle,
            Register,
            errorMessage,
            handleAuthError,
            isRegisterFinished
        }
    }
}
</script>

<style>

</style>