<template>
  <div>
    <!-- Modal -->
    <div
      class="modal fade"
      id="exampleModalCenter"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalCenterTitle"
      aria-hidden="true"
      data-keyboard="false"
      data-backdrop="static"
    >
      <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalCenterTitle">
              Kép értékelése
            </h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Bezárás"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div v-show="userCantRateThisPhoto" class="alert alert-info" role="alert">
              <i class="fas fa-info-circle"></i>
              Saját fotóklubbod képeit nem tudod értékelni.
            </div>
            <form method="POST">
              <div class="form-group row">
                <label
                  for="email_address"
                  class="col-md-4 col-form-label text-md-right"
                  >Kép címe</label
                >
                <div class="col-md-6">
                  <span class="d-flex align-items-center h-100" style="text-transform: capitalize;">{{
                    photoToRate.title
                  }}</span>
                </div>
              </div>

              <div class="form-group row">
                <label
                  for="email_address"
                  class="col-md-4 col-form-label text-md-right"
                  >Pontszám</label
                >
                <div class="col-md-6">
                  <select class="form-control" v-model="score">
                    <option
                      v-for="index in scores"
                      v-bind:key="index"
                      v-bind:value="index"
                      :selected="index == 5 ? true : false"
                      :disabled="userCantRateThisPhoto"
                    >
                      {{ index }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="form-group row">
                <label
                  for="password"
                  class="col-md-4 col-form-label text-md-right"
                  >Szöveges értékelés</label
                >
                <div class="col-md-6">
                  <textarea
                    v-model="comment"
                    class="form-control"
                    maxlength="300"
                    :disabled="userCantRateThisPhoto"
                  />
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <div class="container-fluid p-0">
              <div class="row">
                <div class="col-6 text-left">
                  <button
                    type="button"
                    class="btn btn-cancel"
                    data-dismiss="modal"
                    style="margin: 0"
                  >
                    Mégse
                  </button>
                </div>
                <div class="col-6 text-right">
                  <button
                    type="button"
                    class="btn btn-go"
                    style="margin: 0"
                    :disabled="userCantRateThisPhoto"
                    @click="saveRating"
                  >
                    Mentés
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { firebase, db, $ } from "../main.js";
export default {
  components: {},
  name: "RatingComponent",
  props: {
    photoToRate: {},
  },
  setup() {
    const scores = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    const user = ref(null);
    const usersCircleId = ref(null);
    const userCantRateThisPhoto = ref(false);
    const score = ref(null);
    const comment = ref(null);

    onMounted(() => {
      user.value = firebase.auth().currentUser;
      db.collection("users")
        .doc(user.value.uid)
        .get()
        .then((doc) => {
          if (doc.exists) {
            usersCircleId.value = doc.data().circleId;
          }
        });
    });

    return {
      scores,
      user,
      usersCircleId,
      userCantRateThisPhoto,
      score,
      comment,
    };
  },
  methods: {
    showRatingModal() {
      $(".modal").modal("show");
    },
    hideRatingModal() {
      $(".modal").modal("hide");
    },
    saveRating(e) {
      e.preventDefault();
      db.collection("ratings")
        .doc(this.photoToRate.id)
        .get()
        .then((doc) => {
          if (!doc.exists) {
            db.collection("ratings")
              .doc(this.photoToRate.id)
              .set({
                title: this.photoToRate.title,
                ratings: [
                  {
                    userId: this.user.uid,
                    name: this.user.displayName,
                    score: this.score,
                    comment: this.comment,
                  },
                ],
              });
          } else {
            db.collection("ratings")
              .doc(this.photoToRate.id)
              .get()
              .then((doc) => {
                let ratings = doc.data().ratings;
                let that = this;
                ratings = ratings.map((rating) =>
                  rating.userId == that.user.uid
                    ? {
                        userId: rating.userId,
                        name: rating.name,
                        score: that.score,
                        comment: that.comment,
                      }
                    : rating
                );
                if (
                  ratings.filter((x) => x.userId == that.user.uid).length === 0
                ) {
                  ratings.push({
                    userId: that.user.uid,
                    name: that.user.displayName,
                    score: that.score,
                    comment: that.comment,
                  });
                }
                db.collection("ratings")
                  .doc(this.photoToRate.id)
                  .update({ ratings: ratings });
              });
          }
          this.$emit('image-rated', this.photoToRate.id);
          this.hideRatingModal();
        });
    },
  },
  watch: {
    photoToRate(newVal, oldVal) {
      const that = this;
      db.collection("images")
        .doc(newVal.id)
        .get()
        .then((doc) => {
          if (doc.exists) {
            const imageCircleId = doc.data().circleId;
            imageCircleId == that.usersCircleId
              ? (that.userCantRateThisPhoto = true)
              : (that.userCantRateThisPhoto = false);
            that.score = 5;
            that.comment = null;
          }
        });
      db.collection("ratings")
        .doc(this.photoToRate.id)
        .get()
        .then((doc) => {
          if (doc.exists) {
            const ratings = doc.data().ratings;
            const givenRating = ratings.filter(
              (x) => x.userId == that.user.uid
            )?.[0];
            that.score = givenRating?.score ?? 5;
            that.comment = givenRating?.comment ?? null;
          }
        });
    },
  },
};
</script>

<style>
</style>