import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IngresoEgreso } from '../auth/models/ingresoEgreso';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as ui from '../shared/ui.actions';
import { Subscriber, Subscription } from 'rxjs';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: []
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {
  
  ingresoForm:FormGroup;
  tipo: string = 'ingreso';
  loading: boolean = false;
  loadingSubs: Subscription;

  constructor(
    private fb: FormBuilder,
    private ingresoEgresoService: IngresoEgresoService,
    private store: Store<AppState>,
  ) { }

  ngOnInit() {
    this.loadingSubs =  this.store.select( 'ui' ).subscribe( ({isLoading}) => this.loading = isLoading );

    this.ingresoForm = this.fb.group({
      descripcion: ['', Validators.required],
      monto: ['', Validators.required],
    });
  }

  guardar(){
    this.store.dispatch( ui.isLoading() );

    if(this.ingresoForm.invalid){return}
    console.log(this.ingresoForm.value);
    const { descripcion, monto } = this.ingresoForm.value;
    const ingresoEgreso = new IngresoEgreso( descripcion, monto, this.tipo );

    this.ingresoEgresoService.crearIngresoEgreso( ingresoEgreso )
      .then(()=>{
        this.ingresoForm.reset();
        this.tipo = 'ingreso';
        this.store.dispatch( ui.stopLoading() ); 
        Swal.fire('Registro creado', descripcion, 'success');
      })
      .catch((err)=>{
        this.store.dispatch( ui.stopLoading() ); 
        Swal.fire('Upps!', err.message, 'error');
      });
  }

  ngOnDestroy(): void {
    this.loadingSubs.unsubscribe();
  }

}
