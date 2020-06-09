import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { UserService } from "../../shared/user.service";
import { User } from "../../shared/user.model";
import { NgForm } from "@angular/forms";
import { MessagingService } from "../../messaging.service";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { storage } from "firebase";

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
    proPicUrl: string;

    slideOpts = {
        initialSlide: 1
    };

    constructor( private us: UserService, private ms: MessagingService, private camera: Camera, private ref: ChangeDetectorRef ) { }

    ngOnInit() {
        storage().ref( "ProfilePictures" ).child( "default-pro-pic.jpg" )
                 .getDownloadURL()
                 .then( value => {
                     this.proPicUrl = value.toString();
                 } )
                 .catch( error => {console.log( "Default Profile Picture not found!" );} );
    }

    signUp(): void {


        this.us.signUp( this.userEmail, this.userPassword,
                        new User( "", this.userName, this.userEmail, this.userPassword, this.phone, [] ) );
        this.form.resetForm();
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
}
