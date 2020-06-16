import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { AvatarCompComponent } from "./avatar-comp.component";

describe( "AvatarCompComponent", () => {
    let component: AvatarCompComponent;
    let fixture: ComponentFixture<AvatarCompComponent>;

    beforeEach( async( () => {
        TestBed.configureTestingModule( {
                                            declarations: [ AvatarCompComponent ],
                                            imports: [ IonicModule.forRoot() ]
                                        } ).compileComponents();

        fixture = TestBed.createComponent( AvatarCompComponent );
        component = fixture.componentInstance;
        fixture.detectChanges();
    } ) );

    it( "should create", () => {
        expect( component ).toBeTruthy();
    } );
} );
