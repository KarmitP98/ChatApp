import { Inject, Injectable, Renderer2, RendererFactory2 } from "@angular/core";
import { DOCUMENT } from "@angular/common";

@Injectable( {
                 providedIn: "root"
             } )
export class ThemeService {

    renderer: Renderer2;

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

}
