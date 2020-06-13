import { Injectable, OnDestroy } from "@angular/core";
import { AngularFireMessaging } from "@angular/fire/messaging";
import { AngularFireFunctions } from "@angular/fire/functions";
import { ToastController } from "@ionic/angular";
import { tap } from "rxjs/operators";
import { AngularFirestore } from "@angular/fire/firestore";
import { TextModel } from "./shared/text.model";
import { User } from "./shared/user.model";


@Injectable()
export class MessagingService implements OnDestroy {
    token;

    constructor( private afm: AngularFireMessaging,
                 private fun: AngularFireFunctions,
                 private tc: ToastController,
                 private afs: AngularFirestore ) {

    }

    ngOnDestroy(): void { }

    async makeToast( message ) {
        const toast = await this
            .tc
            .create( {
                         message,
                         duration: 5000,
                         position: "top",
                         color: "success"
                     } );

        await toast.present();
    }

    // Returns an observable that contains the token
    getPermission() {
        return this.afm.requestToken;
    }

    // Return the token that will be used to remove the token string from the string
    revokePermission() {
        return this.afm.getToken;
    }

    showMessages() {
        this.afm.messages.subscribe( msg => {
            const body: any = (msg as any).notification.body;
            console.log( "msg" );
        } );
    }


    subs( topic ) {
        this.fun.httpsCallable( "subscribeToTopic" )(
            { token: this.token, topic: topic } )
            .pipe( tap( tap => this.makeToast( tap ) ) )
            .subscribe( () => {}, error => {console.log( error );} );
    }

    unsub( topic ) {
        this.fun.httpsCallable( "unsubscribeToTopic" )(
            { token: this.token, topic: topic } )
            .pipe( tap( tap => this.makeToast( tap ) ) )
            .subscribe();
    }


    testMessage() {
        const random = Math.round( Math.random() * 100 );
        const headline = "New Test: " + random + "!!!";

        this.afs.collection( "test" ).add( { headline: headline } )
            .then( () => {console.log( "New Random Added!" );} );
        this.showMessages();
    }

    sendMessage( user: User, user2: User, text: TextModel ) {
        return this.fun.httpsCallable( "notifyUser" )
        ( { user: user, user2: user2, message: text } )
                   .pipe( tap( tap => this.makeToast( tap ) ) );

    }
}
