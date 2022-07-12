import { Pipe, PipeTransform } from '@angular/core';
import { IngresoEgreso } from '../auth/models/ingresoEgreso';

@Pipe({
  name: 'ordenIngreso'
})
export class OrdenIngresoPipe implements PipeTransform {

  transform(items: IngresoEgreso[]): IngresoEgreso[] {
    const newItems = [...items]
    return newItems.sort( (a) =>{
      if( a.tipo === 'ingreso' ){
        return -1;
      }else{
        return 1;
      }
    } )
  }

}
