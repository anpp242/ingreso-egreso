import { createReducer, on } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { IngresoEgreso } from '../auth/models/ingresoEgreso';
import { setItems, UnSetItems } from './ingreso-egreso.actions';

export interface State {
    items: IngresoEgreso[]; 
}

export const initialState: State = {
    items: [],
}

export interface AppStateWithIngreso extends AppState{
    ingresosEgresos: State
}

const _ingresoEgresoReducer = createReducer(initialState,

    on(setItems, (state, { items } ) => ({ ...state, items: [...items]})),
    on(UnSetItems, state => ({ ...state, items: []})),
    
);

export function ingresoEgresoReducer(state, action) {
    return _ingresoEgresoReducer(state, action);
}