import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import { User } from "./user.model";
import { ChatModel } from "./chat.model";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { AngularFireAuth } from "@angular/fire/auth";
import { ToastController } from "@ionic/angular";
import { AngularFirestore } from "@angular/fire/firestore";
import { TextModel } from "./text.model";

export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

export class UserModel {

    constructor( public email: string,
                 public id: string,
                 private _token: string,
                 private _tokenExpirationDate: Date ) {}

    get token(): string {
        if ( !this._tokenExpirationDate || new Date() > this._tokenExpirationDate ) {
            return null;
        }
        return this._token;
    }
}

export class Toast {

    private tc = new ToastController();

    constructor(
        public text: string,
        public milliseconds: number = 2000 ) {
    }

    async show() {
        const toast = await this.tc
                                .create( {
                                             message: this.text,
                                             duration: this.milliseconds
                                         } );
        await toast.present();
    }

}

@Injectable( {
                 providedIn: "root"
             } )
export class UserService {

    userSubject = new BehaviorSubject<User>( null );
    userRef = this.afs.collection<User>( "users" );
    chatRef = this.afs.collection<ChatModel>( "chats" );
    private tokenExpirationTimer: any;

    constructor( private store: AngularFireDatabase,
                 private router: Router,
                 private auth: AngularFireAuth,
                 private afs: AngularFirestore,
                 private toastController: ToastController,
                 private fireAuth: AngularFireAuth ) { }


    login( email: string, password: string ) {
        this.fireAuth.signInWithEmailAndPassword( email, password )
            .then( () => {
                let sub = this.fetchUsers( "userEmail", email ).subscribe( ( value: User[] ) => {
                    this.userSubject.next( value[0] );
                    localStorage.setItem( "userData", JSON.stringify( value[0].userId ) );
                    this.router.navigate( [ "/dashboard" ] )
                        .then( () => console.log( value[0].userName + " has logged in!" ) );
                    sub.unsubscribe();
                } );
            } ).catch( () => new Toast( "Invalid user credentials!", 2000 ).show() );
    }

    signUp( email: string, password: string, user: User ) {
        this.fireAuth
            .createUserWithEmailAndPassword( email, password )
            .catch( function( error ) {
                console.log( "User could not be added!" );
            } )
            .then( () => this.addNewUser( user ) );
    }

    logout(): void {
        this.fireAuth.signOut().then( value => {
            this.userSubject.next( null );  // Clear current subject
            localStorage.removeItem( "userData" );  // Clear local storage
            this.router.navigate( [ "/login" ] ).then( () => console.log( "User has been logged out!" ) );
        } ).catch();

    }

    autoLogout( expirationDuration: number ) {
        this.tokenExpirationTimer = setTimeout( () => {
            this.logout();
        }, expirationDuration );
    }

    autoLogin( email: string ): void {
        let sub = this.fetchUsers( "userEmail", email ).subscribe( value => {
            this.userSubject.next( value[0] );
            sub.unsubscribe();
        } );

    }

    fetchUsers( child?: string, value?: string | number | Date ) {
        if ( child ) {
            return this.afs.collection<User>( "users", ref => ref.where( child, "==", value ) ).valueChanges();
        }
        return this.userRef.valueChanges();
    }

    addNewUser( user: User ) {
        user.userId = this.afs.createId();
        this.afs.collection( "users" )
            .doc( user.userId )
            .set( { ...user } )
            .then( () => {
                console.log( "User has been added" );
                this.userSubject.next( user );
                localStorage.setItem( "userData", JSON.stringify( user.userId ) );
                this.router.navigate( [ "/dashboard" ] ).then( () => console.log( "New User has signed up!" ) );
            } )
            .catch(
                function( error ) {
                    console.log( "User cannot be added! " );
                    console.log( error.text + error.id );
                } );
    }

    updateUser( user: User ) {
        this.userRef
            .doc( user.userId )
            .update( user )
            .then( () => {
                console.log( user.userName + " has been updated!" );
                if ( JSON.parse( localStorage.getItem( "userData" ) ) === user.userId ) {
                    this.userSubject.next( user );
                }
            } );
    }


    fetchChats( child?: string, value?: string | number | Date ) {
        if ( child ) {
            return this.afs.collection<ChatModel>( "chats", ref => ref.where( child, "==", value ) ).valueChanges();
        }
        return this.afs.collection<ChatModel>( "chats" ).valueChanges();
    }

    createNewChat( chatModel: ChatModel ) {
        const chatId = chatModel.chatId;
        this.afs.collection<ChatModel>( "chats" )
            .doc( chatId )
            .set( { ...chatModel } )
            .then( () => console.log( "New Chat with Id: " + chatId + " has been created!" ) )
            .catch( ( error ) => console.log( "This chat could not be created!" + error.message ) );
    }

    updateChat( chat: ChatModel ) {
        this.afs.collection<ChatModel>( "chats" )
            .doc( chat.chatId )
            .update( chat )
            .then( () => "Chat has been updated!" )
            .catch( () => "Chat was not updated!" );
    }

    deleteChat( chatId: string ) {
        this.afs.collection( "chats" )
            .doc( chatId )
            .delete()
            .then( () => "Chat has been deleted!" )
            .catch( () => "Chat cannot be deleted!" );
    }

    // sendText( value: TextModel ) {
    //     value.textId = this.afs.createId();
    //     this.afs.collection<ChatModel>( "chats" )
    //         .doc( value.chatId )
    //         .update( { messages: firestore.FieldValue.arrayUnion( value ) } )
    //         .then( () => console.log( "Text has been sent!" ) )
    //         .catch( () => new Toast( "Text could not be sent!", 1000 ).show() );
    // }
    //
    updateText( textId: string, value: TextModel ) {
        this.afs.collection<ChatModel>( "chats/" + value.chatId + "/" )
            .doc( "messages/" + textId )
            .update( value )
            .then( () => console.log( "Text was updated!" ) )
            .catch( () => console.log( "Text could not be updated!" ) );
    }

}
