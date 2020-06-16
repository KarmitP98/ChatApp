import { Component, OnDestroy, OnInit } from "@angular/core";
import { ChatModel } from "../../../shared/chat.model";
import { UserService } from "../../../shared/user.service";
import { User } from "../../../shared/user.model";
import { AngularFirestore } from "@angular/fire/firestore";
import { leftLoadTrigger, opacityTrigger, TEXT_STATUS } from "../../../shared/shared";
import { untilDestroyed } from "@orchestrator/ngx-until-destroyed";
import { Router } from "@angular/router";
import { MessagingService } from "../../../messaging.service";
import { BehaviorSubject } from "rxjs";
import { take } from "rxjs/operators";
import { ModalController, PopoverController } from "@ionic/angular";
import { ChatsOptions } from "./chat-options/chat-options.component";
import { ProfileDisplayComponent } from "../../profile-display/profile-display.component";
import { ThemeService } from "../../../theme.service";
import { FCM } from "@ionic-native/fcm/ngx";

@Component( {
                selector: "app-chats",
                templateUrl: "./chats.page.html",
                styleUrls: [ "./chats.page.scss" ],
                animations: [ leftLoadTrigger, opacityTrigger ]
            } )
export class ChatsPage implements OnInit, OnDestroy {
    user: User;
    chats: { lastMessage: string, otherUser: string, chatId: string, unread: number, otherAvatar: string }[] = [];
    users: string[] = [];
    message: BehaviorSubject<null>;
    theme: string = "sunny";

    constructor( private us: UserService,
                 private afs: AngularFirestore,
                 private router: Router,
                 private ms: MessagingService,
                 private popoverController: PopoverController,
                 private mc: ModalController,
                 public ts: ThemeService,
                 private fcm: FCM ) { }

    ngOnInit() {
        this.fetchUser()
            .then( () => this.fetchChats() );

        this.theme = this.ts.changeTheme();
        this.setBackgroundMessageListener();

    }

    async fetchUser() {
        this.us.userSubject.pipe( untilDestroyed( this ) ).subscribe( user => {
            if ( user ) {
                this.user = user;
            }
        } );

    }

    async fetchChats() {
        this.afs.collection( "chats", ref => ref.where( "between", "array-contains-any", [ this.user.userId ] ) )
            .valueChanges()
            .pipe( untilDestroyed( this ) )
            .subscribe( ( chats: ChatModel[] ) => {
                if ( chats.length > 0 && this.user ) {
                    this.chats = [];
                    this.chats = [];
                    chats.forEach( chat => {
                        const unread = chat.messages.filter(
                            message => message.status !== TEXT_STATUS.read && message.to === this.user.userId ).length;

                        const otherId = chat.between.filter( value2 => value2 !== this.user.userId )[0];

                        this.us.fetchUsers( "userId", otherId ).pipe( take( 1 ), untilDestroyed( this ) ).subscribe( usr => {
                            this.chats.push( {
                                                 lastMessage: chat.lastMessage,
                                                 otherUser: usr[0].userName,
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

    startChat( chat: { lastMessage: string; otherUser: string; chatId: string } ): void {
        this.router.navigate( [ "chat", chat.chatId ] )
            .then( () => console.log( this.user.userId + " and " + chat.otherUser + " resumed Chatting!" ) )
            .catch( () => console.log( "Chat cannot be opened!" ) );
    }

    delete( chat: { lastMessage: string; otherUser: string; chatId: string } ): void {

        console.log( "Chat delete!" );
    }

    async presentPopover( ev: any ) {
        const popover = await this.popoverController
                                  .create(
                                      {
                                          component: ChatsOptions,
                                          event: ev,
                                          backdropDismiss: true,
                                          translucent: true
                                      } );
        await popover.present();
    }

    async viewProfile( user ) {

        const modal = await this.mc.create(
            {
                component: ProfileDisplayComponent,
                swipeToClose: true,
                componentProps: { userName: user }
            } );
        await modal.present();
    }

    deleteChat( chatId: string ): void {
        // this.us.deleteChat(chatId);
    }


    changeTheme(): void {
        this.theme = this.ts.changeTheme();
    }


    private setBackgroundMessageListener(): void {
        this.fcm.onNotification()
            .subscribe( value => {
                if ( value.wasTapped ) {

                } else {
                    console.log( value );
                }
            } );
    }
}
