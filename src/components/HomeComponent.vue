<template>
    <navbar-component />
    <div v-if="isRatingStarted">
      <photo-viewer-component />
    </div>
    <div v-else class="rating-inactive">
      <div class="rating-inactive-title">
        <h1>Az értékelés még nem kezdődött el.</h1>
        <p class="leed">Ha még nem töltöttél fel képet, a "Képfeltöltés" menüpont alatt megteheted...</p>
      </div>
    </div>
</template>

<script>
import { onBeforeMount, ref } from "vue";
import { db } from '../main.js';
import NavbarComponent from "../components/NavbarComponent.vue";
import PhotoViewerComponent from "../components/PhotoViewerComponent.vue";
export default {
  components: { NavbarComponent, PhotoViewerComponent },
  name: "HomeComponent",
  setup() {
    const isRatingStarted = ref(false);

    const getRatingStartDate = () => {
      db.collection('rules').get().then((doc) => {
          if (doc.size > 0) {
            let ratingStartDate = new Date(doc.docs[0].data().ratingStartDate).toISOString();
            isRatingStarted.value = ratingStartDate < new Date().toISOString();
          }
      });
    };

    onBeforeMount(() => {
      getRatingStartDate();
    });

    return {
      isRatingStarted
    };
  },
};
</script>

<style>
</style>