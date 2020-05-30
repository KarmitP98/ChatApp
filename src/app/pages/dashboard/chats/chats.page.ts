import { Component, OnDestroy, OnInit } from "@angular/core";
import { ChatModel } from "../../../shared/chat.model";
import { UserService } from "../../../shared/user.service";
import { Subscription } from "rxjs";
import { User } from "../../../shared/user.model";

@Component( {
                selector: "app-chats",
                templateUrl: "./chats.page.html",
                styleUrls: [ "./chats.page.scss" ]
            } )
export class ChatsPage implements OnInit, OnDestroy {
    chats: ChatModel[] = [];
    user: User;

    userSub: Subscription;
    chatSub: Subscription;
    msgSub: Subscription;

    nums;

    constructor( private us: UserService ) { }

    ngOnInit() {

        // this.userSub = this.us.userSubject.subscribe( value => {
        //     if ( value ) {
        //         this.user = value;
        //         this.chatSub = this.us.fetchChats( "userName", value.userName ).subscribe( value1 => {
        //             if ( value1 ) {
        //                 this.chats = value1;
        //             }
        //         } );
        //     }
        // } );
        this.nums = Array.from( Array( 20 ).keys() );

    }

    ngOnDestroy(): void {
        // this.userSub.unsubscribe();
        // this.chatSub.unsubscribe();
    }

}
