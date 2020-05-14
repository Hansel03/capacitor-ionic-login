import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { UsuarioService } from '../services/usuario.service';
import { Plugins } from '@capacitor/core';
import { FacebookLoginResponse } from '@rdlabo/capacitor-facebook-login';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  constructor(
    private afAuth: AngularFireAuth,
    private usuarioService: UsuarioService,
    private platform: Platform
  ) {}

  ngOnInit() {}

  async signInWithFacebook() {
    if (this.platform.is('cordova')) {
      const { FacebookLogin } = Plugins;
      const FACEBOOK_PERMISSIONS = [
        'email',
        'user_birthday',
        'user_photos',
        'user_gender',
      ];
      const result = await FacebookLogin.login({
        permissions: FACEBOOK_PERMISSIONS,
      });

      if (result.accessToken) {
        // Login successful.
        console.log('entro');
        console.log(JSON.stringify(result));
        this.usuarioService.getFacebookUserDataAndroid(
          result.accessToken.token
        );
        console.log(`Facebook access token is ${result.accessToken.token}`);
      } else {
        // Cancelled by user.
        console.log('no entro');
      }
    } else {
      //web
      this.afAuth.auth
        .signInWithPopup(new firebase.auth.FacebookAuthProvider())
        .then(
          (res) => {
            console.log(res);
            const user = res.user;
            this.usuarioService.cargarUsuario(
              user.displayName,
              user.email,
              user.photoURL,
              user.uid,
              'facebook'
            );
          },
          (err) => {
            // Handle error
            console.log(err);
          }
        );
    }
  }
}
