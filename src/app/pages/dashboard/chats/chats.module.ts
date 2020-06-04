import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ChatsPageRoutingModule } from "./chats-routing.module";

import { ChatsPage } from "./chats.page";
import { ShortenPipe } from "../../../shared/shorten.pipe";

@NgModule( {
               imports: [
                   CommonModule,
                   FormsModule,
                   IonicModule,
                   ChatsPageRoutingModule
               ],
               declarations: [ ChatsPage,
                               ShortenPipe ]
           } )
export class ChatsPageModule {}
