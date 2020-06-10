import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { SettingsPage } from "./settings.page";
import { AuthService } from "../../../shared/auth.service";

const routes: Routes = [
    {
        path: "",
        component: SettingsPage, canActivate: [ AuthService ]
    }
];

@NgModule( {
               imports: [ RouterModule.forChild( routes ) ],
               exports: [ RouterModule ]
           } )
export class ProfilePageRoutingModule {}
