import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AngularFireModule } from "@angular/fire";
import { environment } from "../environments/environment";
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { AngularFirestore } from "@angular/fire/firestore";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MessagingService } from "./messaging.service";
import { AngularFireMessagingModule } from "@angular/fire/messaging";
import { ServiceWorkerModule } from "@angular/service-worker";

import { Camera } from "@ionic-native/camera/ngx";

@NgModule( {
               declarations: [ AppComponent ],
               entryComponents: [],
               imports: [ BrowserModule,
                          IonicModule.forRoot(),
                          AppRoutingModule,
                          AngularFireModule.initializeApp( environment.firebase ),
                          AngularFireDatabaseModule,
                          BrowserAnimationsModule,
                          AngularFireMessagingModule,
                          ServiceWorkerModule.register( "ngsw-worker.js", { enabled: environment.production } ) ],
               providers: [
                   StatusBar,
                   SplashScreen,
                   { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
                   AngularFirestore,
                   MessagingService,
                   Camera
               ],
               exports: [],
               bootstrap: [ AppComponent ]
           } )
export class AppModule {}
