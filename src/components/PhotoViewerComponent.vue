<template>
<div>
    <div id="photo-viewer-section">
        <div class="container-fluid align-items-center">
            <div class="row text-center">
                <photo-view-component
                    v-for="image in images" :key="image.id"
                    :id="image.id"
                    :url="image.url"
                    :title="image.title"
                    :is-rated="isRated(image.id)"
                    @magnifyImage="magnifyImage"
                    @rateImage="rateImage">
                </photo-view-component>
            </div>
            <div class="row">
                <div class="col-12 text-center">
                    <button class="btn-go" 
                        :disabled="loadMoreDisabled"
                        @click="loadMore">
                        További képek
                    </button>
                </div>
            </div>
        </div>
    </div>
    
<div v-show="showPreview && previewSrc.length > 0" ref="previewer" class="previewer">
    <div class="previewer-inner">
        <img :src="previewSrc" class="previewer-image"/>
    </div>
</div>

<rating-component :photo-to-rate="photoToRate" @imageRated="updateRatedImages" ref="ratingComponentRef"/>

</div>
</template>

<script>
import {ref, onBeforeMount, nextTick} from 'vue';
import {firebase, db } from '../main.js';
import PhotoViewComponent from '../components//PhotoViewComponent.vue';
import RatingComponent from '../components//RatingComponent.vue';
export default {
    components: { PhotoViewComponent, RatingComponent },
    name: "PhotoViewerComponent",
    setup(){
        const images = ref([]);
        const lastImageDoc = ref();
        const hasNextImage = ref(true);
        const showPreview = ref(false);
        const previewSrc = ref('');
        const photoToRate = ref('');
        const ratedPhotoIds = ref([]);

        // Load initial images
        const getFirstNImages = () => {
            const limit = 9;
            const firstImageSet = db.collection("images").orderBy("createdDate").limit(limit);
            firstImageSet.get().then((snapshot) => {
                snapshot.docs.forEach((doc) => {
                    if(doc.exists) {
                        const imageData = doc.data();
                        images.value = [
                            ...images.value, 
                            Object.assign({}, {id: doc.id, title: imageData.title, url: imageData.donwloadUrl})
                        ]
                    }
                });
                if(snapshot.docs.length < limit) {
                    hasNextImage.value = false;
                } else {
                    lastImageDoc.value = snapshot.docs[snapshot.docs.length-1];
                }
            })
        };

        const getRatedImagesByCurrentUser = () => {
            const that = this;
            db.collection("ratings").get()
            .then((query) => {
                const userId = firebase.auth().currentUser.uid;
                query.docs.forEach((doc) => {
                    if (doc.exists) {
                        const ratings = doc.data().ratings;
                        const givenRating = ratings.filter((x) => x.userId == userId)?.length > 0;
                        if(givenRating) {
                            ratedPhotoIds.value.push(doc.id)
                        }
                    }
                })
            });
        };

        onBeforeMount(() => {
            getRatedImagesByCurrentUser();
            getFirstNImages();
        });

        return {
            images,
            lastImageDoc,
            hasNextImage,
            showPreview,
            previewSrc,
            photoToRate,
            ratedPhotoIds
        }
    },
    computed: {
        loadMoreDisabled: {
            get() {
                return this.hasNextImage == false;
            }
        },
    },
    methods: {
        loadMore() {
            if(!this.hasNextImage) return;
            const limit = 3;
            const nextNImages = db.collection("images").orderBy("createdDate").startAfter(this.lastImageDoc).limit(limit);
            let that = this;
            nextNImages.get().then((snapshot) => {
                snapshot.docs.forEach((doc) => {
                    if(doc.exists) {
                        const imageData = doc.data();
                        that.images.push(Object.assign({}, {id: doc.id, title: imageData.title, url: imageData.donwloadUrl}));
                    }
                })
                if(snapshot.docs.length < limit) {
                    this.hasNextImage = false;
                } else {
                    that.lastImageDoc = snapshot.docs[snapshot.docs.length-1];
                }
            });
        },
        magnifyImage(url) {
            this.previewSrc = url;
            this.showPreview = true;
            const previewer = this.$refs.previewer;
            previewer.addEventListener('click', () => {this.showPreview = false}, {once: true});
        },
        rateImage(id) {
            this.photoToRate = this.images.filter(x => x.id == id)[0];
            this.$refs.ratingComponentRef.showRatingModal();
        },
        isRated(imageId) {
                return this.ratedPhotoIds.includes(imageId);
        },
        updateRatedImages(ratedImageId) {
            this.ratedPhotoIds.push(ratedImageId);
        }
    }
}
</script>

<style>
.previewer {
    min-width: 100vw;
    min-height: 100vh;
    background: rgba(0,0,0,0.95);
    z-index: 9998;
    position: absolute;
    top:0;
    left:0;
}

.previewer-inner {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    position: fixed;
}

.previewer-image {
    max-width: 85vw;
    max-height: 85vh;
    z-index: 9999;
}
</style>