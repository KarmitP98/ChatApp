import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { User } from "../../shared/user.model";
import { UserService } from "../../shared/user.service";
import { ActivatedRoute, Router } from "@angular/router";
import { IonContent, ModalController } from "@ionic/angular";
import { ChatModel } from "../../shared/chat.model";
import { untilDestroyed } from "@orchestrator/ngx-until-destroyed";
import { TextModel } from "../../shared/text.model";
import { TEXT_STATUS } from "../../shared/shared";
import { MessagingService } from "../../messaging.service";
import { AngularFireMessaging } from "@angular/fire/messaging";
import { ProfileDisplayComponent } from "../profile-display/profile-display.component";

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

    constructor( private router: Router,
                 private us: UserService,
                 private route: ActivatedRoute,
                 private ms: MessagingService,
                 private afm: AngularFireMessaging,
                 private mc: ModalController ) { }

    ngOnInit() {

        this.us.userSubject
            .pipe( untilDestroyed( this ) )
            .subscribe( value => {
                this.user = value;
            } );

        this.chatId = this.route.snapshot.params["id"];
        const userIds = this.chatId.split( "-" );
        const userId2 = userIds.filter( value => value !== this.user.userId )[0];

        this.us.fetchUsers( "userId", userId2 )
            .pipe( untilDestroyed( this ) )
            .subscribe( value => {
                this.user2 = value[0];
            } );

        this.us.fetchChats( "chatId", this.chatId )
            .pipe( untilDestroyed( this ) )
            .subscribe( ( value ) => {
                if ( value.length > 0 && this.user ) {
                    this.chat = value[0];
                    this.messages = this.chat.messages;
                    for ( let message of this.chat.messages ) {
                        if ( message.to === this.user.userId ) {
                            message.status = TEXT_STATUS.read;
                        }
                    }
                    // console.log( this.chat );
                    this.us.updateChat( this.chat );
                }
            } );

        setTimeout( () => {this.content.scrollToBottom( 500 );}, 500 );

        this.checkMessages();

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
                textId: this.user.userName + "->" + this.user2.userName,        // Can be used as a replacement for 'to' and 'for' in
                // notifications
                content: this.text,
                to: this.user2.userId,
                from: this.user.userId,
                status: TEXT_STATUS.sent,
                timeStamp: new Date()
            };

            this.chat.messages.push( text );
            this.chat.lastMessage = this.user.userName + ": " + this.text;
            this.us.updateChat( this.chat );
            this.text = "";

            this.ms.sendMessage( this.user, this.user2, text )
                .pipe( untilDestroyed( this ) )
                .subscribe( mId => {
                } );

            setTimeout( () => {this.content.scrollToBottom( 100 );}, 100 );
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

    async viewProfile() {

        const modal = await this.mc.create(
            {
                component: ProfileDisplayComponent,
                swipeToClose: true,
                componentProps: { user: this.user2 }
            } );
        await modal.present();
    }

    private checkMessages(): void {
        this.afm.messages
            .subscribe( message => {
                console.log( "Message Received!" );
                console.log( message );
            } );
    }
}
