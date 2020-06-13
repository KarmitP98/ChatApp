import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { UserService } from "./user.service";

@Injectable( {
                 providedIn: "root"
             } )
export class AuthService implements CanActivate {

    constructor( private router: Router, private us: UserService ) { }

    canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if ( this.us.userSubject.getValue() ) {
            return true;
        } else {
            // const email = JSON.parse( localStorage.getItem( "userData" ) );
            // if ( email ) {
            //     this.us.autoLogin( email );
            //     return true;
            // } else {
            return this.router.navigate( [ "/login" ] );
            // }
        }
    }

}
