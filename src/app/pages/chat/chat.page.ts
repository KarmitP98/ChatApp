import { Component, OnDestroy, OnInit } from "@angular/core";
import { User } from "../../shared/user.model";
import { UserService } from "../../shared/user.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AngularFireDatabase } from "@angular/fire/database";
import { ToastController } from "@ionic/angular";
import { ChatModel } from "../../shared/chat.model";
import { untilDestroyed } from "@orchestrator/ngx-until-destroyed";
import { TextModel } from "../../shared/text.model";

@Component( {
                selector: "app-chat",
                templateUrl: "./chat.page.html",
                styleUrls: [ "./chat.page.scss" ]
            } )
export class ChatPage implements OnInit, OnDestroy {

    user: User;
    user2: User;
    chatId: string;
    data: string;
    chat: ChatModel;
    messages: TextModel[] = [];

    constructor( private router: Router, private us: UserService, private route: ActivatedRoute, private store: AngularFireDatabase,
                 private toastController: ToastController ) { }

    ngOnInit() {

        this.us.userSubject
            .pipe( untilDestroyed( this ) )
            .subscribe( value => {
                this.user = value;
            } );

        this.chatId = this.route.snapshot.params["id"];
        const userEmails = this.chatId.split( "-" );
        const userEmail2 = userEmails.filter( value => value !== this.user.userEmail )[0];

        this.us.fetchUsers( "userEmail", userEmail2 )
            .pipe( untilDestroyed( this ) )
            .subscribe( value => {
                this.user2 = value[0];
            } );


        this.us.fetchChats( "chatId", this.chatId )
            .pipe( untilDestroyed( this ) )
            .subscribe( ( value: ChatModel ) => {
                this.chat = value;
            } );

    }

    ngOnDestroy(): void {}

    goBack(): void {

        if ( this.chat.messages.length === 0 ) {
            this.us.deleteChat( this.chatId );

            this.user.chatIds.splice( this.user.chatIds.length - 1, 1 );
            this.user2.chatIds.splice( this.user2.chatIds.length - 1, 1 );

            this.us.updateUser( this.user );
            this.us.updateUser( this.user2 );

        }

        this.router.navigate( [ "dashboard", "chats" ] )
            .then( () => console.log( "Chatting has stopped!" ) );
    }

    async presentToast() {
        const toast = await this.toastController.create( {
                                                             message: "Your settings have been saved.",
                                                             duration: 2000
                                                         } );
        await toast.present();
    }
}
