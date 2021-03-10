<template>
  <div>
    <div class="container-fluid">
      <navbar-component />
      <section id="photo-upload-section">
        <div class="row">
          <div class="col-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2 col-xl-6 offset-xl-3">
            <div class="user-form">
              <div class="card">
                <div class="card-body pt-5 pb-5">
                  <photo-upload-form-component />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { firebase } from "../main.js";
import router from "../router/index.js";
import NavbarComponent from "../components/NavbarComponent.vue";
import PhotoUploadFormComponent from "../components/PhotoUploadFormComponent.vue";
export default {
  name: "LoginComponent",
  components: { NavbarComponent, PhotoUploadFormComponent },
  setup() {
    const email = ref("");
    const password = ref("");

    const Login = (e) => {
      e.preventDefault();
      firebase
        .auth()
        .signInWithEmailAndPassword(email.value, password.value)
        .then((response) => {
          router.push("home");
        })
        .catch((err) => {
          console.log(err);
        });
    };

    return {
      email,
      password,
      Login,
    };
  },
};
</script>

<style>
</style>