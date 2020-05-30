import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    {
        path: "", redirectTo: "/login", pathMatch: "full"
    },
    {
        path: "login",
        loadChildren: () => import("./pages/login/login.module").then( m => m.LoginPageModule )
    },
    {
        path: "signUp",
        loadChildren: () => import("./pages/sign-up/sign-up.module").then( m => m.SignUpPageModule )
    },
    {
        path: "dashboard",
        loadChildren: () => import("./user/dashboard.module").then( m => m.DashboardModule )
    }
];

@NgModule( {
               imports: [
                   RouterModule.forRoot( routes, { preloadingStrategy: PreloadAllModules } )
               ],
               exports: [ RouterModule ]
           } )
export class AppRoutingModule {}
