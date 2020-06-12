import { Injectable } from "@angular/core";
import { AngularFireMessaging } from "@angular/fire/messaging";
import { AngularFireFunctions } from "@angular/fire/functions";
import { ToastController } from "@ionic/angular";
import { tap } from "rxjs/operators";
import { AngularFirestore } from "@angular/fire/firestore";


@Injectable()
export class MessagingService {
    token;

    constructor( private afm: AngularFireMessaging,
                 private fun: AngularFireFunctions,
                 private tc: ToastController,
                 private afs: AngularFirestore ) {

    }

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

    getPermission() {
        // this.afm.deleteToken( this.token );

        return this.afm.requestToken.pipe(
            // tap( token => {
            //     this.token = token;
            //     console.log( this.token );
            // } )
        ).subscribe( value => {console.log( value );} );
    }

    showMessages() {

        // this.afm.messages.pipe(
        //     tap( msg => {
        //         const body: any = (msg as any).notification.body;
        //         this.makeToast( body );
        //     } )
        // ).subscribe(value => {
        //     const body: any = (value as any).notification.body;
        //     this.makeToast( body );
        // });

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

    sendMessage() {
        const random = Math.round( Math.random() * 100 );
        const headline = "New Test: " + random + "!!!";

        this.afs.collection( "test" ).add( { headline: headline } )
            .then( () => {console.log( "New Random Added!" );} );
        this.showMessages();
    }
}