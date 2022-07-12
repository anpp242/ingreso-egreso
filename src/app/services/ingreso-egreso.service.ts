import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { IngresoEgreso } from '../auth/models/ingresoEgreso';
import { Usuario } from '../auth/models/usuario.model';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  constructor(
    private firestore: AngularFirestore,
    private auth: AuthService
  ) {  }

  crearIngresoEgreso( ingresoEgreso: IngresoEgreso ){
    return this.firestore.doc(`${this.auth.user.uid}/ingreso-egreso`)
      .collection('items')
      .add( {...ingresoEgreso} )
  }

  initIngresosEgresosListener(uid){
    return this.firestore.collection(`${uid}/ingreso-egreso/items`)
      //.valueChanges()
      .snapshotChanges()
      .pipe(
        map( snapshot =>{
          return snapshot.map( doc => {
            const data: {} = doc.payload.doc.data();
            return {
              uid: doc.payload.doc.id,
              ...data
            }
          })
        })
      )
  }

  borrarIngresoEgreso( uidItem ){
    return this.firestore.doc(`${this.auth.user.uid}/ingreso-egreso/items/${uidItem}`).delete();
  }
}
