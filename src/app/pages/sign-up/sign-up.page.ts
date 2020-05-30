import { Component, OnInit } from "@angular/core";
import { UserService } from "../../shared/user.service";
import { User } from "../../shared/user.model";

@Component( {
                selector: "app-sign-up",
                templateUrl: "./sign-up.page.html",
                styleUrls: [ "./sign-up.page.scss" ]
            } )
export class SignUpPage implements OnInit {
    userName: string;
    userPassword: string;
    userEmail: string;

    constructor( private us: UserService ) { }

    ngOnInit() {
    }

    signUp(): void {
        this.us.signUp( this.userEmail, this.userPassword, new User( "temp", this.userName, this.userEmail, this.userPassword ) );
    }
}
