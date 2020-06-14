import { Component, OnInit, ViewChild } from "@angular/core";
import { UserService } from "../../shared/user.service";
import { AngularFireAuth } from "@angular/fire/auth";
import { NgForm } from "@angular/forms";
import { MessagingService } from "../../messaging.service";

@Component( {
                selector: "app-login",
                templateUrl: "./login.page.html",
                styleUrls: [ "./login.page.scss" ]
            } )
export class LoginPage implements OnInit {
    email: string;
    password: string;
    @ViewChild( "f", { static: false } ) f: NgForm;
    messages: any;

    constructor( public us: UserService, private auth: AngularFireAuth, public ms: MessagingService ) { }

    ngOnInit() {
        this.auth.signOut()
            .then( () => {
                console.log( "Credentials cleared!" );
                localStorage.clear();
            } )
            .catch( () => console.log( "User could not be signed out!" ) );

    }

    login() {
        this.us.login( this.email, this.password );
        this.f.resetForm();
    }


}
