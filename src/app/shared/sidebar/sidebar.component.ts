import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { Usuario } from 'src/app/auth/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit, OnDestroy {
  user: string;
  usuarioSubs: Subscription;

  constructor(
    private auth: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    this.usuarioSubs = this.store.select('user')
      .subscribe( ({user})=> this.user = user?.nombre);
  }

  logOut(){
    this.auth.logOut()
      .then(  res =>{
        this.router.navigate(['/login']);
      });
  }

  ngOnDestroy(): void {
    this.usuarioSubs.unsubscribe();
  }

}
