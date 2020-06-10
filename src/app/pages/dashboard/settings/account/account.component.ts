import { Component, OnDestroy, OnInit } from "@angular/core";
import { untilDestroyed } from "@orchestrator/ngx-until-destroyed";
import { UserService } from "../../../../shared/user.service";
import { ModalController } from "@ionic/angular";
import { User } from "../../../../shared/user.model";

@Component( {
                selector: "app-account",
                templateUrl: "./account.component.html",
                styleUrls: [ "./account.component.scss" ]
            } )
export class AccountComponent implements OnInit, OnDestroy {

    user: User;
    accountType: boolean = false;

    constructor( private us: UserService, private modalController: ModalController ) { }

    ngOnInit() {
        this.us.userSubject
            .pipe( untilDestroyed( this ) )
            .subscribe( value => {
                if ( value ) {
                    this.user = value;
                    this.accountType = this.user.accountType;
                }
            } );
    }

    ngOnDestroy(): void {}

    dismiss() {
        this.user.accountType = this.accountType;
        this.us.updateUser( this.user );
        this.modalController.dismiss()
            .then( () => console.log( "Account Settings Updated!" ) );
    }
}
