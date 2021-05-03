<template>
<div>
    <form method="POST">

        <div v-show="uploadSucceeded" class="alert alert-info col-md-10 offset-md-1 mb-md-5 text-center" style="font-size: 1rem;" role="alert">
            <i class="fas fa-info-circle"></i>
            Sikeres képfeltöltés.
        </div>

        <div class="form-group row">
            <label for="email_address" class="col-md-4 col-form-label text-md-right">A kép címe</label>
            <div class="col-md-6">
                <input type="text" class="form-control" maxlength="50" v-model="title" />
            </div>
        </div>

        <div class="form-group row">
            <label for="email_address" class="col-md-4 col-form-label text-md-right align-middle">A kép leírása</label>
            <div class="col-md-6">
                <textarea class="form-control" maxlength="125" v-model="description" />
            </div>
        </div>

        <div class="form-group row">
            <label for="password" class="col-md-4 col-form-label text-md-right">Kép</label>
            <div class="col-md-6">
                <div class="custom-file">
                    <input type="file" class="custom-file-input" id="customFile"
                        ref="file"
                        @change="onFileChange">
                    <label class="custom-file-label" for="customFile">{{fileInputLabel}}</label>
                </div>
            </div>
            <div v-show="uploadInProgress" class="col-md-6 offset-md-4 mt-1">
                <div class="progress">
                    <div 
                        :class="[progressBarColor, 'progress-bar']" 
                        :style="{width: uploadProgress + '%'}"></div>
                </div>
            </div>
        </div>
        
        <div v-show="showFileValidation" class="row">
            <div class="col-12 text-center mt-4">
                <p class="small">A kiválasztott fájl mérete nagyobb 2.5MB-nál!</p>
            </div>
        </div>

        <div class="row" v-show="showGenericError">
            <div class="col-12 text-center mt-4">
                <p class="small">A feltöltés meghiúsult! Kérem, keresse fel az oldal üzemeltetőjét!</p>
            </div>
        </div>

        <div class="row" v-show="resolutionNotAllowedError">
            <div class="col-12 text-center mt-4">
                <p class="small">A feltöltés meghiúsult! A kép maximális felbontása 1500x1500 pixel lehet!</p>
            </div>
        </div>
        
        <div v-show="uploadInProgress == false && uploadSucceeded == false" class="row">
            <div class="col-12 text-center mt-4">
                <p class="small">A feltöltés meghiúsult! Kérem, keresse fel az oldal üzemeltetőjét!</p>
            </div>
        </div>

        <div class="row">
            <div class="col-12 text-center">
                <button type="button" class="btn-go" 
                    :disabled="uploadDisabled"
                    @click="onUpload">Feltöltés</button>
            </div>
        </div>
    </form>
</div>
</template>

<script>
import { ref } from 'vue';
import { firebase, storage, db } from '../main.js';
import router from '../router/index.js'
export default {
    name: "PhotoUploadFormComponent",
    setup() {
        const title = ref("");
        const description = ref("");
        const selectedFile = ref(null);
        const showFileValidation = ref(false);
        const showGenericError = ref(false);
        const uploadInProgress = ref(false);
        const uploadProgress = ref(0);
        const uploadSucceeded = ref(null);
        const resolutionNotAllowedError = ref(false);
        const uid = firebase.auth().currentUser.uid;
                
        const onFileChange = (event) => {
            const uploadedFile = event?.target?.files[0];
            showFileValidation.value = false;
            showGenericError.value = false;
            resolutionNotAllowedError.value = false;

            if(!uploadedFile){
                selectedFile.value = null;
                return;
            }

            if(uploadedFile.size > 2500000) {
                showFileValidation.value = true;
                selectedFile.value = null;
                return;
            }

            var reader = new FileReader();
            reader.readAsDataURL(uploadedFile);
            reader.onload = function (e) {
                var image = new Image();
                image.src = e.target.result;
                image.onload = function () {
                    var height = this.height;
                    var width = this.width;
                    if (height > 1500 || width > 1500) {
                        resolutionNotAllowedError.value = true;
                    }
                };
            };

            selectedFile.value = uploadedFile;
        };

        const onUpload = (e) => {
            e.preventDefault();
            if (!selectedFile?.value) return;

            const storageRef = storage.ref();
            var uploadTask = storageRef.child('images/'+uid).put(selectedFile.value);
            uploadTask.on('state_changed', 
            (snapshot) => {
                uploadSucceeded.value = null;
                uploadInProgress.value = true;
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                uploadProgress.value = progress;
            }, 
            (error) => {
                console.log(error);
                uploadSucceeded.value = false;
                uploadProgress.value = 100;
                hideProgressBar();
            }, 
            () => {
                uploadSucceeded.value = true;
                hideProgressBar();
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    let usersCircleId;
                    db.collection('users').doc(uid).get().then((doc) => {
                        if (doc.exists) {
                            usersCircleId = doc.data().circleId;
                        }
                    }).then(() => {
                        db.collection('images').add({
                            userId: uid,
                            donwloadUrl: downloadURL,
                            title: title.value,
                            description: description.value,
                            circleId: usersCircleId,
                            createdDate: new Date().toISOString()
                        });
                    });
                })
            });
        }

        const hideProgressBar = () => {
            setTimeout(() => {
                uploadInProgress.value = false
            }, 2000);
        };

        return {
            title,
            description,
            selectedFile,
            uploadInProgress,
            uploadProgress,
            uploadSucceeded,
            showFileValidation,
            showGenericError,
            resolutionNotAllowedError,
            onFileChange,
            onUpload
        }
    },
    computed: {
        uploadDisabled: {
            get() {
                return this.uploadSucceeded == true || this.showFileValidation || this.showGenericError || this.resolutionNotAllowedError;
            }
        },
        progressBarColor: {
            get() {
                return this.uploadSucceeded == null || this.uploadSucceeded == true 
                    ? 'bg-warning' : 'bg-danger';
            }
        },
        fileInputLabel: {
            get() {
                if(this.selectedFile) {
                    return this.selectedFile.name
                } else {
                    return 'Kép kiválasztása...';
                }
            }
        }
    }
}
</script>

<style>

</style>