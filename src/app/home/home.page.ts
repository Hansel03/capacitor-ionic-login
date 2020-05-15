import { Component } from '@angular/core';
import { UsuarioService, Credenciales } from '../services/usuario.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  user: Credenciales = {};

  constructor(private usuarioService: UsuarioService) {
    console.log(usuarioService.usuario);
    this.user = this.usuarioService.usuario;
  }

  logout() {
    this.usuarioService.logoutFireBase();
  }
}
