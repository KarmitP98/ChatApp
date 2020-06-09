import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();


// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest( ( request, response ) => {
    response.send( "Hello from Firebase!" );
} );

export const subsToTopic = functions.https.onCall(
    async ( data, context ) => {
        await admin.messaging().subscribeToTopic( data.token, data.topic );

        return "Subscribed to ${data.topic}";
    }
);

export const unsubToTopic = functions.https.onCall(
    async ( data, context ) => {
        await admin.messaging().unsubscribeFromTopic( data.token, data.topic );

        return "Unsubscribed to ${data.topic}";
    }
);

export const sendOnFirestoreCreate = functions.firestore
                                              .document( "users/{userId}" )
                                              .onCreate( async snapshot => {
                                                             const user = snapshot.data();

                                                             const notification: admin.messaging.Notification = {
                                                                 title: "New User!",
                                                                 body: user.userName
                                                             };

                                                             const payload: admin.messaging.Message = {
                                                                 notification,
                                                                 webpush: {
                                                                     notification: {
                                                                         vibrate: [ 100, 200, 100 ],
                                                                         icon: "https://angularfirebase.com/images/logo.png",
                                                                         actions: [
                                                                             {
                                                                                 action: "like",
                                                                                 title: "Like"
                                                                             },
                                                                             {
                                                                                 action: "dislike",
                                                                                 title: "Dislike"
                                                                             }
                                                                         ]
                                                                     }
                                                                 },
                                                                 topic: "Users"

                                                             };

                                                             return admin.messaging().send( payload );
                                                         }
                                              );
