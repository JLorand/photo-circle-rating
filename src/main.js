import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/style.css";
import "./assets/js/site.js";


const firebaseConfig = {
  apiKey: "AIzaSyCC8Rd9Y601myI_M6rbr6B1R0H2ZgQWhOA",
  authDomain: "photocirclerating.firebaseapp.com",
  projectId: "photocirclerating",
  storageBucket: "photocirclerating.appspot.com",
  messagingSenderId: "840327815754",
  appId: "1:840327815754:web:53249988007a3f0ac17cb3"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

let app;
firebase.auth().onAuthStateChanged(user => {
  if(!app){
    app = createApp(App)
    .use(store)
    .use(router)
    .mount("#app");
  }
});

export { firebase, db };