import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { IngresoEgreso } from 'src/app/auth/models/ingresoEgreso';
import { IngresoEgresoService } from 'src/app/services/ingreso-egreso.service';
import Swal from 'sweetalert2';
import { AppStateWithIngreso } from '../ingreso-egreso.reducer';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: []
})
export class DetalleComponent implements OnInit, OnDestroy {
  ingresosEgresos: IngresoEgreso[] = [];
  ingresosSubs: Subscription;

  constructor(
    private store: Store<AppStateWithIngreso>,
    private ingresoEgresoService: IngresoEgresoService
  ) { }

  ngOnInit() {
    this.ingresosSubs = this.store.select( 'ingresosEgresos' )
      .subscribe( ({items}) =>{
        this.ingresosEgresos = items;
      });
  }

  borrar(id){
    this.ingresoEgresoService.borrarIngresoEgreso( id )
      .then(  ()=> Swal.fire('Elemento Borrado', `Se ha eliminado elelemento con id ${id}`, 'info') )
      .catch( err=> {
        ()=> Swal.fire('Error', `El elemento no se ha eliminado elelemento con id ${id}`, 'error')
      });
  }

  ngOnDestroy(): void {
    this.ingresosSubs.unsubscribe();
  }

}
