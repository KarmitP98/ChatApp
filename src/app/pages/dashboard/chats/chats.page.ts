import { Component, OnDestroy, OnInit } from "@angular/core";
import { ChatModel } from "../../../shared/chat.model";
import { UserService } from "../../../shared/user.service";
import { User } from "../../../shared/user.model";
import { AngularFirestore } from "@angular/fire/firestore";
import { leftLoadTrigger, opacityTrigger, TEXT_STATUS } from "../../../shared/shared";
import { untilDestroyed } from "@orchestrator/ngx-until-destroyed";
import { Router } from "@angular/router";
import { TextModel } from "../../../shared/text.model";

@Component( {
                selector: "app-chats",
                templateUrl: "./chats.page.html",
                styleUrls: [ "./chats.page.scss" ],
                animations: [ leftLoadTrigger, opacityTrigger ]
            } )
export class ChatsPage implements OnInit, OnDestroy {
    user: User;
    chats: { lastMessage: TextModel, otherUser: string, chatId: string, unread: number }[] = [];


    nums;

    constructor( private us: UserService, private afs: AngularFirestore, private router: Router ) { }

    ngOnInit() {

        this.us.userSubject.pipe( untilDestroyed( this ) ).subscribe( user => {
            if ( user ) {
                this.user = user;

                this.afs.collection( "chats", ref => ref.where( "between", "array-contains-any", [ this.user.userName ] ) )
                    .valueChanges()
                    .subscribe( ( value: ChatModel[] ) => {
                        if ( value.length > 0 ) {
                            this.chats = [];
                            value.forEach( value1 => {
                                const unread = value1.messages.filter(
                                    message => message.status !== TEXT_STATUS.read && message.to === this.user.userName ).length;
                                this.chats.push( {
                                                     lastMessage: value1.messages[value1.messages.length - 1],
                                                     otherUser: value1.between.filter( value2 => value2 !== this.user.userName )[0],
                                                     chatId: value1.chatId,
                                                     unread: unread
                                                 } );
                            } );
                        } else {
                            this.chats = [];
                        }
                    } );
            }
        } );
        this.nums = Array.from( Array( 20 ).keys() );

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
}
