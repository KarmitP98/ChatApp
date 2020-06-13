import { Component, OnDestroy, OnInit } from "@angular/core";
import { untilDestroyed } from "@orchestrator/ngx-until-destroyed";
import { UserService } from "../../../../shared/user.service";
import { ModalController } from "@ionic/angular";
import { User } from "../../../../shared/user.model";
import { MessagingService } from "../../../../messaging.service";

@Component( {
                selector: "app-account",
                templateUrl: "./account.component.html",
                styleUrls: [ "./account.component.scss" ]
            } )
export class AccountComponent implements OnInit, OnDestroy {

    user: User;
    accountType: boolean = false;
    notify: boolean = false;

    constructor( private us: UserService, private modalController: ModalController, private ms: MessagingService ) { }

    ngOnInit() {
        this.us.userSubject
            .pipe( untilDestroyed( this ) )
            .subscribe( value => {
                if ( value ) {
                    this.user = value;
                    this.accountType = this.user.accountType;
                    if ( value.notify ) {
                        this.notify = value.notify;
                    }
                }
            } );
    }

    ngOnDestroy(): void {}

    dismiss() {
        this.user.accountType = this.accountType;
        this.user.notify = this.notify;
        this.us.updateUser( this.user );
        this.modalController.dismiss()
            .then( () => console.log( "Account Settings Updated!" ) );
    }

    requestPermission() {
        if ( !this.notify ) {
            this.ms.getPermission();
        } else {
            this.ms.revokePermission();
        }
    }
}
