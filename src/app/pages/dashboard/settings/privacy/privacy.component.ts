import { Component, OnDestroy, OnInit } from "@angular/core";
import { UserService } from "../../../../shared/user.service";
import { User } from "../../../../shared/user.model";
import { untilDestroyed } from "@orchestrator/ngx-until-destroyed";
import { ModalController } from "@ionic/angular";

@Component( {
                selector: "app-privacy",
                templateUrl: "./privacy.component.html",
                styleUrls: [ "./privacy.component.scss" ]
            } )
export class PrivacyComponent implements OnInit, OnDestroy {

    user: User;
    ghostMode: boolean = false;

    constructor( private us: UserService, private modalController: ModalController ) { }

    ngOnInit() {

        this.us.userSubject
            .pipe( untilDestroyed( this ) )
            .subscribe( value => {
                if ( value ) {
                    this.user = value;
                    this.ghostMode = this.user.ghostMode;
                }
            } );
    }

    ngOnDestroy(): void {}

    dismiss() {
        this.user.ghostMode = this.ghostMode;
        this.us.updateUser( this.user );
        this.modalController.dismiss()
            .then( () => console.log( "Privacy Settings Updated!" ) );
    }

}
