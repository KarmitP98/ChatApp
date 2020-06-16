import { Component, Input, OnInit } from "@angular/core";
import { User } from "../../shared/user.model";
import { ModalController } from "@ionic/angular";
import { UserService } from "../../shared/user.service";

@Component( {
                selector: "app-profile-display",
                templateUrl: "./profile-display.component.html",
                styleUrls: [ "./profile-display.component.scss" ]
            } )
export class ProfileDisplayComponent implements OnInit {

    @Input() user: User;
    @Input() userName: string;

    constructor( private mc: ModalController,
                 private us: UserService ) { }

    ngOnInit() {
        if ( this.userName ) {
            this.us.fetchUsers( "userName", this.userName )
                .subscribe( user => {
                    if ( user ) {
                        this.user = user[0];
                    }
                } );
        }
    }

    dismiss(): void {
        this.mc.dismiss()
            .then( () => console.log( "User Profile Display closed!" ) );
    }
}
