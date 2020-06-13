import { Component, OnDestroy, OnInit } from "@angular/core";
import { UserService } from "../../../../shared/user.service";
import { AlertController, ModalController, ToastController } from "@ionic/angular";
import { User } from "../../../../shared/user.model";
import { AvatarComp } from "../../../sign-up/avatar-comp/avatar-comp.component";
import { untilDestroyed } from "@orchestrator/ngx-until-destroyed";
import { AngularFirestore } from "@angular/fire/firestore";
import { ChatModel } from "../../../../shared/chat.model";

@Component( {
                selector: "app-profile",
                templateUrl: "./profile.component.html",
                styleUrls: [ "./profile.component.scss" ]
            } )
export class ProfileComponent implements OnInit, OnDestroy {

    user: User;
    editName = false;
    editEmail = false;
    editPassword = false;
    editPhone = false;
    oldUserName: string;
    oldUserEmail: string;
    oldPhone: number;
    users: User[] = [];
    chats: ChatModel[] = [];
    userName: string;
    userEmail: string;
    phone: number;
    proPicUrl: string;

    constructor( private us: UserService,
                 private modalController: ModalController,
                 private tc: ToastController,
                 private afs: AngularFirestore,
                 private alertController: AlertController ) { }

    ngOnInit() {
        this.us.userSubject
            .pipe( untilDestroyed( this ) )
            .subscribe( value => {
                if ( value ) {
                    this.user = value;
                    this.oldUserName = this.userName = value.userName;
                    this.oldUserEmail = this.userEmail = value.userEmail;
                    this.oldPhone = this.phone = value.phone;
                    this.proPicUrl = this.user.proPicUrl;
                }
            } );
    }

    ngOnDestroy(): void {}

    async selectProfilePic() {
        const modal = await this.modalController.create(
            {
                component: AvatarComp,
                swipeToClose: true,
                componentProps: {
                    selectedAvatar: this.proPicUrl
                }
            } );
        await modal.present();

        const { data } = await modal.onWillDismiss();
        this.proPicUrl = data.selected;
    }

    dismiss(): void {

        if ( this.userName !== this.oldUserName ||
            this.userEmail !== this.oldUserEmail ||
            this.phone !== this.oldPhone ) {
            this.confirmExit()
                .then( () => console.log( "Use has been given the option to leave!" ) );
        } else {
            this.modalController.dismiss()
                .then( () => console.log( "User Profile Updated" ) );
        }
    }

    updateProfile(): void {
        this.user.userName = this.userName;
        this.user.userEmail = this.userEmail;
        this.user.phone = this.phone;
        this.user.proPicUrl = this.proPicUrl;

        this.us.updateUser( this.user );

        this.oldUserName = this.userName;
        this.oldUserEmail = this.userEmail;
        this.oldPhone = this.phone;

        this.showToast( "Profile has been updated" )
            .then( () => console.log( "Profile has been updated!" ) );
    }

    async showToast( text ) {
        const toast = await this.tc.create( {
                                                message: text,
                                                duration: 2000,
                                                position: "bottom",
                                                color: "light",
                                                animated: true
                                            } );
        await toast.present();
    }

    async confirmExit() {
        const alert = await this.alertController.create(
            {
                header: "Are you sure?",
                message: "Do you want to exit without saving changes?",
                buttons: [
                    {
                        text: "Yes",
                        handler: () => {
                            this.modalController.dismiss()
                                .then( () => console.log( "Change were not saved!" ) );
                        }
                    },
                    {
                        text: "No",
                        role: "cancel",
                        handler: () => {
                            console.log( "User want to save the changes!" );
                        }
                    }
                ]
            } );

        await alert.present();
    }

}
