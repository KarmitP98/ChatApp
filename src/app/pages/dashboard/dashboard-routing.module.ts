import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DashboardPage } from "./dashboard.page";
import { AuthService } from "../../shared/auth.service";

const routes: Routes = [
        {
            path: "", component: DashboardPage, canActivate: [ AuthService ], children: [

                {
                    path: "chats",
                    loadChildren: () => import("./chats/chats.module").then( m => m.ChatsPageModule )
                },
                {
                    path: "profile",
                    loadChildren: () => import("./profile/profile.module").then( m => m.ProfilePageModule )
                },
                {
                    path: "users",
                    loadChildren: () => import("./users/users.module").then( m => m.UsersPageModule )
                },
                {
                    path: "",
                    redirectTo: "/dashboard/chats",
                    pathMatch: "full"
                } ]
        },
        {
            path: "",
            redirectTo: "/dashboard/chats",
            pathMatch: "full"
        }
    ]
;

@NgModule( {
               imports: [ RouterModule.forChild( routes ) ],
               exports: [ RouterModule ]
           } )
export class UserPageRoutingModule {}
