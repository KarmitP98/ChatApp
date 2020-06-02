import { Component, OnInit } from "@angular/core";
import { UserService } from "../../shared/user.service";
import { AngularFireAuth } from "@angular/fire/auth";

@Component( {
                selector: "app-login",
                templateUrl: "./login.page.html",
                styleUrls: [ "./login.page.scss" ]
            } )
export class LoginPage implements OnInit {
    email: string;
    password: string;

    constructor( private us: UserService, private auth: AngularFireAuth ) { }

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
    }


}
