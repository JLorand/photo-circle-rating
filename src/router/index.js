import { createRouter, createWebHistory } from "vue-router";
import { firebase, storage, db } from '../main.js';

const routes = [{
        path: "/",
        name: "Welcome",
        component: () =>
            import ( /* webpackChunkName: "Welcome" */ "../views/Welcome.vue")
    },
    {
        path: "/login",
        name: "Login",
        component: () =>
            import ( /* webpackChunkName: "login" */ "../views/Login.vue"),
        meta: { onlyUnauthorized: true }
    },
    {
        path: "/register",
        name: "Register",
        component: () =>
            import ( /* webpackChunkName: "Register" */ "../views/Register.vue"),
        meta: { onlyUnauthorized: true }
    },
    {
        path: "/home",
        name: "Home",
        component: () =>
            import ( /* webpackChunkName: "Home" */ "../views/Home.vue"),
        meta: { requiresAuth: true }
    },
    {
        path: "/results",
        name: "Results",
        component: () =>
            import ( /* webpackChunkName: "Results" */ "../views/Results.vue"),
        meta: { requiresAuth: true }
    },
    {
        path: "/photo-upload",
        name: "PhotoUpload",
        component: () =>
            import ( /* webpackChunkName: "PhotoUpload" */ "../views/PhotoUpload.vue"),
        meta: { requiresAuth: true },
        beforeEnter: (to, from, next) => {
            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    const userDocRef = db.collection('images').where("userId", "==", user.uid).get()
                        .then((querySnapshot) => {
                            if (querySnapshot.empty) {
                                next();
                                return;
                            } else {
                                next('/home');
                                return;
                            }
                        });
                } else {
                    next();
                    return;
                }
            })
        }
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});


router.beforeEach((to, from, next) => {
    firebase.auth().onAuthStateChanged((user) => {
        const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
        const onlyUnauthorized = to.matched.some(record => record.meta.onlyUnauthorized);
        if (user) {
            if (onlyUnauthorized) {
                next('/home');
                return;
            } else {
                next();
                return;
            }
        } else {
            if (requiresAuth) {
                next('/login');
                return;
            } else {
                next();
                return;
            }
        }
    });
});

export default router;