<template>
    <div class="col-12 col-sm-6 col-xl-4 d-flex justify-content-center">
        <div class="card mb-3">
            <img class="card-img-top" :src="url" @click="magnifyImage()">
            <div class="title-container" @click="rateImage()">
                <h2 class="card-title h4">
                    {{title}}
                    <i v-show="isRated" class="far fa-check-circle photo-rate-status"></i>
                </h2>
            </div>
        </div>
    </div>
</template>

<script>
import {ref} from 'vue';
import {firebase, db } from '../main.js';
export default {
    components: {  },
    name: "PhotoViewComponent",
    props: {
        title: String,
        url: String,
        id: String,
        isRated: Boolean,
    },
    setup(){
        const ratingOpenerRef = ref(null);
        return {
            ratingOpenerRef
        }
    },
    methods: {
        magnifyImage() {
            this.$emit('magnify-image', this.$props.url);
        },
        rateImage() {
            this.$emit('rate-image', this.$props.id);
        },
    }
}
</script>

<style scoped>
.photo-rate-status {
    color: green;
    vertical-align: bottom;
    margin-left: 0.5rem;
}
</style>