<template>
<div>
    <form method="POST">
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
                    :disabled="uploadDisabled"
                    @change="onFileChange">
                <label class="custom-file-label" for="customFile">{{fileInputLabel}}</label>
            </div>
        </div>
        <div v-show="showFileValidation" class="col-md-6 offset-md-4 mt-1">
            <p class="small">A kiválasztott fájl mérete nagyobb 2.5MB-nál</p>
        </div>
        <div v-show="uploadInProgress" class="col-md-6 offset-md-4 mt-1">
            <div class="progress">
                <div 
                    :class="[progressBarColor, 'progress-bar']" 
                    :style="{width: uploadProgress + '%'}"></div>
            </div>
        </div>
        <div v-show="uploadInProgress == false && uploadSucceeded == false" class="col-md-6 offset-md-4 mt-1">
            <p class="small">A feltöltés meghiúsult! Próbálja meg újra!</p>
        </div>
    </div>
    
    <div class="row" v-show="showGenericError">
        <div class="col-md-10 offset-md-2 mt-4">
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
import {computed, ref} from 'vue';
import {firebase, storage, db } from '../main.js';
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
        const uid = firebase.auth().currentUser.uid;
                
        const onFileChange = (event) => {
            const uploadedFile = event?.target?.files[0];
            if(!uploadedFile){
                selectedFile.value = null;
                return;
            }

            if(uploadedFile.size > 2500000)
                showFileValidation.value = true;

            showFileValidation.value = false;
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
                        }).then(() => {
                            router.push('/home');
                        })
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
            onFileChange,
            onUpload
        }
    },
    computed: {
        uploadDisabled: {
            get() {
                return this.uploadSucceeded == true;
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