import { Component, OnDestroy, OnInit } from "@angular/core";
import { User } from "../../../shared/user.model";
import { Subscription } from "rxjs";
import { UserService } from "../../../shared/user.service";
import { ActionSheetController } from "@ionic/angular";

@Component( {
                selector: "app-users",
                templateUrl: "./users.page.html",
                styleUrls: [ "./users.page.scss" ]
            } )
export class UsersPage implements OnInit, OnDestroy {
    users: User[];

    userSub: Subscription;
    uss: Subscription;

    constructor( private us: UserService, private  actionSheetController: ActionSheetController ) { }

    ngOnInit() {

        this.uss = this.us.userSubject.subscribe( u => {
            if ( u ) {
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
                cssClass: "my-custom-class",
                buttons: [ {
                    text: "Start Chat",
                    icon: "chatbubble-ellipses",
                    handler: () => {
                        console.log( "Delete clicked" );
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
}
