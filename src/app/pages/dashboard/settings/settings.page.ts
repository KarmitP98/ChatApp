import { Component, OnDestroy, OnInit } from "@angular/core";
import { UserService } from "../../../shared/user.service";
import { Subscription } from "rxjs";
import { User } from "../../../shared/user.model";
import { ModalController } from "@ionic/angular";
import { PrivacyComponent } from "./privacy/privacy.component";
import { ProfileComponent } from "./profile/profile.component";
import { AccountComponent } from "./account/account.component";

@Component( {
                selector: "app-profile",
                templateUrl: "./settings.page.html",
                styleUrls: [ "./settings.page.scss" ]
            } )
export class SettingsPage implements OnInit, OnDestroy {

    userSub: Subscription;
    user: User;

    constructor( private us: UserService, private modalController: ModalController ) { }

    ngOnInit() {
        this.userSub = this.us.userSubject.subscribe( value => this.user = value );
    }

    ngOnDestroy(): void {
        this.userSub.unsubscribe();
    }

    logOut(): void {
        this.us.logout();
    }

    async editPrivacy() {

        const modal = await this.modalController.create(
            {
                component: PrivacyComponent,
                swipeToClose: true
            } );
        await modal.present();
    }

    async editProfile() {

        const modal = await this.modalController.create(
            {
                component: ProfileComponent,
                swipeToClose: true
            } );
        await modal.present();
    }

    async editAccount() {

        const modal = await this.modalController.create(
            {
                component: AccountComponent,
                swipeToClose: true
            } );
        await modal.present();
    }
}
