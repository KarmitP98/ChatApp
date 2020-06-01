import { Component, OnDestroy, OnInit } from "@angular/core";
import { User } from "../../shared/user.model";
import { UserService } from "../../shared/user.service";
import { ActivatedRoute, Router } from "@angular/router";
import { untilDestroyed } from "@orchestrator/ngx-until-destroyed";
import { AngularFireDatabase } from "@angular/fire/database";
import { ToastController } from "@ionic/angular";
import { ChatModel } from "../../shared/chat.model";
import * as firebase from "firebase";

@Component( {
                selector: "app-chat",
                templateUrl: "./chat.page.html",
                styleUrls: [ "./chat.page.scss" ]
            } )
export class ChatPage implements OnInit, OnDestroy {

    user: User;
    user2: User;
    chatId: string;
    chat: ChatModel;
    data: string;

    constructor( private router: Router, private us: UserService, private route: ActivatedRoute, private store: AngularFireDatabase,
                 private toastController: ToastController ) { }

    ngOnInit() {

        this.us.userSubject.pipe( untilDestroyed( this ) ).subscribe( value => {
            if ( value ) {
                this.user = value;
            }
        } );

        this.chatId = this.route.snapshot.params["id"];
        console.log( this.chatId );

        this.store.list( "users" ).valueChanges().pipe(
            untilDestroyed( this ) ).subscribe( value => {
            console.log( value );
        } );

        const col = firebase.firestore().collection( "users" );

        const query = col.where( "chatIds", "array-contains", this.chatId );

        query.get().then( value => {
            value.docs.forEach( ( value1, index, array ) => {
                console.log( index + ":" + value1.data() );
                console.log( array );
            } );
        } );

    }

    ngOnDestroy(): void {}

    goBack(): void {
        this.router.navigate( [ "dashboard", "chats" ] );
    }

    async presentToast() {
        const toast = await this.toastController.create( {
                                                             message: "Your settings have been saved.",
                                                             duration: 2000
                                                         } );
        toast.present();
    }
}
