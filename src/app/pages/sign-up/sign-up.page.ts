import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { UserService } from "../../shared/user.service";
import { User } from "../../shared/user.model";
import { NgForm } from "@angular/forms";
import { MessagingService } from "../../messaging.service";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { storage } from "firebase";
import { IonSlides, ModalController } from "@ionic/angular";
import { AvatarComp } from "./avatar-comp/avatar-comp.component";
import { Router } from "@angular/router";

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
    proPicUrl: string = "/assets/Avatars/Av1.jpg";
    @ViewChild( IonSlides ) slides: IonSlides;

    slideOpts = {
        initialSlide: 0
    };

    constructor( public us: UserService,
                 private ms: MessagingService,
                 private camera: Camera,
                 private ref: ChangeDetectorRef,
                 private modalController: ModalController,
                 private router: Router ) { }

    ngOnInit() {
    }

    signUp(): void {
        this.us.signUp( this.userEmail, this.userPassword,
                        new User( "", this.userName, this.userEmail, this.userPassword, this.phone, [], this.proPicUrl, true, false,
                                  false, "" ) );
        // this.form.resetForm();
    }

    async takePhoto() {
        try {
            // Defining camera options
            const options: CameraOptions = {
                quality: 50,
                targetHeight: 600,
                targetWidth: 600,
                destinationType: this.camera.DestinationType.FILE_URI,
                encodingType: this.camera.EncodingType.JPEG,
                mediaType: this.camera.MediaType.PICTURE,
                correctOrientation: true

            };
            const result = await this.camera.getPicture( options );
            const image = "data:image/jpeg;base64," + result;

            const pictures = storage().ref( "ProfilePictures/" + this.userName + "-pro-pic" );
            pictures.putString( image, "data_url" );
            this.ref.detectChanges();

        } catch ( e ) {
            console.error( e );
        }
    }

    async presentModal() {
        const modal = await this.modalController.create(
            {
                component: AvatarComp,
                swipeToClose: true,
                componentProps: [ {
                    selectedAvatar: this.proPicUrl
                } ]
            } );
        await modal.present();

        const { data } = await modal.onWillDismiss();
        this.proPicUrl = data.selected;
    }

    backToLogin(): void {
        this.userName = null;
        this.userEmail = null;
        this.userPassword = null;
        this.router.navigate( [ "/login" ] )
            .then( () => console.log( "Back to login!" ) );
    }

    goToPage( page ) {
        this.slides.slideTo( page )
            .then( () => console.log( "Slide to page " + page ) );
    }
}
