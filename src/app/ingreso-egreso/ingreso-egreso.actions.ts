import { createAction, props } from '@ngrx/store';
import { IngresoEgreso } from '../auth/models/ingresoEgreso';

export const setItems = createAction('[IngresoEgreso] Set Items', 
props<{items: IngresoEgreso[]}>()
);
export const UnSetItems = createAction('[IngresoEgreso] UnSet Items');