import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

//Ngrx
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';

import Swal from 'sweetalert2';
import * as ui from 'src/app/shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit, OnDestroy {
  public loginForm: FormGroup;
  public cargando: boolean = false;
  uiSubscription: Subscription;

  constructor( 
      private fb: FormBuilder ,
      private auth: AuthService,
      private router: Router,
      private store: Store<AppState>
    ) { }

  ngOnInit() {
    this.uiSubscription = this.store.select( 'ui' ).subscribe(  ui => {
      this.cargando = ui.isLoading;
    });
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    })
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  loginF(){
    /* Swal.fire({
      title: 'Ingresando',
      didOpen: () => {
        Swal.showLoading()
      }
    }); */

    this.store.dispatch( ui.isLoading() )

    const { correo, password } = this.loginForm.value;
    this.auth.ingresoUsuario( correo, password )
      .then(  res =>{
        /* Swal.close(); */
        this.store.dispatch( ui.stopLoading() );
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
