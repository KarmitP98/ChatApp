import { Component, OnDestroy, OnInit } from "@angular/core";
import { User } from "../../../shared/user.model";
import { Subscription } from "rxjs";
import { UserService } from "../../../shared/user.service";
import { ActionSheetController } from "@ionic/angular";
import { AngularFirestore } from "@angular/fire/firestore";
import { untilDestroyed } from "@orchestrator/ngx-until-destroyed";
import { leftLoadTrigger, opacityTrigger } from "../../../shared/shared";
import { ChatModel } from "../../../shared/chat.model";
import { Router } from "@angular/router";

@Component( {
                selector: "app-users",
                templateUrl: "./users.page.html",
                styleUrls: [ "./users.page.scss" ],
                animations: [ leftLoadTrigger, opacityTrigger ]
            } )
export class UsersPage implements OnInit, OnDestroy {
    users: User[] = [];
    user: User;

    userSub: Subscription;
    uss: Subscription;

    constructor( private us: UserService, private  actionSheetController: ActionSheetController, private afs: AngularFirestore, private router: Router ) { }

    ngOnInit() {

        this.us.userSubject.pipe( untilDestroyed( this ) ).subscribe( u => {
            if ( u ) {
                this.user = u;
                this.us.fetchUsers()
                    .pipe( untilDestroyed( this ) )
                    .subscribe( ( value: User[] ) => {
                        if ( value.length > 0 ) {
                            this.users = value.filter( value1 => {return value1.userId !== u.userId;} );
                        } else {
                            console.log( "No user found! | Length: " + this.users.length );
                        }
                    } );
            }
        } );

    }

    ngOnDestroy(): void {
    }

    async presentActionSheet( user: User ) {
        const actionSheet = await this.actionSheetController.create(
            {
                header: user.userName,
                cssClass: "users-action-sheet-class",
                buttons: [ {
                    text: "Start Chat",
                    icon: "chatbubble-ellipses",
                    cssClass: "users-action-item",
                    handler: () => {
                        this.startChat( user );
                    }
                }, {
                    text: "Cancel",
                    icon: "close",
                    role: "cancel",
                    cssClass: "users-action-item",
                    handler: () => {
                        console.log( "Cancel clicked" );
                    }
                } ]
            } );
        await actionSheet.present();
    }

    startChat( other: User ) {
        console.log( "Chat pressed!" );

        const hasChatted = this.user.chatIds.some( value => value.with === other.userId );
        if ( hasChatted ) {
            for ( let id of this.user.chatIds ) {
                if ( id.with === other.userId ) {
                    console.log( id.chatId );
                    this.router.navigate( [ "chat", id.chatId ] )
                        .then( () => console.log( this.user.userName + " continued chatting with " + other.userName ) );
                }
            }
        } else {
            const chat: ChatModel = {
                chatId: this.user.userId + "-" + other.userId,
                between: [ this.user.userId, other.userId ],
                lastMessage: "",
                messages: []
            };
            this.us.createNewChat( chat );

            this.user.chatIds.push( { chatId: chat.chatId, with: other.userId } );
            other.chatIds.push( { chatId: chat.chatId, with: this.user.userId } );

            this.us.updateUser( this.user );
            this.us.updateUser( other );

            this.router.navigate( [ "chat", chat.chatId ] )
                .then( () => console.log( this.user.userName + " started chatting with " + other.userName ) );
        }
    }
}
