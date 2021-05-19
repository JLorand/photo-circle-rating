<template>
<div>
    
</div>
</template>

<script>
import { ref, onBeforeMount } from 'vue';
import { firebase, db, storage } from '../main.js';
export default {
    name: "ResultsComponent",
    setup(){
        const allImages = ref([]);
        const allUsers = ref([]);
        const allRatings = ref([]);
        
        const getAllImages = async (callback) => {
            await db.collection('images').get().then(snap => {
                let images = [];
                snap.forEach(doc => {
                    const docData = doc.data();
                    images.push({ id: doc.id, title: docData.title, userId: docData.user });
                });
                allImages.value = images;
                callback();
            });
        };

        const getAllUsers = async () => {
            await db.collection('users').get().then(snap => {
                let users = [];
                snap.forEach(doc => {
                    users.push({ id: doc.id, name: doc.data().name });
                });
                allUsers.value = users;
            });
        };

        const getAllRatings = async () => {
            await db.collection('ratings').get().then(snap => {
                let ratings = [];
                snap.forEach(doc => {
                    const docData = doc.data();
                    ratings.push({ id: doc.id, rating: docData });
                });
                allRatings.value = ratings;
            });
        };

        const getResult = () => {
            // Create empty two dimensional array for the result
            let results = Array.from(Array(allImages.value.length+1), () => new Array(allUsers.value.length+1));
            
            // Fill the first column with image ids
            for (let row = 1; row < results.length; row++) {
                results[row][0] = allImages.value[row-1].id;
            }

            // Fill the first row with user ids
            for (let col = 1; col < results[0].length; col++) {
                results[0][col] = allUsers.value[col-1].id;
            }

            // Fill the results (2D matrix) with rating scores
            for (let rating = 0; rating < allRatings.value.length; rating++) {
                let imageRatings = allRatings.value[rating].rating.ratings.map(r =>  { return {userId: r.userId, score: r.score }});
                for (let imageRating = 0; imageRating < imageRatings.length; imageRating++) {
                    const actualImageRating = imageRatings[imageRating];
                    let row = results.findIndex((result) => result.includes(allImages.value[rating].id));
                    let col = results[0].indexOf(actualImageRating.userId);
                    results[row][col] = actualImageRating.score;
                }
            }
            
            // Replace iamge ids with names
            for (let row = 1; row < results.length; row++) {
                results[row][0] = allImages.value[row-1].title;
            }

            // Replace user ids with names
            for (let col = 1; col < results[0].length; col++) {
                results[0][col] = allUsers.value[col-1].name;
            }

            // Create CSV structure
            let content = "";
            for (let row = 0; row < results.length; row++) {
                for(let col = 0; col < results[row].length; col++) {
                    const current = results[row][col];
                    if(current == undefined)
                    {
                        content += ';';
                        continue;
                    }
                    content += results[row][col] + ';';
                }
                content += '\n';                
            }
            
            var storageRef = firebase.storage().ref();
            storageRef.child('results').putString(content);
        };

        onBeforeMount(async () => {
            await getAllImages(getAllUsers);
            await getAllUsers();
            await getAllRatings();
            getResult();
        });

        return {
            allImages,
            allUsers,
            allRatings,
        }
    }
}
</script>

<style>

</style>