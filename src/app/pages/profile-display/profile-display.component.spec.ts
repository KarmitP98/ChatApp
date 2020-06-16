import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { ProfileDisplayComponent } from "./profile-display.component";

describe( "ProfileDisplayComponent", () => {
  let component: ProfileDisplayComponent;
  let fixture: ComponentFixture<ProfileDisplayComponent>;

  beforeEach( async( () => {
    TestBed.configureTestingModule( {
                                      declarations: [ ProfileDisplayComponent ],
                                      imports: [ IonicModule.forRoot() ]
                                    } ).compileComponents();

    fixture = TestBed.createComponent( ProfileDisplayComponent );
    component = fixture.componentInstance;
    fixture.detectChanges();
  } ) );

  it( "should create", () => {
    expect( component ).toBeTruthy();
  } );
} );
