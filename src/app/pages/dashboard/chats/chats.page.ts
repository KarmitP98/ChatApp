import { Component, OnDestroy, OnInit } from "@angular/core";
import { ChatModel } from "../../../shared/chat.model";
import { UserService } from "../../../shared/user.service";
import { User } from "../../../shared/user.model";
import { AngularFirestore } from "@angular/fire/firestore";
import { leftLoadTrigger, opacityTrigger, TEXT_STATUS } from "../../../shared/shared";
import { untilDestroyed } from "@orchestrator/ngx-until-destroyed";
import { Router } from "@angular/router";
import { TextModel } from "../../../shared/text.model";
import { MessagingService } from "../../../messaging.service";
import { BehaviorSubject } from "rxjs";
import { take } from "rxjs/operators";
import { PopoverController } from "@ionic/angular";
import { ChatsOptions } from "./chat-options/chat-options.component";

@Component( {
                selector: "app-chats",
                templateUrl: "./chats.page.html",
                styleUrls: [ "./chats.page.scss" ],
                animations: [ leftLoadTrigger, opacityTrigger ]
            } )
export class ChatsPage implements OnInit, OnDestroy {
    user: User;
    chats: { lastMessage: TextModel, otherUser: string, chatId: string, unread: number, otherAvatar: string }[] = [];
    users: string[] = [];
    message: BehaviorSubject<null>;

    constructor( private us: UserService, private afs: AngularFirestore, private router: Router, private ms: MessagingService, private popoverController: PopoverController ) { }

    ngOnInit() {
        this.fetchUser()
            .then( () => this.fetchChats() );
    }

    async fetchUser() {
        this.us.userSubject.pipe( untilDestroyed( this ) ).subscribe( user => {
            if ( user ) {
                this.user = user;
            }
        } );

    }

    async fetchChats() {
        this.afs.collection( "chats", ref => ref.where( "between", "array-contains-any", [ this.user.userName ] ) )
            .valueChanges()
            .subscribe( ( chats: ChatModel[] ) => {
                if ( chats.length > 0 && this.user ) {
                    this.chats = [];
                    chats.forEach( chat => {
                        const unread = chat.messages.filter(
                            message => message.status !== TEXT_STATUS.read && message.to === this.user.userName ).length;

                        const otherName = chat.between.filter( value2 => value2 !== this.user.userName )[0];

                        this.us.fetchUsers( "userName", otherName ).pipe( take( 1 ), untilDestroyed( this ) ).subscribe( usr => {
                            this.chats.push( {
                                                 lastMessage: chat.messages[chat.messages.length - 1],
                                                 otherUser: chat.between.filter( value2 => value2 !== this.user.userName )[0],
                                                 chatId: chat.chatId,
                                                 unread: unread,
                                                 otherAvatar: usr[0].proPicUrl
                                             } );
                        } );
                    } );
                } else {
                    this.chats = [];
                }
            } );
    }

    ngOnDestroy(): void {
    }

    startChat( chat: { lastMessage: TextModel; otherUser: string; chatId: string } ): void {
        this.router.navigate( [ "chat", chat.chatId ] )
            .then( () => console.log( this.user.userName + " and " + chat.otherUser + " resumed Chatting!" ) )
            .catch( () => console.log( "Chat cannot be opened!" ) );
    }

    delete( chat: { lastMessage: TextModel; otherUser: string; chatId: string } ): void {

        console.log( "Chat delete!" );
    }

    async presentPopover( ev: any ) {
        const popover = await this.popoverController.create( {
                                                                 component: ChatsOptions,
                                                                 event: ev,
                                                                 backdropDismiss: true,
                                                                 translucent: true
                                                             } );
        await popover.present();
    }
}
