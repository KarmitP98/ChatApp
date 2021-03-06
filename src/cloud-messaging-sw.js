import firebase from "firebase";

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../firebase-messaging-sw.js')
        .then(function (registration) {
            console.log('Registration successful, scope is:', registration.scope);
        }).catch(function (err) {
        console.log('Service worker registration failed, error:', err);
    });
}

importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyAPkESNmQ2ogRSQovi7_6LB5_6z_qGjujY",
    authDomain: "chat-application-b01b5.firebaseapp.com",
    databaseURL: "https://chat-application-b01b5.firebaseio.com",
    projectId: "chat-application-b01b5",
    storageBucket: "chat-application-b01b5.appspot.com",
    messagingSenderId: "450919505320",
    appId: "1:450919505320:web:32efa44b4b99380d93919d",
    measurementId: "G-QJCB7D8SGT"
})

const messaging = firebase.messaging();

firebase.messaging().setBackgroundMessageHandler(payload => console.log(payload));
