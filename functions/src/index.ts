import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as firebase from "firebase";

admin.initializeApp();
firebase.initializeApp( {
                            apiKey: "AIzaSyDOET2aE-nc863eUemkVaWZa9Bgo7Kw3_E",
                            authDomain: "ionic-testing-6fc81.firebaseapp.com",
                            databaseURL: "https://ionic-testing-6fc81.firebaseio.com",
                            projectId: "ionic-testing-6fc81",
                            storageBucket: "ionic-testing-6fc81.appspot.com",
                            messagingSenderId: "859780049545",
                            appId: "1:859780049545:web:fff3202c00595c78bff458",
                            measurementId: "G-KWWBWK6P9P"
                        } );

// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest( ( request, response ) => {
    response.send( "Hello from Firebase!" );
} );

// Function to subscribe to a topic
export const subscribeToTopic = functions.https.onCall(
    async ( data, context ) => {
        await admin.messaging().subscribeToTopic( data.token, data.topic );
        return "Subscribed to " + data.topic;
    }
);

// Function to unsubscribe to a topic
export const unsubscribeToTopic = functions.https.onCall(
    async ( data, context ) => {
        await admin.messaging().unsubscribeFromTopic( data.token, data.topic );

        return "Unsubscribed to " + data.topic;
    }
);

// Function to detect any changes to the specific document
export const sendOnFirestoreCreate =
    functions.firestore
             .document( "test/{testId}" )
             .onCreate( async snapshot => {
                            const test = snapshot.data();
                            console.log( test );

                            const notification: admin.messaging.Notification = {
                                title: "New Test Available!",
                                body: test.headline
                            };

                            const payload: admin.messaging.Message = {
                                notification: notification,
                                webpush: {
                                    notification: {
                                        vibrate: [ 100,
                                                   200,
                                                   100 ],
                                        actions: [
                                            {
                                                action: "like",
                                                title: "Like"
                                            },
                                            {
                                                action: "dislike",
                                                title: "Dislike"
                                            }
                                        ],
                                        body: "These are the notification options!!!"
                                    }
                                },
                                topic: "test"

                            };

                            return admin.messaging().send( payload );
                        }
             );
