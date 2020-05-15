import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

export interface Credenciales {
  nombre?: string;
  email?: string;
  imagen?: string;
  uid?: string;
  provider?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  usuario: Credenciales = {};

  constructor(private router: Router, private httpClient: HttpClient) {}

  cargarUsuario(
    nombre: string,
    email: string,
    imagen: string,
    uid: string,
    provider: string
  ) {
    this.usuario.nombre = nombre;
    this.usuario.email = email;
    this.usuario.imagen = imagen;
    this.usuario.uid = uid;
    this.usuario.provider = provider;
    this.router.navigate(['home']);
  }

  /**
   * Servicoo para consultar los datos personas de un usuario de facebook con el token
   *
   * @param {*} accessToken
   * @memberof UsuarioService
   */
  getFacebookUserDataAndroid(accessToken) {
    const endpoint = `https://graph.facebook.com/me?fields=name,email,picture.width(400).height(400)&access_token=${accessToken}`;

    this.httpClient
      .get(endpoint)
      .toPromise()
      .then((result: any) => {
        this.cargarUsuario(
          result.name,
          result.email,
          result.picture.data.url,
          result.id,
          'facebook'
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
