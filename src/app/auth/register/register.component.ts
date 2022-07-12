import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/services/auth.service';

//Ngrx
import { AppState } from 'src/app/app.reducer';
import * as ui from 'src/app/shared/ui.actions';
import { Subscription } from 'rxjs';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []

})
export class RegisterComponent implements OnInit, OnDestroy {
  formGroup: FormGroup;
  public cargando: boolean = false;
  uiSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router:Router,
    private store:Store<AppState>
    ) { }

  ngOnInit() {
    this.uiSubscription = this.store.select( 'ui' ).subscribe(  ui => {
      this.cargando = ui.isLoading;
      console.log('cargando subs')
    });

    this.formGroup = this.fb.group({
      nombre: ['',[ Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    })
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  crearUsuario(){
    /* Swal.fire({
      title: 'Creando usuario',
      didOpen: () => {
        Swal.showLoading()
      }
    }); */
    this.store.dispatch( ui.isLoading() )
    const { nombre, correo, password } = this.formGroup.value;
    this.authService.crearUsuario( nombre, correo, password  )
      .then(  res=>{
        this.store.dispatch( ui.stopLoading() );
        //Swal.close();
        this.router.navigate(['/']);
        console.log( res );
      })
      .catch(err=> {
        this.store.dispatch( ui.stopLoading() );
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.message,
        })
      });
  }

}
