import { Component, OnInit, ViewChild } from "@angular/core";
import { UserService } from "../../shared/user.service";
import { User } from "../../shared/user.model";
import { NgForm } from "@angular/forms";

@Component( {
                selector: "app-sign-up",
                templateUrl: "./sign-up.page.html",
                styleUrls: [ "./sign-up.page.scss" ]
            } )
export class SignUpPage implements OnInit {
    userName: string;
    userPassword: string;
    userEmail: string;
    @ViewChild( "f", { static: false } ) form: NgForm;
    phone: number;

    constructor( private us: UserService ) { }

    ngOnInit() {
    }

    signUp(): void {
        this.us.signUp( this.userEmail, this.userPassword,
                        new User( "", this.userName, this.userEmail, this.userPassword, this.phone, [] ) );
        this.form.resetForm();
    }
}
