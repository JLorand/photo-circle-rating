<template>
  <div>
    <div class="container-fluid">
      <navbar-component />
      <div id="photo-upload-section" v-if="!isUploadFinished" >
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
      </div>
      <div v-else class="rating-inactive">
        <div class="rating-inactive-title">
          <h1>A képfeltöltés már véget ért.</h1>
          <p class="leed">Ha még nem töltöttél fel képet, vedd fel a kapcsolatot az adminisztrátorral...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onBeforeMount, ref } from "vue";
import { db, firebase } from "../main.js";
import router from "../router/index.js";
import NavbarComponent from "../components/NavbarComponent.vue";
import PhotoUploadFormComponent from "../components/PhotoUploadFormComponent.vue";
export default {
  name: "LoginComponent",
  components: { NavbarComponent, PhotoUploadFormComponent },
  setup() {
    const email = ref("");
    const password = ref("");
    const isUploadFinished = ref(false);

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

    const getUploadEndDate = () => {
      db.collection('rules').get().then((doc) => {
          if (doc.size > 0) {
            let ratingStartDate = doc.docs[0].data().ratingStartDate;
            let uploadFinishDate = new Date(new Date(ratingStartDate).setDate(new Date(ratingStartDate).getDate()-1)).toISOString();
            isUploadFinished.value = uploadFinishDate < new Date().toISOString();
          }
      });
    };

    onBeforeMount(() => {
      getUploadEndDate();
    });

    return {
      email,
      password,
      Login,
      isUploadFinished
    };
  },
};
</script>

<style scoped>
  .help:focus {
    box-shadow: none;
  }
</style>