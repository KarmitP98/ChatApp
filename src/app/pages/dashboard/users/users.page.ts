import { Component, OnDestroy, OnInit } from "@angular/core";
import { User } from "../../../shared/user.model";
import { Subscription } from "rxjs";
import { UserService } from "../../../shared/user.service";
import { ActionSheetController } from "@ionic/angular";
import { ChatModel } from "../../../shared/chat.model";
import { Router } from "@angular/router";
import { AngularFireDatabase } from "@angular/fire/database";

@Component( {
                selector: "app-users",
                templateUrl: "./users.page.html",
                styleUrls: [ "./users.page.scss" ]
            } )
export class UsersPage implements OnInit, OnDestroy {
    users: User[];
    user: User;

    userSub: Subscription;
    uss: Subscription;

    constructor( private us: UserService, private  actionSheetController: ActionSheetController, private router: Router, private store: AngularFireDatabase ) { }

    ngOnInit() {

        this.uss = this.us.userSubject.subscribe( u => {
            if ( u ) {
                this.user = u;
                this.userSub = this.us.fetchUsers().subscribe( value => {
                    if ( value ) {
                        this.users = value.filter( value1 => {return value1.userName !== u.userName;} );
                    }
                } );
            }
        } );

    }

    ngOnDestroy(): void {
        this.userSub.unsubscribe();
        this.uss.unsubscribe();
    }

    async presentActionSheet( user: User ) {
        const actionSheet = await this.actionSheetController.create(
            {
                header: user.userName,
                cssClass: "custom-action-white",
                buttons: [ {
                    text: "Start Chat",
                    icon: "chatbubble-ellipses",
                    handler: () => {
                        this.startChat( user );
                        console.log( "Chat Clicked" );
                    }
                }, {
                    text: "Call",
                    icon: "call",
                    handler: () => {
                        console.log( "Call clicked" );
                    }
                }, {
                    text: "Video Call",
                    icon: "videocam",
                    handler: () => {
                        console.log( "Video Call clicked" );
                    }
                }, {
                    text: "Share",
                    icon: "share-social",
                    handler: () => {
                        console.log( "Share clicked" );
                    }
                }, {
                    text: "Cancel",
                    icon: "close",
                    role: "cancel",
                    handler: () => {
                        console.log( "Cancel clicked" );
                    }
                } ]
            } );
        await actionSheet.present();
    }

    startChat( user2: User ) {
        let result: string[];
        if ( this.user.chatIds ) {
            if ( this.user.chatIds.length > 0 ) {
                result = this.user.chatIds.filter( value => user2.chatIds.some( value1 => value === value1 ) );
            }
        }

        if ( result ) {
            this.router.navigate( [ "/chat", result[0] ] );
        } else {
            const chatId = this.store.createPushId();
            console.log( chatId );
            let chat = new ChatModel( "temp", "", [] );
            this.us.addChat( chat );
            this.user.chatIds ? console.log( "Chat ids exists" ) : this.user.chatIds = [];
            this.user.chatIds.push( chatId );
            this.us.updateUser( this.user.userId, this.user );

            user2.chatIds ? console.log( "Chat ids exists" ) : user2.chatIds = [];
            this.us.updateUser( user2.userId, user2 );

            this.router.navigate( [ "/chat", chatId ] );
        }
    }
}
