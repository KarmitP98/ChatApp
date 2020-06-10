import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ProfilePageRoutingModule } from "./settings-routing.module";

import { SettingsPage } from "./settings.page";
import { PrivacyComponent } from "./privacy/privacy.component";
import { AccountComponent } from "./account/account.component";
import { ProfileComponent } from "./profile/profile.component";

@NgModule( {
               imports: [
                   CommonModule,
                   FormsModule,
                   IonicModule,
                   ProfilePageRoutingModule
               ],
               declarations: [ SettingsPage,
                               PrivacyComponent,
                               AccountComponent,
                               ProfileComponent ]
           } )
export class SettingsModule {}
