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
                    images.push({ id: doc.id, title: docData.title, userId: docData.userId });
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

        const fillGridFrame = (grid) => {
            // Fill the first column with image ids
            for (let row = 1; row < grid.length; row++) {
                grid[row][0] = allImages.value[row-1].id;
            }

            // Fill the first row with user ids
            for (let col = 1; col < grid[0].length; col++) {
                grid[0][col] = allUsers.value[col-1].id;
            }
        }

        const replaceIdsWithNamesAndTitles = (grid) => {
            // Replace iamge ids with names
            for (let row = 1; row < grid.length; row++) {
                const uploaderId = allImages.value[row-1].userId;
                const uploaderName = allUsers.value.filter(x => x.id == uploaderId).map(x => x.name).toString();
                grid[row][0] = `${allImages.value[row-1].title} (${uploaderName})`;
            }

            // Replace user ids with names
            for (let col = 1; col < grid[0].length; col++) {
                grid[0][col] = allUsers.value[col-1].name;
            }
        }

        const createCsvStructure = (grid) => {
            // Create CSV structure
            let content = "";
            for (let row = 0; row < grid.length; row++) {
                for(let col = 0; col < grid[row].length; col++) {
                    const current = grid[row][col];
                    if(current && current != '\t' && current.toString().trim().length > 0)
                    {
                        content += grid[row][col].toString().replace('\n', ' ').replace('\t', ' ') + '\t';
                    } else {
                        content += '\t';
                        continue;
                    }
                }
                content += '\n';                
            }
            return content;
        }

        const getRatings = () => {
            // Create empty two dimensional array for the result
            let resultsGrid = Array.from(Array(allImages.value.length+1), () => new Array(allUsers.value.length+1));
            
            fillGridFrame(resultsGrid);

            // Fill the resultsGrid (2D matrix) with rating scores
            for (let rating = 0; rating < allRatings.value.length; rating++) {
                let imageRatings = allRatings.value[rating].rating.ratings.map(r =>  { return {userId: r.userId, score: r.score }});
                for (let imageRating = 0; imageRating < imageRatings.length; imageRating++) {
                    const actualImageRating = imageRatings[imageRating];
                    let row = resultsGrid.findIndex((result) => result.includes(allImages.value[rating].id));
                    let col = resultsGrid[0].indexOf(actualImageRating.userId);
                    resultsGrid[row][col] = actualImageRating.score;
                }
            }
            
            replaceIdsWithNamesAndTitles(resultsGrid);

            const content = createCsvStructure(resultsGrid);
            
            // Persist CSV
            var storageRef = firebase.storage().ref();
            storageRef.child('ratings').putString(content);
        };

        const getComments = () => {
            // Create empty two dimensional array for the result
            let commentsGrid = Array.from(Array(allImages.value.length+1), () => new Array(allUsers.value.length+1));
            
            fillGridFrame(commentsGrid);

            // Fill the commentsGrid (2D matrix) with rating comments
            for (let rating = 0; rating < allRatings.value.length; rating++) {
                let imageRatings = allRatings.value[rating].rating.ratings.map(r =>  { return {userId: r.userId, comment: r.comment }});
                for (let imageRating = 0; imageRating < imageRatings.length; imageRating++) {
                    const actualImageRating = imageRatings[imageRating];
                    let row = commentsGrid.findIndex((result) => result.includes(allImages.value[rating].id));
                    let col = commentsGrid[0].indexOf(actualImageRating.userId);
                    commentsGrid[row][col] = actualImageRating.comment;
                }
            }
            
            replaceIdsWithNamesAndTitles(commentsGrid);

            const content = createCsvStructure(commentsGrid);
            
            // Persist CSV
            var storageRef = firebase.storage().ref();
            storageRef.child('comments').putString(content);
        };

        onBeforeMount(async () => {
            await getAllImages(getAllUsers);
            await getAllUsers();
            await getAllRatings();
            getRatings();
            getComments()
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