import { Injectable } from "@angular/core";
import { AngularFireMessaging } from "@angular/fire/messaging";
import { AngularFireFunctions } from "@angular/fire/functions";
import { ToastController } from "@ionic/angular";
import { tap } from "rxjs/operators";


@Injectable()
export class MessagingService {
    token;

    constructor( private afm: AngularFireMessaging,
                 private fun: AngularFireFunctions,
                 private tc: ToastController ) {

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
        return this.afm.requestToken.pipe(
            tap( token => this.token = token )
        );
    }

    showMessages() {
        return this.afm.messages.pipe(
            tap( msg => {
                const body: any = (msg as any).notification.body;
                this.makeToast( body );
            } )
        );
    }

    subs( topic ) {
        this.fun.httpsCallable( "subsToTopic" )( { topic, token: this.token } )
            .pipe( tap( tap => this.makeToast( "Subscribed to ${topic}" ) ) )
            .subscribe();
    }

    unsub( topic ) {
        this.fun.httpsCallable( "unsubToTopic" )( { topic, token: this.token } )
            .pipe( tap( tap => this.makeToast( "Unsubscribed to ${topic}" ) ) )
            .subscribe();
    }
}
