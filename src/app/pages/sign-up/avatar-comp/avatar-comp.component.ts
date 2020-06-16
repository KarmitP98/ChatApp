import { Component, Input, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";

@Component( {
                selector: "app-avatar-comp",
                templateUrl: "./avatar-comp.component.html",
                styleUrls: [ "./avatar-comp.component.scss" ]
            } )
export class AvatarComp implements OnInit {

    baseUrl: string = "/assets/Avatars/Av";
    ext: string = ".jpg";
    size: number;
    avatars: string[] = [];
    @Input() selectedAvatar: string;

    constructor( private modalCtrl: ModalController ) { }

    ngOnInit() {
        let i: number = 0;
        for ( i === 0; i < 9; i++ ) {
            this.avatars.push( this.baseUrl + (i + 1) + this.ext );
        }
    }

    select( item: string ): void {
        this.selectedAvatar = item;
    }

    dismiss(): void {
        this.modalCtrl.dismiss( {
                                    selected: this.selectedAvatar
                                } )
            .then( () => console.log( "Avatar has been selected!" ) )
            .catch( () => console.log( "Avatar cannot be selected!" ) );
    }

}
