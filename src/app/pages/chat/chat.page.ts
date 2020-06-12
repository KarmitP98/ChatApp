import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { User } from "../../shared/user.model";
import { UserService } from "../../shared/user.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AngularFireDatabase } from "@angular/fire/database";
import { IonContent, ToastController } from "@ionic/angular";
import { ChatModel } from "../../shared/chat.model";
import { untilDestroyed } from "@orchestrator/ngx-until-destroyed";
import { TextModel } from "../../shared/text.model";
import { TEXT_STATUS } from "../../shared/shared";

@Component( {
                selector: "app-chat",
                templateUrl: "./chat.page.html",
                styleUrls: [ "./chat.page.scss" ]
            } )
export class ChatPage implements OnInit, OnDestroy {

    user: User;
    user2: User;
    chatId: string;
    text: string;
    chat: ChatModel;
    messages: TextModel[] = [];
    @ViewChild( "content" ) content: IonContent;
    bottom: any;

    constructor( private router: Router, private us: UserService, private route: ActivatedRoute, private store: AngularFireDatabase,
                 private toastController: ToastController ) { }

    ngOnInit() {

        this.us.userSubject
            .pipe( untilDestroyed( this ) )
            .subscribe( value => {
                this.user = value;
                console.log( "User 1: " );
                console.log( this.user );
            } );

        this.chatId = this.route.snapshot.params["id"];
        const userIds = this.chatId.split( "-" );
        const userId2 = userIds.filter( value => value !== this.user.userId )[0];

        this.us.fetchUsers( "userId", userId2 )
            .pipe( untilDestroyed( this ) )
            .subscribe( value => {
                this.user2 = value[0];
                console.log( "User 2:" );
                console.log( this.user2 );
            } );

        this.us.fetchChats( "chatId", this.chatId )
            .pipe( untilDestroyed( this ) )
            .subscribe( ( value ) => {
                if ( value.length > 0 && this.user && this.user2 ) {
                    this.chat = value[0];
                    this.messages = this.chat.messages;
                    for ( let message of this.chat.messages ) {
                        if ( message.to === this.user.userId ) {
                            message.status = TEXT_STATUS.read;
                        }
                    }
                    this.us.updateChat( this.chat );
                }
            } );

        setTimeout( () => {this.content.scrollToBottom( 500 );}, 500 );

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

    sentText(): void {
        if ( this.text.length > 0 ) {
            const text: TextModel = {
                chatId: this.chatId,
                textId: "Random",
                content: this.text,
                to: this.user2.userId,
                from: this.user.userId,
                status: TEXT_STATUS.sent,
                timeStamp: new Date()
            };

            console.log( text );

            this.chat.messages.push( text );
            this.chat.lastMessage = this.text;
            this.us.updateChat( this.chat );
            this.text = "";
            this.content.scrollToBottom();
        }
    }

    scrolled( $event: any ): void {
        console.log( "Scrolled!" );
        console.log( $event );
    }

    scrollToBottom(): void {
        this.content.scrollToBottom()
            .then( () => console.log( "Messages have been loaded!" ) );
    }
}
