import { Component, OnInit } from "@angular/core";
import { UserService } from "../../../../shared/user.service";
import { PopoverController } from "@ionic/angular";

@Component( {
                selector: "app-chats-options",
                templateUrl: "./chat-options.component.html",
                styleUrls: [ "./chat-options.component.scss" ]
            } )
export class ChatsOptions implements OnInit {

    constructor( public us: UserService, public popoverController: PopoverController ) { }

    ngOnInit() {}

    dismiss() {
        this.popoverController.dismiss()
            .then( () => this.us.logout() );
    }
}
