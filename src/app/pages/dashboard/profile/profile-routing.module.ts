import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { ProfilePage } from "./profile.page";
import { AuthService } from "../../../shared/auth.service";

const routes: Routes = [
    {
        path: "",
        component: ProfilePage, canActivate: [ AuthService ]
    }
];

@NgModule( {
               imports: [ RouterModule.forChild( routes ) ],
               exports: [ RouterModule ]
           } )
export class ProfilePageRoutingModule {}
