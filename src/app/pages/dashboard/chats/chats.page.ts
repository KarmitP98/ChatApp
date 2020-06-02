import { Component, OnDestroy, OnInit } from "@angular/core";
import { ChatModel } from "../../../shared/chat.model";
import { UserService } from "../../../shared/user.service";
import { User } from "../../../shared/user.model";
import { AngularFirestore } from "@angular/fire/firestore";
import { leftLoadTrigger, opacityTrigger } from "../../../shared/shared";
import { untilDestroyed } from "@orchestrator/ngx-until-destroyed";

@Component( {
                selector: "app-chats",
                templateUrl: "./chats.page.html",
                styleUrls: [ "./chats.page.scss" ],
                animations: [ leftLoadTrigger, opacityTrigger ]
            } )
export class ChatsPage implements OnInit, OnDestroy {
    user: User;
    chats: { lastMessage: string, otherUser: string, chatId: string }[] = [];


    nums;

    constructor( private us: UserService, private afs: AngularFirestore ) { }

    ngOnInit() {

        this.us.userSubject.pipe( untilDestroyed( this ) ).subscribe( user => {
            if ( user ) {
                this.user = user;

                this.afs.collection( "chats", ref => ref.where( "between", "array-contains-any", [ this.user.userEmail ] ) )
                    .valueChanges()
                    .subscribe( ( value: ChatModel[] ) => {
                        if ( value.length > 0 ) {
                            this.chats = [];
                            value.forEach( value1 => {
                                this.chats.push( {
                                                     lastMessage: value1.lastMessage,
                                                     otherUser: value1.between.filter( value2 => value2 !== this.user.userEmail )[0],
                                                     chatId: value1.chatId
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

}
