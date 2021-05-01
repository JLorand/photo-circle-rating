<template>
  <div>
    <div class="container-fluid">
      <navbar-component />
      <section id="photo-upload-section">
        <div class="row">
          <div class="col-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2 col-xl-6 offset-xl-3">
            <div class="user-form">
              <div class="card">
                <div class="card-body pt-5">
                  <photo-upload-form-component />
                  <div class="text-center">
                    <a class="text-white help" data-toggle="collapse" href="#upload-info">
                      <i class="fa fa-info-circle"></i>
                      Információ
                    </a>
                  </div>
                  <div class="collapse show" id="upload-info">
                    <hr>
                    <div class="text-center">
                      <p class="mb-0">
                        <b style="font-size: 1rem;">Kép technikai kritériuma:</b>
                      </p>
                        <ul style="list-style-type: none; padding: 0px; margin: 0px; font-size: 0.8rem">
                          <li>File név: alkotó_képcím.jpg (Kis Béla_Pöttyös póni.jpg)</li>
                          <li>1500 pixel hosszabbik oldal, 10-es tömörítésű jpg</li>
                          <li>A kép bármilyen technikával készülhet, a fotó utómunkája megengedett</li>
                          <li>A kép nem tartalmazhat keretet, vízjelet</li>
                          <li>Feltöltés után nem módosítható a kép</li>
                        </ul>
                    </div>
                  </div>
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
          router.push("/home");
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

<style scoped>
  .help:focus {
    box-shadow: none;
  }
</style>