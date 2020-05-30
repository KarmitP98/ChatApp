import { Component, OnDestroy, OnInit } from "@angular/core";
import { UserService } from "../../../shared/user.service";
import { Subscription } from "rxjs";
import { User } from "../../../shared/user.model";

@Component( {
                selector: "app-profile",
                templateUrl: "./profile.page.html",
                styleUrls: [ "./profile.page.scss" ]
            } )
export class ProfilePage implements OnInit, OnDestroy {

    userSub: Subscription;
    user: User;

    constructor( private us: UserService ) { }

    ngOnInit() {
        this.userSub = this.us.userSubject.subscribe( value => this.user = value );
    }

    ngOnDestroy(): void {
        this.userSub.unsubscribe();
    }

    logOut(): void {
        this.us.logout();
    }
}
