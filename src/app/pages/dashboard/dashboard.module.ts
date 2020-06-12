import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { UserPageRoutingModule } from "./dashboard-routing.module";

import { DashboardPage } from "./dashboard.page";

@NgModule( {
               imports: [
                   CommonModule,
                   FormsModule,
                   IonicModule,
                   UserPageRoutingModule
               ],
               declarations: [ DashboardPage ]
           } )
export class DashboardModule {}