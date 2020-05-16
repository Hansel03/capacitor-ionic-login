import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/auth';

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
export class UsuarioService implements CanActivate {
  usuario: Credenciales = {};

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private afAuth: AngularFireAuth
  ) {}

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

  async logoutFireBase() {
    // hacemos logout de firebase
    await this.afAuth.auth
      .signOut()
      .then(() => {
        // limpiamos el usuario
        this.usuario = {};
        this.router.navigate(['login']);
      })
      .catch((err) => {
        console.log('exploto' + JSON.stringify(err));
      });
  }

  canActivate() {
    // verificamos que el usuario este autenticado en firebase
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.usuario.nombre = user.displayName;
        this.usuario.email = user.email;
        this.usuario.imagen = user.photoURL;
        this.usuario.uid = user.uid;
        this.usuario.provider = user.providerId;
        // logged in so return true
        this.router.navigate(['home']);
        return false;
      }
    });
    // not logged in so redirect to login page
    return true;
  }
}
