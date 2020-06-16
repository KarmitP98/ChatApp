import { Inject, Injectable, Renderer2, RendererFactory2 } from "@angular/core";
import { DOCUMENT } from "@angular/common";

@Injectable( {
                 providedIn: "root"
             } )
export class ThemeService {

    renderer: Renderer2;
    theme: string = "moon";
    lightMode: boolean = false;

    constructor( private rf: RendererFactory2,
                 @Inject( DOCUMENT ) private document: Document ) {
        this.renderer = this.rf.createRenderer( null, null );
    }

    enableDark() {
        this.renderer.addClass( this.document.body, "dark-theme" );
    }

    enableIonic() {
    }

    enableLight() {
        this.renderer.removeClass( this.document.body, "dark-theme" );
    }

    changeTheme() {
        this.lightMode = !this.lightMode;
        if ( this.lightMode ) {
            this.enableLight();
            this.theme = "moon";
            return this.theme;
        } else {
            this.enableDark();
            this.theme = "sunny";
            return this.theme;
        }
    }
}
