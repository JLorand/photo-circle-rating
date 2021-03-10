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
                <input type="file" class="custom-file-input" id="customFile" lang="hu">
                <label class="custom-file-label" for="customFile" @change="onFileChange">Kép kiválasztása</label>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-12 text-center">
            <button type="button" class="btn-go" @click="Login">Feltöltés</button>
        </div>
    </div>
    </form>
</div>
</template>

<script>
import {ref} from 'vue';
import {firebase} from '../main.js';
import router from '../router/index.js'
export default {
    name: "PhotoUploadFormComponent",
    setup() {
        const title = ref("");
        const description = ref("");

        const onFileChange = () => {

        }

        return {
            title,
            description,
            onFileChange
        }
    }
}
</script>

<style>

</style>