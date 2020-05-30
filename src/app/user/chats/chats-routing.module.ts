import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { ChatsPage } from "./chats.page";
import { AuthService } from "../../shared/auth.service";

const routes: Routes = [
  {
    path: "",
    component: ChatsPage, canActivate: [ AuthService ]
  }
];

@NgModule( {
             imports: [ RouterModule.forChild( routes ) ],
             exports: [ RouterModule ]
           } )
export class ChatsPageRoutingModule {}
