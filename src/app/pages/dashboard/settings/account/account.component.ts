import { Component, OnDestroy, OnInit } from "@angular/core";
import { untilDestroyed } from "@orchestrator/ngx-until-destroyed";
import { UserService } from "../../../../shared/user.service";
import { ModalController } from "@ionic/angular";
import { User } from "../../../../shared/user.model";
import { MessagingService } from "../../../../messaging.service";
import { AngularFireMessaging } from "@angular/fire/messaging";

@Component( {
                selector: "app-account",
                templateUrl: "./account.component.html",
                styleUrls: [ "./account.component.scss" ]
            } )
export class AccountComponent implements OnInit, OnDestroy {

    user: User;
    accountType: boolean;
    notify: boolean;

    constructor( private us: UserService, private modalController: ModalController, private ms: MessagingService, private afm: AngularFireMessaging ) { }

    ngOnInit() {
        this.us.userSubject
            .pipe( untilDestroyed( this ) )
            .subscribe( value => {
                if ( value ) {
                    this.user = value;
                    this.accountType = value.accountType;
                    this.notify = value.notify;
                }
            } );
    }

    ngOnDestroy(): void {}

    /**
     * Save changes and exit
     */
    dismiss() {
        console.log( this.user );
        this.us.updateUser( this.user );
        this.modalController.dismiss()
            .then( () => console.log( "Account Settings Updated!" ) );
    }

    /**
     * Change @account_type of the current user
     */
    changeAccountType() {
        this.user.accountType = this.accountType;
        console.log( this.user );
    }

    /**
     * Request or revoke permission based on the current value of @var notify
     */
    requestPermission() {
        if ( !this.notify ) {
            this.ms.getPermission()
                .pipe( untilDestroyed( this ) )
                .subscribe( token => {
                    this.user.notiToken = token;
                    this.user.notify = true;
                } );
        } else {
            this.ms.revokePermission()
                .pipe( untilDestroyed( this ) )
                .subscribe( token => {
                    this.afm.deleteToken( token );
                    this.user.notiToken = "";
                    this.user.notify = false;
                } );
        }
        console.log( this.user );
    }
}
