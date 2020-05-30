import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import { User } from "./user.model";
import { ChatModel } from "./chat.model";
import { TextModel } from "./text.model";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { AngularFireAuth } from "@angular/fire/auth";
import * as firebase from "firebase";


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

@Injectable( {
                 providedIn: "root"
             } )
export class UserService {
    userSubject = new BehaviorSubject<User>( null );
    private tokenExpirationTimer: any;

    constructor( private store: AngularFireDatabase, private router: Router, private auth: AngularFireAuth ) { }

    fetchUsers( child1?: string, value1?: string ) {
        if ( child1 ) {
            return this.store.list<User>( "users", ref => ref.orderByChild( child1 ).equalTo( value1 ) ).valueChanges();
        } else {
            return this.store.list<User>( "users" ).valueChanges();
        }
    }

    addUser( value: User ) {
        this.store.list<User>( "users" ).push( value ).then( value1 => {
            value.userId = value1.key;
            this.updateUser( value1.key, value );
        } );
    }

    updateUser( userId: string, user: User ) {
        this.store.list<User>( "users" ).update( userId, user );
    }


    fetchChats( child: string, value: string ) {
        this.store.list<ChatModel>( "chats", ref => ref.orderByChild( child ).equalTo( value ) ).valueChanges();
    }

    addChat( value: ChatModel ) {
        this.store.list<ChatModel>( "chats" ).push( value ).then( value1 => {
            value.chatId = value1.key;
            this.updateChat( value1.key, value );
        } );
    }

    updateChat( chatId: string, value: ChatModel ) {
        this.store.list<ChatModel>( "chats" ).update( chatId, value );
    }

    sendText( value: TextModel ) {
        this.store.list<TextModel>( "chats/" + value.chatId ).push( value ).then( value1 => {
            value.textId = value1.key;
            this.updateText( value1.key, value );
        } );
    }

    updateText( textId: string, value: TextModel ) {
        this.store.list<TextModel>( "chats/" + value.chatId ).update( textId, value );
    }

    login( email: string, password: string ) {
        firebase.auth().signInWithEmailAndPassword( email, password ).catch().then( () => {
            let sub = this.fetchUsers( "userEmail", email ).subscribe( value => {
                this.userSubject.next( value[0] );
                localStorage.setItem( "userData", JSON.stringify( value[0].userEmail ) );
                this.router.navigate( [ "/dashboard" ] );
                sub.unsubscribe();
            } );
        } );
    }

    signUp( email: string, password: string, user: User ) {
        firebase.auth().createUserWithEmailAndPassword( email, password ).catch().then( () => {
            this.addUser( user );
            this.userSubject.next( user );
            localStorage.setItem( "userData", JSON.stringify( user.userEmail ) );
            this.router.navigate( [ "/dashboard" ] );
        } );
    }

    logout(): void {
        firebase.auth().signOut().then( value => {
            this.userSubject.next( null );  // Clear current subject
            localStorage.removeItem( "userData" );  // Clear local storage
            this.router.navigate( [ "/login" ] );
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

}
