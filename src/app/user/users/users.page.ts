import { Component, OnDestroy, OnInit } from "@angular/core";
import { User } from "../../shared/user.model";
import { Subscription } from "rxjs";
import { UserService } from "../../shared/user.service";

@Component( {
                selector: "app-users",
                templateUrl: "./users.page.html",
                styleUrls: [ "./users.page.scss" ]
            } )
export class UsersPage implements OnInit, OnDestroy {
    users: User[];

    userSub: Subscription;

    constructor( private us: UserService ) { }

    ngOnInit() {
        this.userSub = this.us.fetchUsers().subscribe( value => {
            this.users = value;
        } );
    }

    ngOnDestroy(): void {
        this.userSub.unsubscribe();
    }
}
