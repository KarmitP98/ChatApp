import { Component, OnInit } from "@angular/core";
import { UserService } from "../../shared/user.service";

@Component( {
                selector: "app-login",
                templateUrl: "./login.page.html",
                styleUrls: [ "./login.page.scss" ]
            } )
export class LoginPage implements OnInit {
    email: string;
    password: string;

    constructor( private us: UserService ) { }

    ngOnInit() {
        this.us.fetchUsers().subscribe( value => console.log( value ) );
    }

    addUser() {
        this.us.login( this.email, this.password );
    }


}
