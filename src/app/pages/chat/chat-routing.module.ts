import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { ChatPage } from "./chat.page";
import { AuthService } from "../../shared/auth.service";

const routes: Routes = [
    {
        path: "",
        component: ChatPage,
        canActivate: [ AuthService ]
    }
];

@NgModule( {
               imports: [ RouterModule.forChild( routes ) ],
               exports: [ RouterModule ]
           } )
export class ChatPageRoutingModule {}
