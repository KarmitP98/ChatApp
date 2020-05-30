import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { UsersPage } from "./users.page";
import { AuthService } from "../../shared/auth.service";

const routes: Routes = [
  {
    path: "",
    component: UsersPage,
    canActivate: [ AuthService ]
  }
];

@NgModule( {
             imports: [ RouterModule.forChild( routes ) ],
             exports: [ RouterModule ]
           } )
export class UsersPageRoutingModule {}
