import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import * as actions from '../auth/auth.actions';
import { Usuario } from '../auth/models/usuario.model';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authSubscription: Subscription;
  private _user: Usuario;

  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private store: Store
  ) { }

  get user(){
    return this._user;
  }

  fireListener(){
    this.auth.authState.subscribe( fuser=>{
      if(fuser){
        this.authSubscription = this.firestore.doc(`${fuser.uid}/usuario`).valueChanges()
          .subscribe( (user:Usuario) =>{
            const usr = Usuario.fromFire(user);
            this._user = usr;
            this.store.dispatch( actions.setUser({user}) )
          });
      }else{
        this._user = null;
        this.authSubscription?.unsubscribe();
        this.store.dispatch( actions.unSetUser() );
        this.store.dispatch( ingresoEgresoActions.UnSetItems() );
      }
    } );
  }

  crearUsuario( nombre: string, email:string, password:string ){
    return this.auth.createUserWithEmailAndPassword( email, password )
      .then( ({user})=>{
        const newUser = new Usuario( user.uid, nombre, user.email );
        return this.firestore.doc(`${user.uid}/usuario`)
          .set({...newUser});
      } );
  }

  ingresoUsuario( correo:string, password:string ){
    return this.auth.signInWithEmailAndPassword( correo, password );
  }

  logOut(){
    return this.auth.signOut();
  }

  isAuth(){
    return this.auth.authState.pipe(
      map( fUser=> fUser !== null)
    );
  }
}
